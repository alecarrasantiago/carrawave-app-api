package br.com.carrawave.appapi.catalog;

import br.com.carrawave.appapi.common.ApiException;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Guarda em memória o endereço do stream de cada rádio. Rádios só mudam via
 * migração + deploy (que reinicia o processo e limpa isto), então não há o
 * que expirar. Evita ir ao banco toda vez que alguém dá play ou o app pede
 * "tocando agora" (a cada ~20 s por ouvinte) — isso mantinha o Neon acordado.
 */
@Component
public class StreamInfoCache {

    public record StreamInfo(long stationId, String streamUrl, String streamFormat) {
    }

    private final StationRepository stationRepository;
    private final Map<UUID, StreamInfo> cache = new ConcurrentHashMap<>();

    public StreamInfoCache(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    public StreamInfo get(UUID stationPublicId) {
        StreamInfo cached = cache.get(stationPublicId);
        if (cached != null) {
            return cached;
        }
        Station station = stationRepository.findByPublicId(stationPublicId)
                .orElseThrow(ApiException::stationNotFound);
        StreamInfo info = new StreamInfo(station.getId(), station.getStreamUrl(), station.getStreamFormat());
        cache.put(stationPublicId, info);
        return info;
    }
}
