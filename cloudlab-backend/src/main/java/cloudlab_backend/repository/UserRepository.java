package cloudlab_backend.repository;
import cloudlab_backend.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User,Long>{
    @EntityGraph(attributePaths = "selectedCloud")
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
