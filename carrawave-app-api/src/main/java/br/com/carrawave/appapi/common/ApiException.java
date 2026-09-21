package br.com.carrawave.appapi.common;

import org.springframework.http.HttpStatus;

/**
 * Exceção de negócio com código de erro estável (para o frontend tratar por switch)
 * e mensagem já pronta em pt-BR para exibir ao usuário.
 */
public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;

    public ApiException(HttpStatus status, String errorCode, String message) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public static ApiException stationNotFound() {
        return new ApiException(HttpStatus.NOT_FOUND, "STATION_NOT_FOUND", "Rádio não encontrada.");
    }

    public static ApiException invalidCredentials() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "E-mail ou senha inválidos.");
    }

    public static ApiException tokenExpired() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "TOKEN_EXPIRED", "Sua sessão expirou.");
    }

    public static ApiException invalidToken() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_TOKEN", "Token inválido.");
    }

    public static ApiException emailAlreadyRegistered() {
        return new ApiException(HttpStatus.CONFLICT, "EMAIL_ALREADY_REGISTERED", "Esse e-mail já está cadastrado.");
    }

    public static ApiException streamUnavailable() {
        return new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "STREAM_UNAVAILABLE", "Não foi possível conectar ao stream dessa rádio agora.");
    }

    public static ApiException sessionNotFound() {
        return new ApiException(HttpStatus.NOT_FOUND, "SESSION_NOT_FOUND", "Sessão de reprodução não encontrada.");
    }

    public static ApiException actionNotAllowedForAnonymous() {
        return new ApiException(HttpStatus.FORBIDDEN, "ANONYMOUS_NOT_ALLOWED", "Crie uma conta para fazer isso.");
    }
}
