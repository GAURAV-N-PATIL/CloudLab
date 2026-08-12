package cloudlab_backend.service;
import cloudlab_backend.entity.TopicResource;
import cloudlab_backend.repository.TopicResourceRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class TopicResourceService {
    private final TopicResourceRepository topicResourceRepository;
    public TopicResourceService(TopicResourceRepository topicResourceRepository) {
        this.topicResourceRepository= topicResourceRepository;
    }

    public List<TopicResource> getAllTopicResources(){
        return topicResourceRepository.findAll();
    }
    public Optional<TopicResource> getTopicResourceById(Long id) {
        return topicResourceRepository.findById(id);
    }
    public TopicResource saveTopicResource(TopicResource topicResource){
        return topicResourceRepository.save(topicResource);
    }
    public void deleteTopicResource(Long id){
        topicResourceRepository.deleteById(id);
    }
}
