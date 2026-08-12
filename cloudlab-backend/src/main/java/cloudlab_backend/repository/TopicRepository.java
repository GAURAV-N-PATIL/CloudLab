package cloudlab_backend.repository;
import cloudlab_backend.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TopicRepository extends JpaRepository<Topic, Long>{
    List<Topic> findByCloudProviderIsNullOrCloudProvider_Id(Long cloudProviderId);
}
