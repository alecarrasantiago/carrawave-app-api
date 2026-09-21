package br.com.carrawave.appapi.catalog;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public final class StationSpecifications {

    private StationSpecifications() {
    }

    public static Specification<Station> active() {
        return (root, query, cb) -> cb.isTrue(root.get("active"));
    }

    public static Specification<Station> cityIs(UUID cityPublicId) {
        return (root, query, cb) -> cb.equal(root.get("city").get("publicId"), cityPublicId);
    }

    public static Specification<Station> stateIs(String state) {
        return (root, query, cb) -> cb.equal(cb.upper(root.get("city").get("state")), state.toUpperCase());
    }

    public static Specification<Station> genreIs(UUID genrePublicId) {
        return (root, query, cb) -> {
            Join<Object, Object> genreJoin = root.join("genres", JoinType.INNER);
            return cb.equal(genreJoin.get("publicId"), genrePublicId);
        };
    }

    public static Specification<Station> nameOrFrequencyContains(String term) {
        String like = "%" + term.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), like),
                cb.like(cb.lower(root.get("frequency")), like)
        );
    }
}
