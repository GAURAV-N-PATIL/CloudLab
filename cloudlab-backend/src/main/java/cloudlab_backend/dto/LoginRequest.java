package cloudlab_backend.dto;
import static cloudlab_backend.dto.Emails.normalizeEmail;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
public class LoginRequest{
    @NotBlank
    @Email
    private String email;
    @NotBlank
    private String password;
    public LoginRequest(){
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email=normalizeEmail(email);
    }
    public String getPassword(){
        return password;
    }
    public void setPassword(String password){
        this.password=password;
    }
}
