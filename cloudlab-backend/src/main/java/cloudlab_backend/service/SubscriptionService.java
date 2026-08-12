package cloudlab_backend.service;
import cloudlab_backend.entity.Subscription;
import cloudlab_backend.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    public List<Subscription> getAllSubscriptions(){
        return subscriptionRepository.findAll();}

    public Optional<Subscription> getSubscriptionById(Long id){
        return subscriptionRepository.findById(id);
    }

    public Subscription saveSubscription(Subscription subscription){
        return subscriptionRepository.save(subscription);
    }

    public void deleteSubscription(Long id){
        subscriptionRepository.deleteById(id);
    }
}
