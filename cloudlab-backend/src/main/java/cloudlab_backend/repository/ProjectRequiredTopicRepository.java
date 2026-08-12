package cloudlab_backend.repository;
import cloudlab_backend.entity.ProjectRequiredTopic;
import cloudlab_backend.entity.ProjectRequiredTopicId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProjectRequiredTopicRepository
        extends JpaRepository<ProjectRequiredTopic, ProjectRequiredTopicId> {
    List<ProjectRequiredTopic> findByProject_Id(Long projectId);
}
