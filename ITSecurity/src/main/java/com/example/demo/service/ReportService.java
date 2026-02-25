package com.example.demo.service;

import com.example.demo.entity.Incident;
import com.example.demo.repository.IncidentRepository;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;

@Service
public class ReportService {

    private final TemplateEngine templateEngine;
    private final IncidentRepository incidentRepository;

    public ReportService(TemplateEngine templateEngine,
                         IncidentRepository incidentRepository) {
        this.templateEngine = templateEngine;
        this.incidentRepository = incidentRepository;
    }
    private String loadLogoAsBase64() {
        try {
            ClassPathResource resource =
                    new ClassPathResource("images/orionlogo.png");

            try (InputStream inputStream = resource.getInputStream()) {
                byte[] bytes = inputStream.readAllBytes();
                return Base64.getEncoder().encodeToString(bytes);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to load logo", e);
        }
    }
    public byte[] generateDailyReport() {

        LocalDate today = LocalDate.now();
        List<Incident> incidents = incidentRepository.findByIncidentDate(today);

        String base64Logo = loadLogoAsBase64();
        Context context = new Context();
        context.setVariable("reportDate", today);
        context.setVariable("generatedAt", LocalDate.now());
        context.setVariable("totalCount", incidents.size());
        context.setVariable("incidents", incidents);
        context.setVariable("logoBase64", base64Logo);

        String html = templateEngine.process("daily-report", context);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(html, null);
            builder.toStream(outputStream);
            builder.run();

            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate daily report PDF", e);
        }
    }
}
