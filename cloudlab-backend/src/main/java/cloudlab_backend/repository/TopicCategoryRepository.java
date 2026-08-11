package cloudlab_backend.repository;
import cloudlab_backend.entity.TopicCategory;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TopicCategoryRepository extends JpaRepository<TopicCategory,Long> {
}
