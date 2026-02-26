package com.example.demo.repository;

import com.example.demo.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident,Long> {
    List<Incident> findByIncidentDate(LocalDate date);

    List<Incident> findByDeviceSerialNumber(String serialNumber);

    List<Incident> findByIncidentDateAndDeviceDeviceType(LocalDate date, String deviceType);

    boolean existsByReporterIdAndDeviceIdAndIncidentDate(Long reporterId, Long deviceId, LocalDate incidentDate);
}
