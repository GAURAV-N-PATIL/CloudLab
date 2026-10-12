package cloudlab_backend.service;
import cloudlab_backend.entity.Certificate;
import cloudlab_backend.entity.User;
import cloudlab_backend.repository.CertificateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
@Service
@Transactional(readOnly = true)
public class CertificateService {
    private final CertificateRepository certificateRepository;
    public CertificateService(CertificateRepository certificateRepository) {
        this.certificateRepository=certificateRepository;
    }

    public List<Certificate> getCertificates(User user) {
        return certificateRepository.findByUser_IdOrderByIssuedAtDesc(user.getId());
    }

    public Optional<Certificate> getCertificate(Long id, User user) {
        return certificateRepository.findByIdAndUser_Id(id, user.getId());
    }

    // One certificate per learner, issued when they finish every topic on their cloud track.
    @Transactional
    public void issueIfMissing(User user) {
        if (certificateRepository.existsByUser_Id(user.getId())) {
            return;
        }
        Certificate certificate = new Certificate();
        certificate.setUser(user);
        certificate.setCertificateCode("CL-" + UUID.randomUUID().toString()
                .replace("-", "")
                .substring(0, 12)
                .toUpperCase(Locale.ROOT));
        certificateRepository.save(certificate);
    }
}
