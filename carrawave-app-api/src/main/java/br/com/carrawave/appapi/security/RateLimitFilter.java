package br.com.carrawave.appapi.security;

import br.com.carrawave.appapi.common.ApiErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Rate limiting simples (janela fixa de 1 min, em memória) para conter abuso e
 * ataques de força bruta em /auth/**. Chave = IP do cliente (considerando
 * X-Forwarded-For, já que rodamos atrás de proxy no Railway/Render).
 *
 * Limitação conhecida: em memória por instância. Se escalar para múltiplas
 * instâncias, trocar por um contador compartilhado (Redis) — o suficiente
 * para o volume esperado nesta fase do produto.
 *
 * É um @Component só para o @Scheduled de limpeza funcionar; o registro dele
 * como filtro do container é desativado em SecurityConfig (FilterRegistrationBean
 * com enabled=false) para não rodar duas vezes — quem o aplica de fato é a
 * cadeia do Spring Security, via addFilterBefore.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final int generalCapacity;
    private final int authCapacity;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, Counter> counters = new ConcurrentHashMap<>();

    public RateLimitFilter(
            @Value("${carrawave.rate-limit.capacity:60}") int generalCapacity,
            @Value("${carrawave.rate-limit.auth-capacity:10}") int authCapacity
    ) {
        this.generalCapacity = generalCapacity;
        this.authCapacity = authCapacity;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        if (!path.startsWith("/api/v1/")) {
            filterChain.doFilter(request, response);
            return;
        }

        boolean isAuthRoute = path.startsWith("/api/v1/auth/");
        int limit = isAuthRoute ? authCapacity : generalCapacity;
        long currentMinute = System.currentTimeMillis() / 60_000;
        String key = clientKey(request) + ":" + (isAuthRoute ? "auth" : "general") + ":" + currentMinute;

        Counter counter = counters.computeIfAbsent(key, k -> new Counter(currentMinute));
        int count = counter.count.incrementAndGet();

        if (count > limit) {
            response.setStatus(429);
            response.setHeader("Retry-After", "60");
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            ApiErrorResponse body = ApiErrorResponse.of(429, "RATE_LIMITED",
                    "Muitas tentativas. Aguarde um instante e tente de novo.", path);
            response.getWriter().write(objectMapper.writeValueAsString(body));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String clientKey(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    @Scheduled(fixedDelay = 5 * 60_000)
    public void cleanup() {
        long currentMinute = System.currentTimeMillis() / 60_000;
        counters.entrySet().removeIf(e -> currentMinute - e.getValue().windowMinute > 2);
    }

    private static final class Counter {
        final long windowMinute;
        final AtomicInteger count = new AtomicInteger(0);

        Counter(long windowMinute) {
            this.windowMinute = windowMinute;
        }
    }
}
