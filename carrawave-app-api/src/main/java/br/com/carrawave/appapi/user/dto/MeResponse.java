package br.com.carrawave.appapi.user.dto;

import java.time.Instant;
import java.util.UUID;

public record MeResponse(
        UUID userId,
        String accountType,
        String displayName,
        String email,
        UUID deviceId,
        String anonymousLabel,
        long favoriteCount,
        Instant createdAt
) {
}
