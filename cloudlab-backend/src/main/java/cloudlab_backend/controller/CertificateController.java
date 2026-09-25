package cloudlab_backend.controller;

import cloudlab_backend.entity.Certificate;
import cloudlab_backend.entity.User;
import cloudlab_backend.repository.CertificateRepository;
import cloudlab_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {
    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    public CertificateController(
            CertificateRepository certificateRepository,
            UserRepository userRepository
    ) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<CertificateResponse>> getMyCertificates(
            Authentication authentication
    ) {
        User user = currentUser(authentication);
        List<CertificateResponse> certificates = certificateRepository
                .findByUserOrderByIssuedAtDesc(user)
                .stream()
                .map(CertificateResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificateResponse> getCertificate(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = currentUser(authentication);
        return certificateRepository.findById(id)
                .filter(cert -> cert.getUser().getId().equals(user.getId()))
                .map(CertificateResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    private User currentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow();
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
