package br.com.carrawave.appapi.security;

import br.com.carrawave.appapi.common.ApiErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtService jwtService;
    private final RateLimitFilter rateLimitFilter;
    private final String corsOrigins;

    public SecurityConfig(
            JwtService jwtService,
            RateLimitFilter rateLimitFilter,
            @Value("${carrawave.cors.origins}") String corsOrigins
    ) {
        this.jwtService = jwtService;
        this.rateLimitFilter = rateLimitFilter;
        this.corsOrigins = corsOrigins;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Custo 12 (padrão é 10) — mais lento de propósito, dificulta brute-force offline
        // caso o hash vaze algum dia.
        return new BCryptPasswordEncoder(12);
    }

    // Impede que o RateLimitFilter seja registrado DUAS vezes: uma pelo Spring Boot
    // (auto-detecção de qualquer bean Filter) e outra explicitamente na cadeia do
    // Spring Security logo abaixo. Quem efetivamente o executa é a cadeia do Security.
    @Bean
    public FilterRegistrationBean<RateLimitFilter> disableAutoRegistration(RateLimitFilter filter) {
        FilterRegistrationBean<RateLimitFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers
                        .contentTypeOptions(opts -> {})
                        .frameOptions(frame -> frame.deny())
                        .referrerPolicy(referrer -> referrer.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER))
                        .httpStrictTransportSecurity(hsts -> hsts
                                .includeSubDomains(true)
                                .maxAgeInSeconds(31536000))
                        .contentSecurityPolicy(csp -> csp
                                .policyDirectives("default-src 'none'; frame-ancestors 'none'"))
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.setCharacterEncoding("UTF-8");
                            ApiErrorResponse body = ApiErrorResponse.of(401, "UNAUTHENTICATED",
                                    "É preciso estar autenticado.", request.getRequestURI());
                            response.getWriter().write(new ObjectMapper().writeValueAsString(body));
                        })
                )
                .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new JwtAuthenticationFilter(jwtService), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(corsOrigins.split(",")));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept-Language"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
