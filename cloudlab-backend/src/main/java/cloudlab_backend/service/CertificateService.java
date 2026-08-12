package cloudlab_backend.service;
import cloudlab_backend.entity.Certificate;
import cloudlab_backend.repository.CertificateRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class CertificateService {
    private final CertificateRepository certificateRepository;
    public CertificateService(CertificateRepository certificateRepository) {
        this.certificateRepository=certificateRepository;
    }

    public List<Certificate> getAllCertificates() {
        return certificateRepository.findAll();
    }

    public Optional<Certificate> getCertificateById(Long id) {
        return certificateRepository.findById(id);
    }

    public Certificate saveCertificate(Certificate certificate) {
        return certificateRepository.save(certificate);
    }

    public void deleteCertificate(Long id) {
        certificateRepository.deleteById(id);
    }
}
