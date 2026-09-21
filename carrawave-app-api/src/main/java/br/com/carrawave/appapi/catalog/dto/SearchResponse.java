package br.com.carrawave.appapi.catalog.dto;

import java.util.List;

public record SearchResponse(
        List<StationSummary> stations,
        List<CitySummary> cities,
        List<GenreSummary> genres
) {
}
