package cloudlab_backend.security;
import cloudlab_backend.entity.User;
import cloudlab_backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    public JwtAuthenticationFilter(
            JwtUtil jwtUtil,
            UserRepository userRepository
    ) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null ||!authorizationHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }
        String token = authorizationHeader.substring(7);
        if(!jwtUtil.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }
        String email = jwtUtil.extractEmail(token);
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()){
            filterChain.doFilter(request, response);
            return;
        }
        User user = userOptional.get();
        UsernamePasswordAuthenticationToken authentication=new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_USER"))
                );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request,response);
    }
}
