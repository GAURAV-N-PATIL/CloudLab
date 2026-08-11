package cloudlab_backend.repository;
import cloudlab_backend.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<Topic,Long>{
}
