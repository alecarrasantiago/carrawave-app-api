package br.com.carrawave.appapi.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    Optional<Device> findByDeviceId(UUID deviceId);
}
