package cloudlab_backend.service;
import cloudlab_backend.entity.TopicCategory;
import cloudlab_backend.repository.TopicCategoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class TopicCategoryService {
    private final TopicCategoryRepository topicCategoryRepository;
    public TopicCategoryService(
            TopicCategoryRepository topicCategoryRepository) {
        this.topicCategoryRepository=topicCategoryRepository;
    }
    public List<TopicCategory> getAllTopicCategories(){
        return topicCategoryRepository.findAll();
    }
    public Optional<TopicCategory> getTopicCategoryById(Long id) {
        return topicCategoryRepository.findById(id);
    }
    public TopicCategory saveTopicCategory(TopicCategory topicCategory) {
        return topicCategoryRepository.save(topicCategory);
    }
    public void deleteTopicCategory(Long id){
        topicCategoryRepository.deleteById(id);
    }
}
