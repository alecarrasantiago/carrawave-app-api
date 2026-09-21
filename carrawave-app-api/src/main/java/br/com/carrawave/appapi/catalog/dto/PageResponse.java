package br.com.carrawave.appapi.catalog.dto;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Envelope de paginação no formato do contrato (mais enxuto que o Page<T> padrão do Spring Data).
 */
public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
    public static <T> PageResponse<T> of(Page<T> page) {
        return new PageResponse<>(page.getContent(), page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }

    public static <T, R> PageResponse<R> of(Page<T> page, List<R> mappedContent) {
        return new PageResponse<>(mappedContent, page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }
}
