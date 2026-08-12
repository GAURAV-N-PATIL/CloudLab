package cloudlab_backend.controller;
import cloudlab_backend.dto.SelectCloudRequest;
import cloudlab_backend.entity.CloudProvider;
import cloudlab_backend.entity.User;
import cloudlab_backend.repository.CloudProviderRepository;
import cloudlab_backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/users")
public class UserController{
    private final UserRepository userRepository;
    private final CloudProviderRepository cloudProviderRepository;
    public UserController(
            UserRepository userRepository,
            CloudProviderRepository cloudProviderRepository
    ){
        this.userRepository=userRepository;
        this.cloudProviderRepository=cloudProviderRepository;
    }
    @PostMapping("/select-cloud")
    public ResponseEntity<Void> selectCloud(@Valid @RequestBody SelectCloudRequest request, Authentication authentication){
        String email =authentication.getName();
        User user=userRepository
                .findByEmail(email)
                .orElseThrow();
        if(user.getSelectedCloud() !=null){
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .build();
        }
        CloudProvider cloudProvider= cloudProviderRepository
                .findById(request.getCloudProviderId())
                .orElse(null);
        if (cloudProvider == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
        if(!Boolean.TRUE.equals(cloudProvider.getActive())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .build();
        }
        user.setSelectedCloud(cloudProvider);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }
}
