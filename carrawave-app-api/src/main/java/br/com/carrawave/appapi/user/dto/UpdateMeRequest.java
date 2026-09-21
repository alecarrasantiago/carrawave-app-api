package br.com.carrawave.appapi.user.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateMeRequest(@NotBlank String displayName) {
}
