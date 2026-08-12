package cloudlab_backend.service;
import cloudlab_backend.entity.UserTopicProgress;
import cloudlab_backend.repository.UserTopicProgressRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class UserTopicProgressService {
    private final UserTopicProgressRepository userTopicProgressRepository;
    public UserTopicProgressService(
            UserTopicProgressRepository userTopicProgressRepository){
        this.userTopicProgressRepository=userTopicProgressRepository;
    }

    public List<UserTopicProgress> getAllUserTopicProgress() {
        return userTopicProgressRepository.findAll();
    }
    public Optional<UserTopicProgress> getUserTopicProgressById(Long id) {
        return userTopicProgressRepository.findById(id);
    }
    public UserTopicProgress saveUserTopicProgress(
            UserTopicProgress userTopicProgress){
        return userTopicProgressRepository.save(userTopicProgress);
    }

    public void deleteUserTopicProgress(Long id) {
        userTopicProgressRepository.deleteById(id);
    }
}
