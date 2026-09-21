package br.com.carrawave.appapi.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LogoutRequest(@NotBlank String refreshToken) {
}
