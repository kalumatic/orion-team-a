package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiIncidentGenerateResponse {
    private Integer requestedCount;
    private Integer savedCount;
    private Integer skippedCount;
    private Integer aiGeneratedCount;
    private Integer fallbackCount;

    @Builder.Default
    private List<Long> savedIds = new ArrayList<>();

    @Builder.Default
    private List<String> warnings = new ArrayList<>();
}
