package com.example.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Component
public class LlamaIncidentClient {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${ai.groq.base-url:https://api.groq.com/openai/v1}")
    private String baseUrl;

    @Value("${ai.groq.model:llama-3.1-8b-instant}")
    private String model;

    @Value("${ai.groq.timeout-seconds:30}")
    private int timeoutSeconds;

    @Value("${ai.groq.api-key:}")
    private String apiKey;

    public List<IncidentDraft> generateDrafts(int count) {
        List<IncidentDraft> drafts = new ArrayList<>();
        int attempts = 0;

        while (drafts.size() < count && attempts < 3) {
            int remaining = count - drafts.size();
            String prompt = buildPrompt(remaining);
            String responseText = callLlama(prompt);
            drafts.addAll(parseDrafts(responseText, remaining));
            attempts++;
        }

        if (drafts.size() > count) {
            return drafts.subList(0, count);
        }
        return drafts;
    }

    private String callLlama(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            return null;
        }

        try {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(timeoutSeconds))
                    .build();

            ObjectNode bodyNode = objectMapper.createObjectNode();
            bodyNode.put("model", model);
            bodyNode.put("temperature", 0);
            ArrayNode messages = objectMapper.createArrayNode();
            ObjectNode userMessage = objectMapper.createObjectNode();
            userMessage.put("role", "user");
            userMessage.put("content", prompt);
            messages.add(userMessage);
            bodyNode.set("messages", messages);
            ObjectNode responseFormat = objectMapper.createObjectNode();
            responseFormat.put("type", "json_object");
            bodyNode.set("response_format", responseFormat);

            String body = objectMapper.writeValueAsString(bodyNode);

            HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/chat/completions"))
                    .timeout(Duration.ofSeconds(timeoutSeconds))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey);

            HttpRequest request = requestBuilder.POST(HttpRequest.BodyPublishers.ofString(body)).build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return null;
            }

            JsonNode root = objectMapper.readTree(response.body());
            JsonNode choices = root.get("choices");
            if (choices == null || !choices.isArray() || choices.size() == 0) {
                return null;
            }
            return text(choices.get(0).path("message").get("content"));
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            return null;
        } catch (IOException ex) {
            return null;
        } catch (Exception ex) {
            return null;
        }
    }

    private String buildPrompt(int count) {
        return "Return ONLY valid JSON object in this exact shape:\n" +
                "{\"incidents\":[{\"description\":\"...\",\"severity\":\"Low|Medium|High|Critical\",\"status\":\"Open|In Progress|Closed\"}]}\n" +
                "Generate exactly " + count + " realistic IT security incident items in incidents array.\n" +
                "No markdown. No extra text.";
    }

    private List<IncidentDraft> parseDrafts(String responseText, int limit) {
        if (responseText == null || responseText.isBlank()) {
            return List.of();
        }

        JsonNode incidentsNode = extractIncidentsNode(responseText);
        if (incidentsNode == null || !incidentsNode.isArray()) {
            return List.of();
        }

        List<IncidentDraft> drafts = new ArrayList<>();
        for (JsonNode item : incidentsNode) {
            if (drafts.size() >= limit) {
                break;
            }

            String description = text(item.get("description"));
            String severity = normalizeSeverity(text(item.get("severity")));
            String status = normalizeStatus(text(item.get("status")));

            if (description == null || description.isBlank()) {
                description = "AI generated incident";
            }
            drafts.add(new IncidentDraft(description, severity, status));
        }

        return drafts;
    }

    private JsonNode extractIncidentsNode(String text) {
        try {
            String cleaned = stripCodeFences(text).trim();
            JsonNode root = objectMapper.readTree(cleaned);
            if (root.isArray()) {
                return root;
            }
            JsonNode incidents = root.get("incidents");
            if (incidents != null && incidents.isArray()) {
                return incidents;
            }
        } catch (Exception ignored) {
        }

        String jsonArray = extractJsonArray(text);
        if (jsonArray == null) {
            return null;
        }

        try {
            return objectMapper.readTree(jsonArray);
        } catch (Exception ex) {
            return null;
        }
    }

    private String stripCodeFences(String input) {
        String trimmed = input.trim();
        if (trimmed.startsWith("```")) {
            int firstNewLine = trimmed.indexOf('\n');
            int lastFence = trimmed.lastIndexOf("```");
            if (firstNewLine > -1 && lastFence > firstNewLine) {
                return trimmed.substring(firstNewLine + 1, lastFence);
            }
        }
        return input;
    }

    private String extractJsonArray(String text) {
        int start = text.indexOf('[');
        int end = text.lastIndexOf(']');
        if (start == -1 || end == -1 || end < start) {
            return null;
        }
        return text.substring(start, end + 1);
    }

    private String text(JsonNode node) {
        return node == null || node.isNull() ? null : node.asText();
    }

    private String normalizeSeverity(String severity) {
        if (severity == null) {
            return "Medium";
        }

        String s = severity.trim().toLowerCase(Locale.ROOT);
        return switch (s) {
            case "low" -> "Low";
            case "medium" -> "Medium";
            case "high" -> "High";
            case "critical" -> "Critical";
            default -> "Medium";
        };
    }

    private String normalizeStatus(String status) {
        if (status == null) {
            return "Open";
        }

        String s = status.trim().toLowerCase(Locale.ROOT);
        return switch (s) {
            case "open" -> "Open";
            case "in progress", "in_progress" -> "In Progress";
            case "closed" -> "Closed";
            default -> "Open";
        };
    }

    public record IncidentDraft(String description, String severity, String status) {
    }
}
