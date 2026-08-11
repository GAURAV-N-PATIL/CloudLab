package cloudlab_backend.repository;
import cloudlab_backend.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CertificateRepository extends JpaRepository<Certificate,Long> {
}
