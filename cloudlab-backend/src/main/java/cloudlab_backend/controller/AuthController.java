package cloudlab_backend.controller;
import cloudlab_backend.dto.AuthResponse;
import cloudlab_backend.dto.LoginRequest;
import cloudlab_backend.dto.SignupRequest;
import cloudlab_backend.entity.User;
import cloudlab_backend.security.JwtUtil;
import cloudlab_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
public class AuthController{
    private final UserService userService;
    private final JwtUtil jwtUtil;
    public AuthController(
            UserService userService,
            JwtUtil jwtUtil
    ){
        this.userService=userService;
        this.jwtUtil = jwtUtil;
    }
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @Valid @RequestBody SignupRequest request
    ){
        User user = userService.signup(request.getName(), request.getEmail(), request.getPassword());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new AuthResponse(jwtUtil.generateToken(user.getEmail())));
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ){
        User user = userService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(
                new AuthResponse(jwtUtil.generateToken(user.getEmail()))
        );
    }
}
