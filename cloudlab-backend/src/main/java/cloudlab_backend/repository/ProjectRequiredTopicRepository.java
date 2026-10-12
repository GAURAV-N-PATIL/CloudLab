package cloudlab_backend.repository;
import cloudlab_backend.entity.ProjectRequiredTopic;
import cloudlab_backend.entity.ProjectRequiredTopicId;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.List;

// Topics are fetched with the rows because callers read their slugs.
public interface ProjectRequiredTopicRepository
        extends JpaRepository<ProjectRequiredTopic, ProjectRequiredTopicId> {
    @EntityGraph(attributePaths = "topic")
    List<ProjectRequiredTopic> findByProject_Id(Long projectId);
    @EntityGraph(attributePaths = "topic")
    List<ProjectRequiredTopic> findByProject_IdIn(Collection<Long> projectIds);
}
