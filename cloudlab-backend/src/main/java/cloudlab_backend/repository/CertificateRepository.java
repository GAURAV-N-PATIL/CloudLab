package cloudlab_backend.repository;
import cloudlab_backend.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate,Long> {
	List<Certificate> findByUser_IdOrderByIssuedAtDesc(Long userId);
	Optional<Certificate> findByIdAndUser_Id(Long id, Long userId);
	boolean existsByUser_Id(Long userId);
}
