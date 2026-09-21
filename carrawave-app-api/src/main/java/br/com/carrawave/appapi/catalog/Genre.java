package br.com.carrawave.appapi.catalog;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "genre")
@Getter
@Setter
@NoArgsConstructor
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true)
    private UUID publicId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;
}
