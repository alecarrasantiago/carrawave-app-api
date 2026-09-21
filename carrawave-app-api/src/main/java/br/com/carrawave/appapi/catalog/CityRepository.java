package br.com.carrawave.appapi.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CityRepository extends JpaRepository<City, Long> {
    Optional<City> findByPublicId(UUID publicId);
}
