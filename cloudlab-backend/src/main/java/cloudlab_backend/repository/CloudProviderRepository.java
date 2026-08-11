package cloudlab_backend.repository;
import cloudlab_backend.entity.CloudProvider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CloudProviderRepository
        extends JpaRepository<CloudProvider,Long>{
}
