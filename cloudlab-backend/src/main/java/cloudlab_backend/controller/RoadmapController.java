package cloudlab_backend.controller;
import cloudlab_backend.entity.User;
import cloudlab_backend.repository.UserRepository;
import cloudlab_backend.service.RoadmapService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/roadmap")
public class RoadmapController{
    private final UserRepository userRepository;
    private final RoadmapService roadmapService;
    public RoadmapController(
            UserRepository userRepository,
            RoadmapService roadmapService
    ) {
        this.userRepository =userRepository;
        this.roadmapService = roadmapService;
    }
    @GetMapping
    public ResponseEntity<List<RoadmapService.RoadmapTopic>> getRoadmap(
            Authentication authentication
    ){
        String email= authentication.getName();
        User user = userRepository
                .findByEmail(email)
                .orElseThrow();
        return ResponseEntity.ok(
                roadmapService.getRoadmap(user)
        );
    }
    @GetMapping("/{slug}")
    public ResponseEntity<RoadmapService.TopicDetail> getTopic(
            @PathVariable String slug,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository
                .findByEmail(email)
                .orElseThrow();
        return ResponseEntity.ok(
                roadmapService.getTopicBySlug(slug, user)
        );
    }
}
