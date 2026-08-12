package cloudlab_backend.controller;
import cloudlab_backend.dto.AuthResponse;
import cloudlab_backend.dto.LoginRequest;
import cloudlab_backend.dto.SignupRequest;
import cloudlab_backend.entity.User;
import cloudlab_backend.repository.UserRepository;
import cloudlab_backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
public class AuthController{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ){
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @Valid @RequestBody SignupRequest request
    ){
        if(userRepository.existsByEmail(request.getEmail())){
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .build();
        }
        User user=new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );
        User savedUser=userRepository.save(user);
        String token= jwtUtil.generateToken(savedUser.getEmail());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new AuthResponse(token));
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ){
        User user= userRepository
                .findByEmail(request.getEmail())
                .orElse(null);
        if(user ==null || !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPasswordHash()
                )){
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }
        String token=jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(
                new AuthResponse(token)
        );
    }
}
