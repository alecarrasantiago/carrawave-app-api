package br.com.carrawave.appapi.playback.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record StopPlaybackRequest(
        @NotNull @Min(0) Integer playedSeconds,
        @NotBlank String reason
) {
}
