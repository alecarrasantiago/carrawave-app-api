package br.com.carrawave.appapi.catalog.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

import java.util.List;

/**
 * O contrato pede o mesmo objeto de StationSummary "achatado" (sem wrapper),
 * mais os campos similar/currentProgram. @JsonUnwrapped resolve isso no JSON.
 */
public record StationDetail(
        @JsonUnwrapped StationSummary station,
        List<StationSummary> similar,
        CurrentProgram currentProgram
) {
}
