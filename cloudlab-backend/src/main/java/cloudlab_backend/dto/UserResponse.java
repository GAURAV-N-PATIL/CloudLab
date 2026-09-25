package cloudlab_backend.dto;
import cloudlab_backend.entity.User;
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean emailVerified;
    private String selectedCloudSlug;
    private String selectedCloudName;
    public static UserResponse from(User user) {
        UserResponse dto =new UserResponse();
        dto.id = user.getId();
        dto.name = user.getName();
        dto.email =user.getEmail();
        dto.role =user.getRole().name();
        dto.emailVerified =user.isEmailVerified();
        if (user.getSelectedCloud() != null) {
            dto.selectedCloudSlug =user.getSelectedCloud().getSlug();
            dto.selectedCloudName =user.getSelectedCloud().getName();
        }
        return dto;
    }
    public Long getId(){
        return id;
    }
    public String getName(){
        return name;
    }
    public String getEmail(){
        return email;
    }
    public String getRole(){
        return role;
    }
    public boolean isEmailVerified() {
        return emailVerified;
    }
    public String getSelectedCloudSlug(){
        return selectedCloudSlug;
    }
    public String getSelectedCloudName(){
        return selectedCloudName;
    }
}
