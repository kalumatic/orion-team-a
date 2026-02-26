package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulkFailedDeviceDTO {
    private Integer index;
    private String serialNumber;

    @Builder.Default
    private List<String> errors = new ArrayList<>();
}
