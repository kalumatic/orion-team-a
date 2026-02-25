package com.example.demo.repository;

import com.example.demo.entity.Device;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device,Long> {
    List<Device> findByDeviceType(String deviceType);

    Optional<Device> findBySerialNumber(String serialNumber);

    @Override
    @NonNull
    @EntityGraph(attributePaths = {"assignedEmployee"})
    Page<Device> findAll(@NonNull Pageable pageable);
}
