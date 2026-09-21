package br.com.carrawave.appapi.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record RegisterRequest(
        @NotBlank String displayName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, message = "A senha precisa ter pelo menos 6 caracteres.") String password,
        @NotNull UUID deviceId
) {
}
