package br.com.carrawave.appapi.auth;

import br.com.carrawave.appapi.auth.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/anonymous")
    public ResponseEntity<AuthResponse> anonymous(@Valid @RequestBody AnonymousRequest request) {
        return ResponseEntity.ok(authService.anonymous(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return ResponseEntity.ok(authService.login(request, extractBearer(authorization)));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        AuthResponse response = authService.register(request, extractBearer(authorization));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request);
        return ResponseEntity.noContent().build();
    }

    private String extractBearer(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }
}
