package br.com.carrawave.appapi.catalog.dto;

import br.com.carrawave.appapi.catalog.Genre;

import java.util.UUID;

public record GenreSummary(UUID id, String name, String slug, Long stationCount) {
    public static GenreSummary from(Genre genre) {
        return new GenreSummary(genre.getPublicId(), genre.getName(), genre.getSlug(), null);
    }

    public static GenreSummary withCount(Genre genre, long stationCount) {
        return new GenreSummary(genre.getPublicId(), genre.getName(), genre.getSlug(), stationCount);
    }
}
