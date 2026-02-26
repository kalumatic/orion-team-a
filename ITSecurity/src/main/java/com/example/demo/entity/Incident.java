package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "incidents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Opis incidenta je obavezan")
    @Column(nullable = false)
    private String description;

    @NotNull(message = "Datum je obavezan")
    @Column(nullable = false)
    private LocalDate incidentDate;

    @NotBlank(message = "Severity je obavezan")
    @Column(nullable = false)
    private String severity; // Low, Medium, High, Critical

    @NotBlank(message = "Status je obavezan")
    @Column(nullable = false)
    private String status; // Open, In Progress, Closed

    // Povezivanje sa Employee (Reporter)
    @ManyToOne(optional = false)
    @JoinColumn(name = "reporter_id", nullable = false)
    @NotNull(message = "Zaposleni koji prijavljuje je obavezan")
    private Employee reporter;

    // Povezivanje sa Device
    @ManyToOne(optional = false)
    @JoinColumn(name = "device_id", nullable = false)
    @NotNull(message = "Uređaj je obavezan")
    private Device device;
}
