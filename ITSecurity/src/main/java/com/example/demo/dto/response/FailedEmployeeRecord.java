package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FailedEmployeeRecord {
    private String firstName;
    private String lastName;
    private String email;
    private String reason;
}
