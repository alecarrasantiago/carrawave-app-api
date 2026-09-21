package br.com.carrawave.appapi.auth;

import br.com.carrawave.appapi.auth.dto.*;
import br.com.carrawave.appapi.common.ApiException;
import br.com.carrawave.appapi.common.Uuid7;
import br.com.carrawave.appapi.playback.PlaySessionRepository;
import br.com.carrawave.appapi.security.JwtService;
import br.com.carrawave.appapi.user.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final DeviceRepository deviceRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final FavoriteRepository favoriteRepository;
    private final PlaySessionRepository playSessionRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final long refreshTtlDays;
    private final SecureRandom random = new SecureRandom();

    public AuthService(
            AppUserRepository appUserRepository,
            DeviceRepository deviceRepository,
            UserSettingsRepository userSettingsRepository,
            FavoriteRepository favoriteRepository,
            PlaySessionRepository playSessionRepository,
            RefreshTokenRepository refreshTokenRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            @Value("${carrawave.jwt.refresh-ttl-days:60}") long refreshTtlDays
    ) {
        this.appUserRepository = appUserRepository;
        this.deviceRepository = deviceRepository;
        this.userSettingsRepository = userSettingsRepository;
        this.favoriteRepository = favoriteRepository;
        this.playSessionRepository = playSessionRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.refreshTtlDays = refreshTtlDays;
    }

    @Transactional
    public AuthResponse anonymous(AnonymousRequest request) {
        Instant now = Instant.now();

        Device device = deviceRepository.findByDeviceId(request.deviceId()).orElse(null);
        AppUser user;

        if (device != null) {
            user = device.getUser();
            user.setLastSeenAt(now);
            device.setLastSeenAt(now);
            device.setAppVersion(request.appVersion());
            device.setOsVersion(request.osVersion());
            appUserRepository.save(user);
            deviceRepository.save(device);
        } else {
            user = new AppUser();
            user.setPublicId(Uuid7.generate());
            user.setAccountType(AppUser.ANONYMOUS);
            user.setCreatedAt(now);
            user.setLastSeenAt(now);
            user = appUserRepository.save(user);

            device = new Device();
            device.setDeviceId(request.deviceId());
            device.setUser(user);
            device.setPlatform(request.platform());
            device.setAppVersion(request.appVersion());
            device.setOsVersion(request.osVersion());
            device.setLocale(request.locale());
            device.setTimezone(request.timezone());
            device.setFirstSeenAt(now);
            device.setLastSeenAt(now);
            deviceRepository.save(device);

            userSettingsRepository.save(new UserSettings(user.getId()));
        }

        String accessToken = jwtService.generateAccessToken(
                user.getPublicId(), request.deviceId(), user.getAccountType(), request.platform(), List.of("ROLE_USER"));
        String refreshToken = issueRefreshToken(user.getId());

        return AuthResponse.anonymous(user.getPublicId(), accessToken, refreshToken, jwtService.getAccessTtlSeconds());
    }

    @Transactional
    public AuthResponse login(LoginRequest request, String anonymousBearerToken) {
        AppUser user = appUserRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(ApiException::invalidCredentials);

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw ApiException.invalidCredentials();
        }

        return completeLogin(user, request.deviceId(), anonymousBearerToken, "WEB");
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, String anonymousBearerToken) {
        if (appUserRepository.existsByEmailIgnoreCase(request.email())) {
            throw ApiException.emailAlreadyRegistered();
        }

        AppUser user = new AppUser();
        user.setPublicId(Uuid7.generate());
        user.setAccountType(AppUser.REGISTERED);
        user.setEmail(request.email());
        user.setDisplayName(request.displayName());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setCreatedAt(Instant.now());
        user.setLastSeenAt(Instant.now());
        user = appUserRepository.save(user);
        userSettingsRepository.save(new UserSettings(user.getId()));

        return completeLogin(user, request.deviceId(), anonymousBearerToken, "WEB");
    }

    private AuthResponse completeLogin(AppUser user, UUID deviceId, String anonymousBearerToken, String platformFallback) {
        AuthResponse.MergedInfo merged = null;

        Optional<Device> maybeDevice = deviceRepository.findByDeviceId(deviceId);
        String platform = maybeDevice.map(Device::getPlatform).orElse(platformFallback);

        if (anonymousBearerToken != null) {
            JwtService.DecodedToken decoded = jwtService.decodeAndValidate(anonymousBearerToken);
            if (decoded != null && "ANONYMOUS".equals(decoded.accountType())) {
                Optional<AppUser> anonymousUser = appUserRepository.findByPublicId(decoded.userId());
                if (anonymousUser.isPresent() && !anonymousUser.get().getId().equals(user.getId())) {
                    merged = mergeAnonymousInto(anonymousUser.get(), user);
                }
            }
        }

        Device device = maybeDevice.orElseGet(() -> {
            Device d = new Device();
            d.setDeviceId(deviceId);
            d.setPlatform(platformFallback);
            d.setFirstSeenAt(Instant.now());
            return d;
        });
        device.setUser(user);
        device.setLastSeenAt(Instant.now());
        deviceRepository.save(device);

        user.setLastSeenAt(Instant.now());
        appUserRepository.save(user);

        String accessToken = jwtService.generateAccessToken(
                user.getPublicId(), deviceId, user.getAccountType(), platform, List.of("ROLE_USER"));
        String refreshToken = issueRefreshToken(user.getId());

        return AuthResponse.registered(user.getPublicId(), user.getDisplayName(), user.getEmail(),
                accessToken, refreshToken, jwtService.getAccessTtlSeconds(), merged);
    }

    private AuthResponse.MergedInfo mergeAnonymousInto(AppUser anonymousUser, AppUser targetUser) {
        List<Favorite> anonymousFavorites = favoriteRepository.findByUserIdOrderByCreatedAtDesc(anonymousUser.getId());
        int favoritesMoved = 0;
        for (Favorite favorite : anonymousFavorites) {
            boolean alreadyHas = favoriteRepository.existsByUserIdAndStationId(targetUser.getId(), favorite.getStationId());
            if (!alreadyHas) {
                favoriteRepository.save(new Favorite(targetUser.getId(), favorite.getStationId()));
                favoritesMoved++;
            }
            favoriteRepository.deleteByUserIdAndStationId(anonymousUser.getId(), favorite.getStationId());
        }

        int sessionsMoved = playSessionRepository.reassignUser(anonymousUser.getId(), targetUser.getId());

        return new AuthResponse.MergedInfo(favoritesMoved, sessionsMoved);
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        String hash = hash(request.refreshToken());
        RefreshToken stored = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(ApiException::invalidToken);

        if (stored.getRevokedAt() != null) {
            // Token já usado antes: sinal de possível roubo/replay. Resposta de
            // segurança: revoga TODOS os refresh tokens válidos desse usuário,
            // forçando login novamente em todos os dispositivos.
            refreshTokenRepository.revokeAllForUser(stored.getUserId(), Instant.now());
            throw ApiException.invalidToken();
        }
        if (stored.getExpiresAt().isBefore(Instant.now())) {
            throw ApiException.tokenExpired();
        }

        stored.setRevokedAt(Instant.now());
        refreshTokenRepository.save(stored);

        AppUser user = appUserRepository.findById(stored.getUserId())
                .orElseThrow(ApiException::invalidToken);

        String newAccessToken = jwtService.generateAccessToken(
                user.getPublicId(), UUID.randomUUID(), user.getAccountType(), "WEB", List.of("ROLE_USER"));
        String newRefreshToken = issueRefreshToken(user.getId());

        if (user.isAnonymous()) {
            return AuthResponse.anonymous(user.getPublicId(), newAccessToken, newRefreshToken, jwtService.getAccessTtlSeconds());
        }
        return AuthResponse.registered(user.getPublicId(), user.getDisplayName(), user.getEmail(),
                newAccessToken, newRefreshToken, jwtService.getAccessTtlSeconds(), null);
    }

    @Transactional
    public void logout(LogoutRequest request) {
        refreshTokenRepository.findByTokenHash(hash(request.refreshToken()))
                .ifPresent(token -> {
                    token.setRevokedAt(Instant.now());
                    refreshTokenRepository.save(token);
                });
    }

    private String issueRefreshToken(Long userId) {
        byte[] bytes = new byte[48];
        random.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        RefreshToken entity = new RefreshToken();
        entity.setUserId(userId);
        entity.setTokenHash(hash(rawToken));
        entity.setExpiresAt(Instant.now().plus(Duration.ofDays(refreshTtlDays)));
        entity.setCreatedAt(Instant.now());
        refreshTokenRepository.save(entity);

        return rawToken;
    }

    private String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
