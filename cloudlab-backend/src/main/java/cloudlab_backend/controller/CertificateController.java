package cloudlab_backend.controller;

import cloudlab_backend.entity.Certificate;
import cloudlab_backend.entity.User;
import cloudlab_backend.service.CertificateService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {
    private final CertificateService certificateService;
    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @GetMapping
    public ResponseEntity<List<CertificateResponse>> getMyCertificates(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(certificateService.getCertificates(user)
                .stream()
                .map(CertificateResponse::from)
                .toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificateResponse> getCertificate(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return certificateService.getCertificate(id, user)
                .map(CertificateResponse::from)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new NoSuchElementException("Certificate not found"));
    }

    public static class CertificateResponse {
        private Long id;
        private String certificateCode;
        private LocalDateTime issuedAt;
        private String pdfUrl;
        public static CertificateResponse from(Certificate cert) {
            CertificateResponse dto = new CertificateResponse();
            dto.id = cert.getId();
            dto.certificateCode = cert.getCertificateCode();
            dto.issuedAt = cert.getIssuedAt();
            dto.pdfUrl = cert.getPdfUrl();
            return dto;
        }
        public Long getId() {
            return id;
        }
        public String getCertificateCode() {
            return certificateCode;
        }
        public LocalDateTime getIssuedAt() {
            return issuedAt;
        }
        public String getPdfUrl() {
            return pdfUrl;
        }
    }
}
