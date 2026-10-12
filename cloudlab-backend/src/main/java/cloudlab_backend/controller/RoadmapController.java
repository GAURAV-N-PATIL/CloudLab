package cloudlab_backend.controller;
import cloudlab_backend.entity.User;
import cloudlab_backend.service.RoadmapService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/roadmap")
public class RoadmapController{
    private final RoadmapService roadmapService;
    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }
    @GetMapping
    public ResponseEntity<List<RoadmapService.RoadmapTopic>> getRoadmap(
            @AuthenticationPrincipal User user
    ){
        return ResponseEntity.ok(roadmapService.getRoadmap(user));
    }
    @GetMapping("/{slug}")
    public ResponseEntity<RoadmapService.TopicDetail> getTopic(
            @PathVariable String slug,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(roadmapService.getTopicBySlug(slug, user));
    }
    @PostMapping("/{slug}/complete")
    public ResponseEntity<Void> completeTopic(
            @PathVariable String slug,
            @AuthenticationPrincipal User user
    ) {
        roadmapService.completeTopic(slug, user);
        return ResponseEntity.noContent().build();
    }
}
