package br.com.carrawave.appapi.stats;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * O Supabase grátis pausa o projeto se passar uma semana com pouquíssimo uso
 * do banco. Um robô do GitHub chama isto uma vez por dia (keep-alive.yml),
 * garantindo atividade mesmo numa semana parada. Custa uma consulta por dia.
 */
@RestController
public class DbPingController {

    private final JdbcTemplate jdbc;

    public DbPingController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/api/v1/ping-db")
    public Map<String, Object> ping() {
        Integer one = jdbc.queryForObject("select 1", Integer.class);
        return Map.of("db", one != null && one == 1 ? "UP" : "DOWN");
    }
}
