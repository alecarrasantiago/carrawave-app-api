package br.com.carrawave.appapi.catalog;

import br.com.carrawave.appapi.common.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * Expõe "o que está tocando agora" pra rádios que enviam o metadado ICY
 * (ver {@link IcyMetadataFetcher}). Guarda um cache curto por rádio pra não
 * abrir uma conexão nova no stream a cada request do app — vários ouvintes
 * pedindo a mesma rádio ao mesmo tempo reaproveitam o mesmo resultado.
 */
@Service
public class NowPlayingService {

    private static final Logger log = LoggerFactory.getLogger(NowPlayingService.class);

    // Tempo que um resultado (mesmo "sem informação") fica valendo antes de
    // tentarmos buscar de novo — curto o bastante pra acompanhar a troca de
    // música, longo o bastante pra não sobrecarregar o stream de terceiro.
    private static final long CACHE_TTL_MILLIS = 20_000;
    private static final long FETCH_TIMEOUT_SECONDS = 6;

    private final StationRepository stationRepository;
    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
    private final Map<Long, CacheEntry> cache = new ConcurrentHashMap<>();

    public NowPlayingService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    public String getNowPlaying(UUID stationPublicId) {
        // TEMP-DEBUG: captura qualquer falha e devolve o motivo real no
        // corpo da resposta, só pra diagnosticar o 500 — será revertido
        // assim que a causa for confirmada.
        try {
            Station station = stationRepository.findByPublicId(stationPublicId)
                    .orElseThrow(ApiException::stationNotFound);

            if ("HLS".equalsIgnoreCase(station.getStreamFormat())) {
                return null;
            }

            long stationId = station.getId();
            CacheEntry cached = cache.get(stationId);
            long now = System.currentTimeMillis();
            if (cached != null && now - cached.fetchedAt < CACHE_TTL_MILLIS) {
                return cached.title;
            }

            String title = fetchWithTimeout(station.getStreamUrl());
            cache.put(stationId, new CacheEntry(title, now));
            return title;
        } catch (ApiException e) {
            throw e;
        } catch (Throwable t) {
            java.io.StringWriter sw = new java.io.StringWriter();
            t.printStackTrace(new java.io.PrintWriter(sw));
            return "TEMP-DEBUG: " + sw.toString().substring(0, Math.min(1500, sw.toString().length()));
        }
    }

    private String fetchWithTimeout(String streamUrl) {
        Future<String> future = executor.submit(() -> IcyMetadataFetcher.fetch(streamUrl));
        try {
            return future.get(FETCH_TIMEOUT_SECONDS, TimeUnit.SECONDS);
        } catch (TimeoutException e) {
            future.cancel(true);
            return null;
        } catch (Exception e) {
            log.debug("Falha ao ler metadado ICY de {}: {}", streamUrl, e.toString());
            return null;
        }
    }

    private record CacheEntry(String title, long fetchedAt) {
    }
}
