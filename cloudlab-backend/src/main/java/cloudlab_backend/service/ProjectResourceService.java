package cloudlab_backend.service;
import cloudlab_backend.entity.ProjectResource;
import cloudlab_backend.repository.ProjectResourceRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class ProjectResourceService{
    private final ProjectResourceRepository projectResourceRepository;
    public ProjectResourceService(
            ProjectResourceRepository projectResourceRepository){
        this.projectResourceRepository=projectResourceRepository;
    }
    public List<ProjectResource> getAllProjectResources(){
        return projectResourceRepository.findAll();
    }
    public Optional<ProjectResource> getProjectResourceById(Long id){
        return projectResourceRepository.findById(id);
    }
    public ProjectResource saveProjectResource(
            ProjectResource projectResource){
        return projectResourceRepository.save(projectResource);
    }
    public void deleteProjectResource(Long id){ 
        projectResourceRepository.deleteById(id);
    }
}
