package cloudlab_backend.service;
import cloudlab_backend.entity.CloudProvider;
import cloudlab_backend.repository.CloudProviderRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class CloudProviderService{
    private final CloudProviderRepository cloudProviderRepository;
    public CloudProviderService(
            CloudProviderRepository cloudProviderRepository){
        this.cloudProviderRepository=cloudProviderRepository;
    }
    public List<CloudProvider> getAllCloudProviders(){
        return cloudProviderRepository.findAll();
    }
    public Optional<CloudProvider> getCloudProviderById(Long id) {
        return cloudProviderRepository.findById(id);
    }
    public CloudProvider saveCloudProvider(CloudProvider cloudProvider) {
        return cloudProviderRepository.save(cloudProvider);
    }
    public void deleteCloudProvider(Long id){
        cloudProviderRepository.deleteById(id);
    }
}

