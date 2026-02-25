package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "devices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String deviceType;

    @Column(nullable = false)
    private String model;

    @Column(unique = true, nullable = false)
    private String serialNumber;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee assignedEmployee;

    private LocalDate assignmentDate;
}
