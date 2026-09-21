package br.com.carrawave.appapi.catalog.dto;

import br.com.carrawave.appapi.catalog.City;

import java.util.UUID;

public record CitySummary(UUID id, String name, String state, Long stationCount) {
    public static CitySummary from(City city) {
        return new CitySummary(city.getPublicId(), city.getName(), city.getState(), null);
    }

    public static CitySummary withCount(City city, long stationCount) {
        return new CitySummary(city.getPublicId(), city.getName(), city.getState(), stationCount);
    }
}
