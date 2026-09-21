package br.com.carrawave.appapi.catalog.dto;

import java.util.List;
import java.util.UUID;

public record StationSummary(
        UUID id,
        String name,
        String slug,
        String frequency,
        CitySummary city,
        List<GenreSummary> genres,
        String streamUrl,
        String streamFormat,
        String artworkUrl,
        String artworkColor,
        String initials,
        String website,
        String description,
        boolean live,
        Long listenersNow,
        boolean favorited
) {
}
