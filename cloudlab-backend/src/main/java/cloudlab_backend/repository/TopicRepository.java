package cloudlab_backend.repository;
import cloudlab_backend.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface TopicRepository
        extends JpaRepository<Topic, Long>{
    Optional<Topic> findBySlug(String slug);
    List<Topic> findByCloudProviderIsNull();
    List<Topic> findByCloudProviderIsNullOrCloudProvider_Id(
            Long cloudProviderId
    );
}
