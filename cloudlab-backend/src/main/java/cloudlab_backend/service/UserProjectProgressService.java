package cloudlab_backend.service;
import cloudlab_backend.entity.UserProjectProgress;
import cloudlab_backend.repository.UserProjectProgressRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class UserProjectProgressService {
    private final UserProjectProgressRepository userProjectProgressRepository;
    public UserProjectProgressService(
            UserProjectProgressRepository userProjectProgressRepository) {
        this.userProjectProgressRepository= userProjectProgressRepository;
    }
    public List<UserProjectProgress> getAllUserProjectProgress(){
        return userProjectProgressRepository.findAll();
    }
    public Optional<UserProjectProgress> getUserProjectProgressById(Long id){
        return userProjectProgressRepository.findById(id);
    }
    public UserProjectProgress saveUserProjectProgress(
            UserProjectProgress userProjectProgress){
        return userProjectProgressRepository.save(userProjectProgress);
    }
    public void deleteUserProjectProgress(Long id){
        userProjectProgressRepository.deleteById(id);
    }
}
