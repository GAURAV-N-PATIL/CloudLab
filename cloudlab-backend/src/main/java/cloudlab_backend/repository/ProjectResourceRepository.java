package cloudlab_backend.repository;
import cloudlab_backend.entity.ProjectResource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProjectResourceRepository
        extends JpaRepository<ProjectResource, Long> {
    List<ProjectResource> findByProject_IdOrderByOrderIndexAsc(Long projectId);
}
