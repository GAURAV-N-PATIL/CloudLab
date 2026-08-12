package cloudlab_backend.service;
import cloudlab_backend.entity.Project;
import cloudlab_backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository=projectRepository;
    }
    public List<Project> getAllProjects(){
        return projectRepository.findAll();
    }
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }
    public void deleteProject(Long id){
        projectRepository.deleteById(id);
    }
}
