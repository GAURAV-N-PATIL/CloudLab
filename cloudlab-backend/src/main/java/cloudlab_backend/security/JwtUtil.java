package cloudlab_backend.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtUtil{
    private final SecretKey secretKey;
    private final long expiration;
    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration
    ){
        this.secretKey=Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
        this.expiration=expiration;
    }
    public String generateToken(String email){
        Date now =new Date();
        Date expiryDate= new Date(now.getTime() + expiration);
        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }
    // The token's subject (email) when the signature and expiry check out, otherwise empty.
    public Optional<String> extractValidEmail(String token){
        try {
            return Optional.ofNullable(getClaims(token).getSubject());
        } catch (JwtException | IllegalArgumentException e){
            return Optional.empty();
        }
    }
    private Claims getClaims(String token){
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
