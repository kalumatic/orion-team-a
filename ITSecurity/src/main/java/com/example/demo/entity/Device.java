package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

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

    @NotBlank(message = "Device type is mandatory")
    private String deviceType;

    private String model;

    @Column(unique = true)
    private String serialNumber;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee assignedEmployee;
}
