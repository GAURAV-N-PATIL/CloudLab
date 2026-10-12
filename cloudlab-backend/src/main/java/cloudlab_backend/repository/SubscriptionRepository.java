package cloudlab_backend.repository;
import cloudlab_backend.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription,Long> {
    List<Subscription> findByUser_IdOrderByCreatedAtDesc(Long userId);
    List<Subscription> findByUser_IdAndStatusOrderByCreatedAtDesc(
            Long userId,
            Subscription.Status status
    );
}
