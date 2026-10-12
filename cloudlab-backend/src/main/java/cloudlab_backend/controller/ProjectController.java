package cloudlab_backend.controller;
import cloudlab_backend.entity.User;
import cloudlab_backend.service.ProjectRoadmapService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/projects")
public class ProjectController{
    private final ProjectRoadmapService projectRoadmapService;
    public ProjectController(ProjectRoadmapService projectRoadmapService) {
        this.projectRoadmapService = projectRoadmapService;
    }
    @GetMapping
    public ResponseEntity<List<ProjectRoadmapService.ProjectSummary>> getProjects(
            @AuthenticationPrincipal User user
    ){
        return ResponseEntity.ok(projectRoadmapService.getProjects(user));
    }
    @GetMapping("/{slug}")
    public ResponseEntity<ProjectRoadmapService.ProjectDetail> getProject(
            @PathVariable String slug,
            @AuthenticationPrincipal User user
    ){
        return ResponseEntity.ok(projectRoadmapService.getProjectBySlug(slug, user));
    }
    @PostMapping("/{slug}/submit")
    public ResponseEntity<Void> submitProject(
            @PathVariable String slug,
            @AuthenticationPrincipal User user
    ) {
        projectRoadmapService.submitProject(slug, user);
        return ResponseEntity.noContent().build();
    }
}
