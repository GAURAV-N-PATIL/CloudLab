package cloudlab_backend.repository;
import cloudlab_backend.entity.TopicResource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TopicResourceRepository
        extends JpaRepository<TopicResource, Long>{
    List<TopicResource> findByTopic_IdOrderByOrderIndexAsc(Long topicId);
}
