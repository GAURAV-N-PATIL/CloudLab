package cloudlab_backend.repository;
import cloudlab_backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
 
public interface ProjectRepository extends JpaRepository<Project,Long>{
    Optional<Project> findBySlug(String slug);
    List<Project> findByCloudProviderIsNull();
    List<Project> findByCloudProviderIsNullOrCloudProvider_Id(
            Long cloudProviderId);
}
