package cloudlab_backend.controller;

import cloudlab_backend.entity.Subscription;
import cloudlab_backend.entity.User;
import cloudlab_backend.repository.SubscriptionRepository;
import cloudlab_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController{
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    public SubscriptionController(
            SubscriptionRepository subscriptionRepository,
            UserRepository userRepository
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository =userRepository;
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionResponse>> getMySubscriptions(
            Authentication authentication
    ) {
        User user = currentUser(authentication);
        List<SubscriptionResponse> subscriptions = subscriptionRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(SubscriptionResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(subscriptions);
    }

    @GetMapping("/active")
    public ResponseEntity<SubscriptionResponse> getActiveSubscription(
            Authentication authentication
    ) {
        User user = currentUser(authentication);
        return subscriptionRepository
                .findFirstByUserAndStatusOrderByCreatedAtDesc(user, Subscription.Status.ACTIVE)
                .map(SubscriptionResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
    private User currentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow();
    }
    public static class SubscriptionResponse {
        private Long id;
        private Subscription.Plan plan;
        private Subscription.Status status;
        private LocalDateTime startedAt;
        private LocalDateTime expiresAt;
        public static SubscriptionResponse from(Subscription sub) {
            SubscriptionResponse dto=new SubscriptionResponse();
            dto.id=sub.getId();
            dto.plan=sub.getPlan();
            dto.status= sub.getStatus();
            dto.startedAt =sub.getStartedAt();
            dto.expiresAt = sub.getExpiresAt();
            return dto;
        }
        public Long getId(){
            return id;
        }
        public Subscription.Plan getPlan(){
            return plan;
        }
        public Subscription.Status getStatus() {
            return status;
        }
        public LocalDateTime getStartedAt(){
            return startedAt;
        }
        public LocalDateTime getExpiresAt(){
            return expiresAt;
        }
    }
}
