package br.com.carrawave.appapi.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class JwtService {

    private final SecretKey key;
    private final long accessTtlMinutes;

    public JwtService(
            @Value("${carrawave.jwt.secret}") String secret,
            @Value("${carrawave.jwt.access-ttl-minutes:60}") long accessTtlMinutes
    ) {
        // Garante 256 bits mesmo se o secret configurado for curto (só acontece em dev).
        byte[] rawKey = secret.getBytes(StandardCharsets.UTF_8);
        if (rawKey.length < 32) {
            byte[] padded = new byte[32];
            System.arraycopy(rawKey, 0, padded, 0, rawKey.length);
            rawKey = padded;
        }
        this.key = Keys.hmacShaKeyFor(rawKey);
        this.accessTtlMinutes = accessTtlMinutes;
    }

    public String generateAccessToken(UUID userId, UUID deviceId, String accountType, String platform, List<String> roles) {
        Instant now = Instant.now();
        Instant expiry = now.plus(Duration.ofMinutes(accessTtlMinutes));
        return Jwts.builder()
                .subject(userId.toString())
                .claim("deviceId", deviceId.toString())
                .claim("accountType", accountType)
                .claim("platform", platform)
                .claim("roles", roles)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
    }

    public long getAccessTtlSeconds() {
        return accessTtlMinutes * 60;
    }

    public DecodedToken decodeAndValidate(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(key).build()
                    .parseSignedClaims(token)
                    .getPayload();
            return new DecodedToken(
                    UUID.fromString(claims.getSubject()),
                    UUID.fromString(claims.get("deviceId", String.class)),
                    claims.get("accountType", String.class),
                    claims.get("platform", String.class),
                    claims.get("roles", List.class),
                    false
            );
        } catch (ExpiredJwtException e) {
            Claims claims = e.getClaims();
            return new DecodedToken(
                    UUID.fromString(claims.getSubject()),
                    UUID.fromString(claims.get("deviceId", String.class)),
                    claims.get("accountType", String.class),
                    claims.get("platform", String.class),
                    claims.get("roles", List.class),
                    true
            );
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    public record DecodedToken(
            UUID userId,
            UUID deviceId,
            String accountType,
            String platform,
            List<String> roles,
            boolean expired
    ) {
    }
}
