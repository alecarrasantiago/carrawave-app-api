package br.com.carrawave.appapi.playback.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record HeartbeatRequest(@NotNull @Min(0) Integer playedSeconds) {
}
