package cloudlab_backend.service;
import cloudlab_backend.entity.CloudProvider;
import cloudlab_backend.entity.User;
import cloudlab_backend.repository.CloudProviderRepository;
import cloudlab_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.NoSuchElementException;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final CloudProviderRepository cloudProviderRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoadmapService roadmapService;
    public UserService(
            UserRepository userRepository,
            CloudProviderRepository cloudProviderRepository,
            PasswordEncoder passwordEncoder,
            RoadmapService roadmapService
    ){
        this.userRepository =userRepository;
        this.cloudProviderRepository = cloudProviderRepository;
        this.passwordEncoder = passwordEncoder;
        this.roadmapService = roadmapService;
    }

    // Email arrives already normalized (trimmed, lower-case) by the request DTO.
    @Transactional
    public User signup(String name, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException("An account with this email already exists");
        }
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
    }

    // The cloud choice is made once, after the provider-neutral path, and never changes.
    @Transactional
    public void selectCloud(User user, Long cloudProviderId) {
        if (user.getSelectedCloud() != null) {
            throw new IllegalStateException("Cloud provider already selected");
        }
        CloudProvider cloudProvider = cloudProviderRepository.findById(cloudProviderId)
                .filter(provider -> Boolean.TRUE.equals(provider.getActive()))
                .orElseThrow(() -> new NoSuchElementException("Cloud provider not found"));
        if (!roadmapService.hasFinishedNeutralPath(user)) {
            throw new IllegalStateException("Finish the provider-neutral topics before choosing a cloud");
        }
        if (userRepository.selectCloudIfUnset(user.getId(), cloudProvider) == 0) {
            throw new IllegalStateException("Cloud provider already selected");
        }
    }
}
