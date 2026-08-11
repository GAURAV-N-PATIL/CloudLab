package cloudlab_backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(
    name ="user_topic_progress",
    uniqueConstraints={
        @UniqueConstraint(
            name ="uk_user_topic_progress",
            columnNames= {"user_id", "topic_id"}
        )
    },
    indexes ={
        @Index(
            name = "idx_user_topic_progress_user",
            columnList= "user_id"
        ),
        @Index(
            name ="idx_user_topic_progress_topic",
            columnList="topic_id"
        ),
        @Index(
            name ="idx_user_topic_progress_status",
            columnList= "user_id, status"
        )
    }
)
public class UserTopicProgress{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(
        name = "id",
        nullable =false,
        updatable =false
    )
    private Long id;
    @ManyToOne(fetch= FetchType.LAZY,optional= false)
    @JoinColumn(
        name = "user_id",
        nullable = false,
        foreignKey = @ForeignKey(name ="fk_user_topic_progress_user")
    )
    private User user;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "topic_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_user_topic_progress_topic")
    )
    private Topic topic;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "status",
        nullable = false
    )
    private Status status = Status.IN_PROGRESS;
    @Column(
        name="started_at"
    )
    private LocalDateTime startedAt;
    @Column(
        name ="completed_at"
    )
    private LocalDateTime completedAt;

    @Column(
        name = "updated_at",
        nullable =false,
        insertable= false,
        updatable = false
    )
    private LocalDateTime updatedAt;
    public UserTopicProgress(){
    }
    public Long getId(){
        return id;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user= user;
    }
    public Topic getTopic() {
        return topic;
    }
    public void setTopic(Topic topic) {
        this.topic =topic;
    }
    public Status getStatus(){
        return status;
    }
    public void setStatus(Status status) {
        this.status =status;
    }
    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt=completedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public enum Status {
        IN_PROGRESS,
        COMPLETED
    }
}
