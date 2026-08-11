package cloudlab_backend.repository;
import cloudlab_backend.entity.TopicResource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicResourceRepository extends JpaRepository<TopicResource,Long> {
}
