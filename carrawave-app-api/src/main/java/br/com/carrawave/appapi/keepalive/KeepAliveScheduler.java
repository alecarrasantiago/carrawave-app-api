package br.com.carrawave.appapi.keepalive;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Robô que impede o Render (plano grátis) de colocar o servidor pra dormir.
 *
 * O Render desliga o serviço depois de ~15 min sem NENHUMA requisição chegando
 * pela URL pública. Este robô bate na própria URL pública (a mesma que os
 * usuários usam, passando pelo proxy do Render) a cada 10 min, então o serviço
 * conta como "em uso" e nunca chega nos 15 min de silêncio.
 *
 * Limite: se o serviço já estiver dormindo, o robô dorme junto — por isso o
 * ping externo (GitHub Actions / UptimeRobot) continua existindo como plano B
 * pra acordar o servidor. Os dois juntos cobrem tudo.
 *
 * Só liga quando a variável RENDER_EXTERNAL_URL existe (o Render define
 * sozinha); no computador do desenvolvedor não faz nada.
 */
@Component
public class KeepAliveScheduler {

    private static final Logger log = LoggerFactory.getLogger(KeepAliveScheduler.class);

    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final String externalUrl;

    public KeepAliveScheduler(@Value("${RENDER_EXTERNAL_URL:}") String externalUrl) {
        this.externalUrl = externalUrl == null ? "" : externalUrl.trim();
    }

    // initialDelay evita bater antes de a aplicação terminar de subir.
    @Scheduled(initialDelay = 2 * 60_000, fixedDelay = 10 * 60_000)
    public void ping() {
        if (externalUrl.isEmpty()) {
            return;
        }
        String base = externalUrl.endsWith("/") ? externalUrl.substring(0, externalUrl.length() - 1) : externalUrl;
        try {
            HttpRequest request = HttpRequest.newBuilder(URI.create(base + "/actuator/health"))
                    .timeout(Duration.ofSeconds(30))
                    .GET()
                    .build();
            HttpResponse<Void> response = http.send(request, HttpResponse.BodyHandlers.discarding());
            log.debug("keep-alive: {} -> HTTP {}", base, response.statusCode());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } catch (Exception e) {
            log.warn("keep-alive falhou: {}", e.toString());
        }
    }
}
