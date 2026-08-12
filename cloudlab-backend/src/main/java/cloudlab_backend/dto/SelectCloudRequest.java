package cloudlab_backend.dto;
import jakarta.validation.constraints.NotNull;
public class SelectCloudRequest{
    @NotNull
    private Long cloudProviderId;
    public SelectCloudRequest(){
    }
    public Long getCloudProviderId(){
        return cloudProviderId;
    }
    public void setCloudProviderId(Long cloudProviderId) {
        this.cloudProviderId=cloudProviderId;
    }
}
