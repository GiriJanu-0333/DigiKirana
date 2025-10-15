package com.kirana.inventory.service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kirana.inventory.model.Bill;
import com.kirana.inventory.model.Store;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

@Service
@AllArgsConstructor
public class PdfService {
    private final TemplateEngine templateEngine;

    @PostConstruct
    public void setupTemplateEngine() {
        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        resolver.setSuffix(".html");
        resolver.setPrefix("templates/");
        resolver.setTemplateMode("HTML");
        resolver.setCharacterEncoding("UTF-8");
        templateEngine.setTemplateResolver(resolver);
    }
public byte[] generateBillPdf(Bill bill) {
    

            // Debug logs to check bill contents
    System.out.println("Bill ID: " + bill.getId());
    System.out.println("Total Amount: " + bill.getTotalAmount());

    if (bill.getItems() == null || bill.getItems().isEmpty()) {
        System.out.println("⚠️ Bill items are EMPTY or NULL.");
    } else {
        System.out.println("✅ Bill has " + bill.getItems().size() + " items.");
        bill.getItems().forEach(item -> {
            System.out.println("Item: " + item);
            if (item.getProduct() == null) {
                System.out.println("❌ Product in item is NULL");
            } else {
                System.out.println("✅ Product Name: " + item.getProduct().getName());
                System.out.println("Qty: " + item.getQuantity());
                System.out.println("Price: " + item.getProduct().getPrice());
                System.out.println("Subtotal: " + item.getTotalPrice());
            }
        });
    }

    Context context = new Context();
    context.setVariable("bill", bill);
    
    String htmlContent = templateEngine.process("invoice", context);

    try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
        PdfRendererBuilder builder = new PdfRendererBuilder();
        builder.useFastMode();
        builder.withHtmlContent(htmlContent, "");

        InputStream fontStream = getClass().getResourceAsStream("/font/dejavu-fonts-ttf-2.37/ttf/DejaVuSans.ttf");
        if (fontStream == null) {
            throw new RuntimeException("Font file not found in classpath: font/DejaVuSans.ttf");
        }
        builder.useFont(() -> fontStream, "DejaVuSans");

        builder.toStream(outputStream);
        builder.run();

        return outputStream.toByteArray();
    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Failed to generate PDF: " + e.getMessage());
    }
}

}