package br.com.carrawave.appapi.security;

import br.com.carrawave.appapi.common.ApiErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        JwtService.DecodedToken decoded = jwtService.decodeAndValidate(token);

        if (decoded == null) {
            writeError(response, "INVALID_TOKEN", "Token inválido.");
            return;
        }
        if (decoded.expired()) {
            writeError(response, "TOKEN_EXPIRED", "Sua sessão expirou.");
            return;
        }

        AuthenticatedUser principal = new AuthenticatedUser(
                decoded.userId(), decoded.deviceId(), decoded.accountType(), decoded.platform());

        List<SimpleGrantedAuthority> authorities = decoded.roles() == null
                ? List.of()
                : decoded.roles().stream().map(SimpleGrantedAuthority::new).toList();

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(principal, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    private void writeError(HttpServletResponse response, String errorCode, String message) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        ApiErrorResponse body = ApiErrorResponse.of(401, errorCode, message, "");
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
