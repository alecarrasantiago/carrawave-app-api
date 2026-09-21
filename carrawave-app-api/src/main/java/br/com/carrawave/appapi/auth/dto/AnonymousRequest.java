package br.com.carrawave.appapi.auth.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AnonymousRequest(
        @NotNull UUID deviceId,
        @NotNull String platform,
        String appVersion,
        String osVersion,
        String locale,
        String timezone
) {
}
