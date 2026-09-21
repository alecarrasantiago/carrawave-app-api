package br.com.carrawave.appapi.catalog.dto;

import java.util.List;

public record HomeResponse(
        String greeting,
        List<StationSummary> liveNow,
        List<Section> sections,
        List<GenreSummary> genres
) {
    public record Section(String key, String title, List<StationSummary> stations) {
    }
}
