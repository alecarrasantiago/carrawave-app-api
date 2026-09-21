package br.com.carrawave.appapi.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StationRepository extends JpaRepository<Station, Long>, JpaSpecificationExecutor<Station> {
    Optional<Station> findByPublicId(UUID publicId);

    Optional<Station> findBySlug(String slug);

    List<Station> findTop6ByCityIdAndActiveTrueAndIdNot(Long cityId, Long excludedId);

    long countByCityId(Long cityId);
}
