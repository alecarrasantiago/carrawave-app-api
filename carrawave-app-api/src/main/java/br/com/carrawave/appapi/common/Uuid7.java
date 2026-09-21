package br.com.carrawave.appapi.common;

import java.security.SecureRandom;
import java.util.UUID;

/**
 * Gerador simples de UUID v7 (ordenável por tempo) — usado para IDs públicos
 * gerados pelo servidor (userId, sessionId), conforme o API-CONTRACT.md.
 */
public final class Uuid7 {

    private static final SecureRandom RANDOM = new SecureRandom();

    private Uuid7() {
    }

    public static UUID generate() {
        long timestamp = System.currentTimeMillis() & 0xFFFFFFFFFFFFL; // 48 bits
        long randA = RANDOM.nextInt(1 << 12); // 12 bits

        long mostSigBits = (timestamp << 16) | (0x7L << 12) | randA;

        long randB = RANDOM.nextLong() & 0x3FFFFFFFFFFFFFFFL; // 62 bits
        long leastSigBits = (0x2L << 62) | randB;

        return new UUID(mostSigBits, leastSigBits);
    }
}
