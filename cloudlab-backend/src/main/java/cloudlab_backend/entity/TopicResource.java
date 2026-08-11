package cloudlab_backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(
    name ="topic_resources",
    indexes= {
        @Index(
            name = "idx_topic_resources_topic",
            columnList = "topic_id"
        ),
        @Index(
            name = "idx_topic_resources_order",
            columnList= "topic_id, order_index"
        )
    }
)
public class TopicResource{
    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    @Column(
        name = "id",
        nullable =false,
        updatable = false
    )
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "topic_id",
        nullable = false,
        foreignKey =@ForeignKey(name = "fk_topic_resources_topic")
    )
    private Topic topic;
    @Enumerated(EnumType.STRING)
    @Column(
        name = "type",
        nullable = false
    )
    private ResourceType type;

    @Column(
        name = "title",
        nullable =false,
        length = 255
    )
    private String title;
    @Column(
        name = "url",
        nullable = false,
        length = 2048
    )
    private String url;

    @Column(
        name = "order_index",
        nullable = false
    )
    private Integer orderIndex = 0;

    @Column(
        name = "created_at",
        nullable= false,
        insertable = false,
        updatable = false
    )
    private LocalDateTime createdAt;

    public TopicResource(){
    }
    public Long getId() {
        return id;
    }
    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic){
        this.topic=topic;
    }

    public ResourceType getType(){
        return type;
    }

    public void setType(ResourceType type) {
        this.type=type;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl(){
        return url;
	}

    public void setUrl(String url) {
        this.url = url;
    }
    public Integer getOrderIndex(){
        return orderIndex;
    }
    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
    public enum ResourceType{
        YOUTUBE_VIDEO,
        YOUTUBE_PLAYLIST,
        PDF,
        ARTICLE
    }
}
