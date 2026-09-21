package br.com.carrawave.appapi.catalog.dto;

import java.time.Instant;

public record CurrentProgram(String title, String host, Instant startsAt, Instant endsAt) {
}
