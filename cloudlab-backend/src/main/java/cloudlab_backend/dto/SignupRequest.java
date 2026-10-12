package cloudlab_backend.dto;
import static cloudlab_backend.dto.Emails.normalizeEmail;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public class SignupRequest{
    @NotBlank
    @Size(max =100)
    private String name;
    @NotBlank
    @Email
    private String email;
    @NotBlank
    @Size(min=8,max=100)
    private String password;
    public SignupRequest(){}
    public String getName(){
        return name;
    }
    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email=normalizeEmail(email);
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password= password;
    }
}
