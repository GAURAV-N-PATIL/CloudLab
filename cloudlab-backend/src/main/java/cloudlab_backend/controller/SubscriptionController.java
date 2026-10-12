package cloudlab_backend.controller;

import cloudlab_backend.entity.Subscription;
import cloudlab_backend.entity.User;
import cloudlab_backend.repository.SubscriptionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController{
    private final SubscriptionRepository subscriptionRepository;
    public SubscriptionController(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionResponse>> getMySubscriptions(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(subscriptionRepository
                .findByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(SubscriptionResponse::from)
                .toList());
    }

    // 204 when no subscription is ACTIVE and still before its expiry date.
    @GetMapping("/active")
    public ResponseEntity<SubscriptionResponse> getActiveSubscription(
            @AuthenticationPrincipal User user
    ) {
        LocalDateTime now = LocalDateTime.now();
        return subscriptionRepository
                .findByUser_IdAndStatusOrderByCreatedAtDesc(user.getId(), Subscription.Status.ACTIVE)
                .stream()
                .filter(sub -> sub.getExpiresAt() == null || sub.getExpiresAt().isAfter(now))
                .findFirst()
                .map(SubscriptionResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
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
