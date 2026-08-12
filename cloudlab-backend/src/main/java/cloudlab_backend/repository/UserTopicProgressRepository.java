package cloudlab_backend.repository;
import cloudlab_backend.entity.UserTopicProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface UserTopicProgressRepository
        extends JpaRepository<UserTopicProgress, Long>{
    List<UserTopicProgress> findByUser_Id(Long userId);
}
