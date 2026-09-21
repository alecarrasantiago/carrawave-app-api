package br.com.carrawave.appapi.catalog;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "station")
@Getter
@Setter
@NoArgsConstructor
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true)
    private UUID publicId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    private String frequency;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @Column(name = "stream_url", nullable = false, columnDefinition = "text")
    private String streamUrl;

    @Column(name = "stream_format", nullable = false)
    private String streamFormat;

    @Column(name = "artwork_url", columnDefinition = "text")
    private String artworkUrl;

    @Column(name = "artwork_color")
    private String artworkColor;

    private String initials;

    @Column(columnDefinition = "text")
    private String website;

    @Column(columnDefinition = "text")
    private String description;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "sort_weight", nullable = false)
    private int sortWeight = 0;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "station_genre",
            joinColumns = @JoinColumn(name = "station_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genres = new HashSet<>();
}
