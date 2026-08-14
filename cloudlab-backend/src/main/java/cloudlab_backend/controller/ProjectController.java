package cloudlab_backend.controller;
import cloudlab_backend.entity.User;
import cloudlab_backend.repository.UserRepository;
import cloudlab_backend.service.ProjectRoadmapService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/projects")
public class ProjectController{
    private final UserRepository userRepository;
    private final ProjectRoadmapService projectRoadmapService;
    public ProjectController(
            UserRepository userRepository,
            ProjectRoadmapService projectRoadmapService
    ) {
        this.userRepository = userRepository;
        this.projectRoadmapService = projectRoadmapService;
    }
    @GetMapping
    public ResponseEntity<List<ProjectRoadmapService.ProjectSummary>> getProjects(
            Authentication authentication
    ){
        User user =currentUser(authentication);
        return ResponseEntity.ok(
                projectRoadmapService.getProjects(user)
        );
    }
    @GetMapping("/{slug}")
    public ResponseEntity<ProjectRoadmapService.ProjectDetail> getProject(
            @PathVariable String slug,
            Authentication authentication
    ){
        User user = currentUser(authentication);
        return ResponseEntity.ok(
                projectRoadmapService.getProjectBySlug(slug, user)
        );
    }
    @PostMapping("/{slug}/submit")
    public ResponseEntity<Void> submitProject(
            @PathVariable String slug,
            Authentication authentication
    ) {
        User user = currentUser(authentication);
        projectRoadmapService.submitProject(slug, user);
        return ResponseEntity.noContent().build();
    }

    private User currentUser(Authentication authentication) {
        String email=authentication.getName();
        return userRepository
                .findByEmail(email)
                .orElseThrow();
    }
}
