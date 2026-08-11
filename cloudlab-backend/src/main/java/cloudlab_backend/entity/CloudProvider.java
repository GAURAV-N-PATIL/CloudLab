package cloudlab_backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(
    name ="cloud_providers",
    uniqueConstraints ={
        @UniqueConstraint(name="uk_cloud_providers_name",columnNames= "name"),
        @UniqueConstraint(name="uk_cloud_providers_slug", columnNames ="slug")
    }
)
public class CloudProvider{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false,length =100)
    private String name;
    @Column(nullable =false, length = 100)
    private String slug;
    @Column(columnDefinition= "TEXT")
    private String description;
    @Column(name = "is_active",nullable =false)
    private Boolean active = true;
    @Column(name= "created_at",nullable= false, updatable = false)
    private LocalDateTime createdAt;
    public CloudProvider(){
    }
    @PrePersist
    protected void onCreate(){
        createdAt =LocalDateTime.now();
    }
    public Long getId(){
        return id;
    }
    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name =name;
    }
    public String getSlug(){
        return slug;
    }
    public void setSlug(String slug){
        this.slug =slug;
    }
    public String getDescription(){
        return description;
    }
    public void setDescription(String description){
        this.description= description;
    }
    public Boolean getActive() {
        return active;
    }
    public void setActive(Boolean active) {
        this.active=active;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
