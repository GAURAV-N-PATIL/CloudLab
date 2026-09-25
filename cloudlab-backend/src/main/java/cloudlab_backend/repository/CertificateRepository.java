package cloudlab_backend.repository;
import cloudlab_backend.entity.Certificate;
import cloudlab_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CertificateRepository extends JpaRepository<Certificate,Long> {
	List<Certificate> findByUserOrderByIssuedAtDesc(User user);
}
