package br.com.carrawave.appapi.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "favorite")
@Getter
@Setter
@NoArgsConstructor
@IdClass(Favorite.FavoriteId.class)
public class Favorite {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Id
    @Column(name = "station_id")
    private Long stationId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public Favorite(Long userId, Long stationId) {
        this.userId = userId;
        this.stationId = stationId;
        this.createdAt = Instant.now();
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class FavoriteId implements Serializable {
        private Long userId;
        private Long stationId;

        public FavoriteId(Long userId, Long stationId) {
            this.userId = userId;
            this.stationId = stationId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof FavoriteId that)) return false;
            return Objects.equals(userId, that.userId) && Objects.equals(stationId, that.stationId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(userId, stationId);
        }
    }
}
