package br.com.carrawave.appapi.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface GenreRepository extends JpaRepository<Genre, Long> {
    Optional<Genre> findByPublicId(UUID publicId);
}
