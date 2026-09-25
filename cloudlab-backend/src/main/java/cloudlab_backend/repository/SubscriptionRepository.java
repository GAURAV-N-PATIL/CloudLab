package cloudlab_backend.repository;
import cloudlab_backend.entity.Subscription;
import cloudlab_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface SubscriptionRepository extends JpaRepository<Subscription,Long> {
    List<Subscription> findByUserOrderByCreatedAtDesc(User user);
    Optional<Subscription> findFirstByUserAndStatusOrderByCreatedAtDesc(
            User user,
            Subscription.Status status
    );

}
