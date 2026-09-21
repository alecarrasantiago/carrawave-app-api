package br.com.carrawave.appapi.catalog;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "city")
@Getter
@Setter
@NoArgsConstructor
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true)
    private UUID publicId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 2)
    private String state;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
