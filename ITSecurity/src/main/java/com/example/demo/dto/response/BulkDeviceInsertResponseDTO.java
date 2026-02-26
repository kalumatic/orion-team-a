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
public class BulkDeviceInsertResponseDTO {
    @Builder.Default
    private List<Long> savedIds = new ArrayList<>();

    @Builder.Default
    private List<BulkFailedDeviceDTO> failed = new ArrayList<>();
}
