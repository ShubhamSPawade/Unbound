package com.unbound.backend.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CertificateService {
    private static final Logger logger = LoggerFactory.getLogger(CertificateService.class);

    public byte[] generateCertificate(String studentName, String eventName, String festName, String eventDate) {
        logger.info("[CERTIFICATE] Generating certificate for student: {}, event: {}, fest: {}", studentName, eventName, festName);
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        document.open();
        Font titleFont = new Font(Font.HELVETICA, 24, Font.BOLD);
        Font normalFont = new Font(Font.HELVETICA, 16, Font.NORMAL);
        document.add(new Paragraph("Certificate of Participation", titleFont));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("This is to certify that", normalFont));
        document.add(new Paragraph(studentName, new Font(Font.HELVETICA, 20, Font.BOLD)));
        document.add(new Paragraph("has participated in the event", normalFont));
        document.add(new Paragraph(eventName + (festName != null ? " (" + festName + ")" : ""), new Font(Font.HELVETICA, 18, Font.BOLD)));
        document.add(new Paragraph("held on " + eventDate + ".", normalFont));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Date of Issue: " + LocalDate.now(), new Font(Font.HELVETICA, 12, Font.ITALIC)));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Unbound Platform", new Font(Font.HELVETICA, 14, Font.BOLD)));
        document.close();
        logger.info("[CERTIFICATE] Certificate generated for student: {}, event: {}", studentName, eventName);
        return baos.toByteArray();
    }
} 