package cloudlab_backend.repository;
import cloudlab_backend.entity.ProjectRequiredTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRequiredTopicRepository
        extends JpaRepository<ProjectRequiredTopic, Long> {
    List<ProjectRequiredTopic> findByProject_IdOrderByOrderIndexAsc(Long projectId);
}
