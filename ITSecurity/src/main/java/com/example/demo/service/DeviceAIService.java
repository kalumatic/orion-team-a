package com.example.demo.service;

import com.example.demo.dto.request.DeviceRequestDTO;
import com.example.demo.dto.response.DeviceResponseDTO;
import com.example.demo.dto.response.EmployeeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class DeviceAIService {
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final DeviceService deviceService;
    private final EmployeeService employeeService;
    private final String modelName;

    public DeviceAIService(WebClient.Builder webClientBuilder,
                           DeviceService deviceService,
                           EmployeeService employeeService,
                           ObjectMapper objectMapper,
                           @Value("${huggingface.api.key}") String apiKey,
                           @Value("${ai.model.name:meta-llama/Llama-3.1-8B-Instruct}") String modelName) {
        this.deviceService = deviceService;
        this.employeeService = employeeService;
        this.objectMapper = objectMapper;
        this.modelName = modelName;
        this.webClient = webClientBuilder
                .baseUrl("https://router.huggingface.co/v1")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    public List<DeviceResponseDTO> generateDevices(int count) throws Exception {
        List<EmployeeResponse> employees = employeeService.getAllEmployees();
        if (employees.isEmpty()) {
            throw new RuntimeException("Table employees is empty!");
        }
        List<Long> employeeIds = employees.stream().map(EmployeeResponse::getId).toList();

        Map<String, Object> requestBody = Map.of(
                "model", this.modelName,
                "messages", List.of(
                        Map.of("role", "system", "content", "You are an IT devices generator. Return only a valid JSON array of objects. No extra text or formatting."),
                        Map.of("role", "user", "content", "Generate " + count + " IT devices with fields: deviceType, model, serialNumber, assignmentDate.")
                ),
                "temperature", 0.7
        );

        Map<String, Object> response = webClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        // choices[0].message.content
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        String rawJson = (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");

        String cleanedJson = rawJson.substring(rawJson.indexOf("["), rawJson.lastIndexOf("]") + 1);

        List<DeviceRequestDTO> dtos = objectMapper.readValue(cleanedJson, new TypeReference<>() {});
        Random random = new Random();

        return dtos.stream().map(dto -> {
            dto.setAssignedEmployeeId(employeeIds.get(random.nextInt(employeeIds.size())));
            return deviceService.createDevice(dto);
        }).toList();
    }
}
