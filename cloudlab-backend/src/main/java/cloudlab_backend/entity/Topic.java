package cloudlab_backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(
    name ="topics",
    uniqueConstraints = {
        @UniqueConstraint(
            name= "uk_topics_slug",
            columnNames ="slug"
        )
    },
    indexes ={
        @Index(
            name= "idx_topics_category",
            columnList = "category_id"
        ),
        @Index(
            name= "idx_topics_cloud_provider",
            columnList = "cloud_provider_id"
        ),
        @Index(
            name = "idx_topics_level",
            columnList="level"
        ),
        @Index(
            name ="idx_topics_order",
            columnList="order_index"
        ),
        @Index(
            name = "idx_topics_prerequisite",
            columnList = "prerequisite_topic_id"
        )
    }
)
public class Topic{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(
        name ="id",
        nullable= false,
        updatable=false
    )
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY, optional=false)
    @JoinColumn(
        name ="category_id",
        nullable=false,
        foreignKey =@ForeignKey(name ="fk_topics_category")
    )
    private TopicCategory category;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name ="cloud_provider_id",
        foreignKey= @ForeignKey(name="fk_topics_cloud_provider")
    )
    private CloudProvider cloudProvider;
    @Column(
        name ="name",
        nullable= false,
        length= 150
    )
    private String name;
    @Column(
        name="slug",
        nullable = false,
        unique= true,
        length= 150
    )
    private String slug;
    @Enumerated(EnumType.STRING)
    @Column(
        name ="level",
        nullable= false
    )
    private Level level;
    @Column(
        name ="order_index",
        nullable= false
    )
    private Integer orderIndex;
    @ManyToOne(fetch =FetchType.LAZY)
    @JoinColumn(
        name ="prerequisite_topic_id",
        foreignKey = @ForeignKey(name = "fk_topics_prerequisite")
    )
    private Topic prerequisiteTopic;
    @Column(
        name = "description",
        columnDefinition="TEXT"
    )
    private String description;
    @Column(
        name ="created_at",
        nullable= false,
        insertable=false,
        updatable=false
    )
    private LocalDateTime createdAt;
    @Column(
        name = "updated_at",
        nullable = false,
        insertable= false,
        updatable = false
    )
    private LocalDateTime updatedAt;
    public Topic(){
    }
    public Long getId() {
        return id;
    }
    public TopicCategory getCategory() {
        return category;
    }
    public void setCategory(TopicCategory category) {
        this.category = category;
    }
    public CloudProvider getCloudProvider() {
        return cloudProvider;
    }
    public void setCloudProvider(CloudProvider cloudProvider){
        this.cloudProvider = cloudProvider;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getSlug() {
        return slug;
    }
    public void setSlug(String slug) {
        this.slug= slug;
    }
    public Level getLevel() {
        return level;
    }
    public void setLevel(Level level){
        this.level = level;
    }
    public Integer getOrderIndex() {
        return orderIndex;
    }
    public void setOrderIndex(Integer orderIndex){
        this.orderIndex=orderIndex;
    }
    public Topic getPrerequisiteTopic() {
        return prerequisiteTopic;
    }
    public void setPrerequisiteTopic(Topic prerequisiteTopic) {
        this.prerequisiteTopic=prerequisiteTopic;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
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
