package cloudlab_backend.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

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
    public String extractEmail(String token){
        return getClaims(token).getSubject();
    }
    public boolean isTokenValid(String token){
        try {
            getClaims(token);
            return true;
        } catch (Exception e){
            return false;
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
