package br.com.carrawave.appapi.user.dto;

import br.com.carrawave.appapi.catalog.dto.StationSummary;

import java.time.Instant;

public record HistoryItem(StationSummary station, Instant lastPlayedAt) {
}
