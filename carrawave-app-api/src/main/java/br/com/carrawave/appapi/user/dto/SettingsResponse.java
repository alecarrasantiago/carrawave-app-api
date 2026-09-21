package br.com.carrawave.appapi.user.dto;

public record SettingsResponse(
        String theme,
        String audioQuality,
        boolean autoplay,
        Integer sleepTimerMinutes
) {
}
