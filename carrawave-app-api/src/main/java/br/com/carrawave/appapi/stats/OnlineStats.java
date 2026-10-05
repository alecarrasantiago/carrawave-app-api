package br.com.carrawave.appapi.stats;

/** Contadores mostrados no app: pessoas com o app aberto e pessoas ouvindo rádio agora. */
public record OnlineStats(long online, long listening) {
}
