package cloudlab_backend.service;
import cloudlab_backend.entity.ProjectRequiredTopic;
import cloudlab_backend.entity.ProjectRequiredTopicId;
import cloudlab_backend.repository.ProjectRequiredTopicRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class ProjectRequiredTopicService {
    private final ProjectRequiredTopicRepository projectRequiredTopicRepository;
    public ProjectRequiredTopicService(
            ProjectRequiredTopicRepository projectRequiredTopicRepository) {
        this.projectRequiredTopicRepository = projectRequiredTopicRepository;
    }
    public List<ProjectRequiredTopic> getAllProjectRequiredTopics() {
        return projectRequiredTopicRepository.findAll();
    }
    public Optional<ProjectRequiredTopic> getProjectRequiredTopicById(
            ProjectRequiredTopicId id) {
        return projectRequiredTopicRepository.findById(id);
    }
    public ProjectRequiredTopic saveProjectRequiredTopic(
            ProjectRequiredTopic projectRequiredTopic) {
        return projectRequiredTopicRepository.save(projectRequiredTopic);
    }
    public void deleteProjectRequiredTopic(ProjectRequiredTopicId id) {
        projectRequiredTopicRepository.deleteById(id);
    }
}
