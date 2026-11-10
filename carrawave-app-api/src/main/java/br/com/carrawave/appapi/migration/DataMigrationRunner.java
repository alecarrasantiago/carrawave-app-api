package br.com.carrawave.appapi.migration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.List;

/**
 * Cópia ÚNICA de todos os dados de um banco antigo (Neon) para o banco atual
 * (Supabase), feita pelo próprio servidor no Render — que consegue falar com
 * os dois. Só roda quando a variável MIGRATE_FROM_URL existe.
 *
 * Como usar: no Render, defina MIGRATE_FROM_URL / MIGRATE_FROM_USER /
 * MIGRATE_FROM_PASSWORD com os dados do Neon e DATABASE_* com os do Supabase.
 * Faça o deploy, espere aparecer "MIGRAÇÃO CONCLUÍDA" no log e depois APAGUE
 * as três variáveis MIGRATE_FROM_*.
 *
 * Segurança: roda uma vez só. Ao terminar, grava uma marca no banco novo
 * (tabela carrawave_data_migration); com a marca presente, nunca mais copia —
 * esquecer as variáveis lá não apaga dados novos. Tudo acontece numa
 * transação: se algo falhar, o destino fica como estava.
 */
@Component
public class DataMigrationRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataMigrationRunner.class);

    /** Ordem respeita as chaves estrangeiras (pais antes dos filhos). */
    private static final List<String> TABLES = List.of(
            "city", "genre", "station", "station_genre",
            "app_user", "device", "favorite", "play_session",
            "user_settings", "refresh_token");

    /** Tabelas com id bigserial, cuja sequência precisa ser acertada depois. */
    private static final List<String> SERIAL_TABLES = List.of(
            "city", "genre", "station", "app_user", "device", "play_session", "refresh_token");

    private final DataSource target;
    private final String sourceUrl;
    private final String sourceUser;
    private final String sourcePassword;

    public DataMigrationRunner(DataSource target,
                               @Value("${MIGRATE_FROM_URL:}") String sourceUrl,
                               @Value("${MIGRATE_FROM_USER:}") String sourceUser,
                               @Value("${MIGRATE_FROM_PASSWORD:}") String sourcePassword) {
        this.target = target;
        this.sourceUrl = sourceUrl == null ? "" : sourceUrl.trim();
        this.sourceUser = sourceUser;
        this.sourcePassword = sourcePassword;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (sourceUrl.isEmpty()) {
            return;
        }
        try {
            migrate();
        } catch (Exception e) {
            // Não derruba a aplicação: ela continua no ar com o banco novo.
            log.error("MIGRAÇÃO FALHOU (nada foi alterado no banco novo): {}", e.toString(), e);
        }
    }

    private void migrate() throws Exception {
        try (Connection dst = target.getConnection()) {
            try (Statement st = dst.createStatement()) {
                st.execute("create table if not exists carrawave_data_migration (done_at timestamptz not null)");
            }
            if (count(dst, "carrawave_data_migration") > 0) {
                log.warn("MIGRAÇÃO IGNORADA: já foi feita antes. Apague as variáveis MIGRATE_FROM_* no Render.");
                return;
            }
            log.info("MIGRAÇÃO: copiando dados do banco antigo...");
            try (Connection src = DriverManager.getConnection(sourceUrl, sourceUser, sourcePassword)) {
                src.setReadOnly(true);
                src.setAutoCommit(false);
                dst.setAutoCommit(false);
                try {
                    try (Statement st = dst.createStatement()) {
                        st.execute("truncate table " + String.join(", ", TABLES) + " restart identity cascade");
                    }
                    for (String table : TABLES) {
                        long copied = copyTable(src, dst, table);
                        long expected = count(src, table);
                        if (copied != expected) {
                            throw new IllegalStateException(table + ": copiadas " + copied + " de " + expected + " linhas");
                        }
                        log.info("MIGRAÇÃO: {} -> {} linhas", table, copied);
                    }
                    try (Statement st = dst.createStatement()) {
                        for (String table : SERIAL_TABLES) {
                            st.execute("select setval(pg_get_serial_sequence('" + table + "', 'id'), "
                                    + "coalesce((select max(id) from " + table + "), 1), "
                                    + "(select max(id) from " + table + ") is not null)");
                        }
                    }
                    try (Statement st = dst.createStatement()) {
                        st.execute("insert into carrawave_data_migration (done_at) values (now())");
                    }
                    dst.commit();
                    log.info("MIGRAÇÃO CONCLUÍDA. Agora apague as variáveis MIGRATE_FROM_* no Render.");
                } catch (Exception e) {
                    dst.rollback();
                    throw e;
                } finally {
                    dst.setAutoCommit(true);
                    src.rollback();
                }
            }
        }
    }

    private long copyTable(Connection src, Connection dst, String table) throws Exception {
        long copied = 0;
        try (Statement read = src.createStatement()) {
            read.setFetchSize(1000);
            try (ResultSet rs = read.executeQuery("select * from " + table)) {
                ResultSetMetaData md = rs.getMetaData();
                int cols = md.getColumnCount();
                StringBuilder names = new StringBuilder();
                StringBuilder marks = new StringBuilder();
                for (int i = 1; i <= cols; i++) {
                    if (i > 1) {
                        names.append(", ");
                        marks.append(", ");
                    }
                    names.append('"').append(md.getColumnName(i)).append('"');
                    marks.append('?');
                }
                String sql = "insert into " + table + " (" + names + ") values (" + marks + ")";
                try (PreparedStatement insert = dst.prepareStatement(sql)) {
                    int batch = 0;
                    while (rs.next()) {
                        for (int i = 1; i <= cols; i++) {
                            insert.setObject(i, rs.getObject(i), md.getColumnType(i));
                        }
                        insert.addBatch();
                        copied++;
                        if (++batch == 500) {
                            insert.executeBatch();
                            batch = 0;
                        }
                    }
                    if (batch > 0) {
                        insert.executeBatch();
                    }
                }
            }
        }
        return copied;
    }

    private long count(Connection c, String table) throws Exception {
        try (Statement st = c.createStatement(); ResultSet rs = st.executeQuery("select count(*) from " + table)) {
            rs.next();
            return rs.getLong(1);
        }
    }
}
