package br.com.carrawave.appapi.auth.dto;

import java.util.UUID;

public record AuthResponse(
        UUID userId,
        String accountType,
        String displayName,
        String email,
        String accessToken,
        String refreshToken,
        long expiresIn,
        MergedInfo merged
) {
    public static AuthResponse anonymous(UUID userId, String accessToken, String refreshToken, long expiresIn) {
        return new AuthResponse(userId, "ANONYMOUS", null, null, accessToken, refreshToken, expiresIn, null);
    }

    public static AuthResponse registered(UUID userId, String displayName, String email,
                                           String accessToken, String refreshToken, long expiresIn,
                                           MergedInfo merged) {
        return new AuthResponse(userId, "REGISTERED", displayName, email, accessToken, refreshToken, expiresIn, merged);
    }

    public record MergedInfo(int favoritesMoved, int sessionsMoved) {
    }
}
