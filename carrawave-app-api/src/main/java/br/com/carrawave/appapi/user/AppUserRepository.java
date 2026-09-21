package br.com.carrawave.appapi.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByPublicId(UUID publicId);

    Optional<AppUser> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    Optional<AppUser> findByOauthProviderAndOauthSubject(String provider, String subject);
}
