package cloudlab_backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(
    name ="projects",
    uniqueConstraints={
        @UniqueConstraint(
            name = "uk_projects_slug",
            columnNames="slug"
        )
    },
    indexes ={
        @Index(
            name= "idx_projects_cloud_provider",
            columnList= "cloud_provider_id"
        ),
        @Index(
            name ="idx_projects_level",
            columnList="level"
        ),
        @Index(
            name="idx_projects_free",
            columnList= "is_free"
        ),
        @Index(
            name = "idx_projects_order",
            columnList="order_index"
        )
    }
)
public class Project{
    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    @Column(
        name ="id",
        nullable = false,
        updatable = false
    )
    private Long id;
    @ManyToOne(fetch =FetchType.LAZY)
    @JoinColumn(
        name = "cloud_provider_id",
        foreignKey =@ForeignKey(name= "fk_projects_cloud_provider")
    )
    private CloudProvider cloudProvider;
    @Column(
        name = "title",
        nullable = false,
        length = 200
    )
    private String title;

    @Column(
        name = "slug",
        nullable =false,
        length =200
    )
    private String slug;
    @Column(
        name = "description",
        nullable = false,
        columnDefinition ="TEXT"
    )
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "level",
        nullable = false
    )
    private Level level;

    @Column(
        name ="is_free",
        nullable = false
    )
    private Boolean free = false;
    @Column(
        name = "order_index",
        nullable =false
    )
    private Integer orderIndex;

    @Column(
        name = "created_at",
        nullable =false,
        insertable = false,
        updatable =false
    )
    private LocalDateTime createdAt;
    @Column(
        name = "updated_at",
        nullable =false,
        insertable = false,
        updatable= false
    )
    private LocalDateTime updatedAt;
    public Project(){
    }
    public Long getId(){
        return id;
    }

    public CloudProvider getCloudProvider() {
        return cloudProvider;
    }
    public void setCloudProvider(CloudProvider cloudProvider) {
        this.cloudProvider= cloudProvider;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug(){
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description =description;
    }

    public Level getLevel(){
        return level;
    }
    public void setLevel(Level level) {
        this.level = level;
    }
    public Boolean getFree() {
        return free;
    }
    public void setFree(Boolean free){
        this.free=free;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex){
        this.orderIndex = orderIndex;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public enum Level{
        BEGINNER,
        INTERMEDIATE,
        ADVANCED
    }
}
