package cloudlab_backend.repository;
import cloudlab_backend.entity.UserProjectProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional; 
public interface UserProjectProgressRepository extends JpaRepository<UserProjectProgress,Long>{
    List<UserProjectProgress> findByUser_Id(Long userId);
    Optional<UserProjectProgress> findByUser_IdAndProject_Id(Long userId,Long projectId);
}
