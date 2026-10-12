package cloudlab_backend.controller;
import cloudlab_backend.dto.UserResponse;
import cloudlab_backend.dto.SelectCloudRequest;
import cloudlab_backend.entity.User;
import cloudlab_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/users")
public class UserController{
    private final UserService userService;
    public UserController(UserService userService){
        this.userService=userService;
    }
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(UserResponse.from(user));
    }
    @PostMapping("/select-cloud")
    public ResponseEntity<Void> selectCloud(
            @Valid @RequestBody SelectCloudRequest request,
            @AuthenticationPrincipal User user
    ){
        userService.selectCloud(user, request.getCloudProviderId());
        return ResponseEntity.ok().build();
    }
}
