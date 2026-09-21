package br.com.carrawave.appapi.user.dto;

import jakarta.validation.constraints.Pattern;

public record UpdateSettingsRequest(
        @Pattern(regexp = "LIGHT|DARK|SYSTEM") String theme,
        @Pattern(regexp = "AUTO|HIGH|DATA_SAVER") String audioQuality,
        Boolean autoplay,
        Integer sleepTimerMinutes
) {
}
