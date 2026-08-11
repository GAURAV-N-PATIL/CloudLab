package cloudlab_backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(
    name ="user_project_progress",
    uniqueConstraints ={
        @UniqueConstraint(
            name ="uk_user_project_progress",
            columnNames= {"user_id", "project_id"}
        )
    },
    indexes ={
        @Index(
            name = "idx_user_project_progress_user",
            columnList= "user_id"
        ),
        @Index(
            name ="idx_user_project_progress_project",
            columnList= "project_id"
        ),
        @Index(
            name = "idx_user_project_progress_status",
            columnList= "user_id, status"
        )
    }
)
public class UserProjectProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(
        name = "id",
        nullable = false,
        updatable = false
    )
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "user_id",
        nullable = false,
        foreignKey = @ForeignKey(
            name ="fk_user_project_progress_user"
        )
    )
    private User user;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "project_id",
        nullable = false,
        foreignKey = @ForeignKey(
            name = "fk_user_project_progress_project"
        )
    )
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "status",
        nullable =false
    )
    private Status status = Status.IN_PROGRESS;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    @Column(
        name = "updated_at",
        nullable = false,
        insertable = false,
        updatable = false
    )
    private LocalDateTime updatedAt;

    public UserProjectProgress() {
    }

    public Long getId() {
        return id;}

    public User getUser(){
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    public Project getProject() {
        return project;
    }
    public void setProject(Project project) {
        this.project=project;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
    public LocalDateTime getStartedAt(){
        return startedAt;
    }
    public void setStartedAt(LocalDateTime startedAt){
        this.startedAt = startedAt;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
    public LocalDateTime getUpdatedAt(){
        return updatedAt;
    }

    public enum Status {
        IN_PROGRESS,
        SUBMITTED,
        COMPLETED
    }
}
