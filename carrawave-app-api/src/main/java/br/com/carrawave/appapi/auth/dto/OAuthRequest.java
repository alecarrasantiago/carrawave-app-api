package br.com.carrawave.appapi.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record OAuthRequest(
        @NotBlank String idToken,
        @NotNull UUID deviceId
) {
}
