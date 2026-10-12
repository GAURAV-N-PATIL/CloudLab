package cloudlab_backend.repository;
import cloudlab_backend.entity.CloudProvider;
import cloudlab_backend.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User,Long>{
    @EntityGraph(attributePaths = "selectedCloud")
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Sets the cloud only if none is set yet; returns 0 when another request got there first.
    @Modifying
    @Query("update User u set u.selectedCloud = :cloud where u.id = :userId and u.selectedCloud is null")
    int selectCloudIfUnset(@Param("userId") Long userId, @Param("cloud") CloudProvider cloud);
}
