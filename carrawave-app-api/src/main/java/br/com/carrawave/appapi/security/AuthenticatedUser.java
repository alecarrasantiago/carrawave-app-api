package br.com.carrawave.appapi.security;

import java.util.UUID;

/**
 * Representa o usuário autenticado (anônimo ou registrado) extraído do JWT.
 * Disponível nos controllers via {@code @AuthenticationPrincipal}.
 */
public record AuthenticatedUser(
        UUID userId,
        UUID deviceId,
        String accountType,
        String platform
) {
    public boolean isAnonymous() {
        return "ANONYMOUS".equals(accountType);
    }
}
