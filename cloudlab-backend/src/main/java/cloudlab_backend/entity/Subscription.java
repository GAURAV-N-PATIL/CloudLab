package cloudlab_backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(
    name = "subscriptions",
    indexes={
        @Index(
            name = "idx_subscriptions_user",
            columnList= "user_id"
        ),
        @Index(
            name = "idx_subscriptions_status",
            columnList="user_id,status"
        ),
        @Index(
            name = "idx_subscriptions_payment_ref",
            columnList= "payment_ref"
        )
    }
)
public class Subscription {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(
        name = "id",
        nullable =false,
        updatable = false
    )
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "user_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_subscriptions_user")
    )
    private User user;
    @Enumerated(EnumType.STRING)
    @Column(
        name ="plan",
        nullable = false
    )
    private Plan plan;
    @Enumerated(EnumType.STRING)
    @Column(
        name ="status",
        nullable = false
    )
    private Status status = Status.PENDING;
    @Column(name ="started_at")
    private LocalDateTime startedAt;
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    @Column(
        name= "payment_ref",
        length = 255
    )
    private String paymentRef;
    @Column(
        name ="created_at",
        nullable = false,
        insertable =false,
        updatable = false
    )
    private LocalDateTime createdAt;
    @Column(
        name="updated_at",
        nullable = false,
        insertable =false,
        updatable = false
    )
    private LocalDateTime updatedAt;
    public Subscription() {
    }
    public Long getId(){
        return id;
    }
    public User getUser(){
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public Plan getPlan() {
        return plan;
    }
    public void setPlan(Plan plan){
        this.plan=plan;
    }

    public Status getStatus(){
        return status;
    }
    public void setStatus(Status status) {
        this.status = status;
    }
    public LocalDateTime getStartedAt(){
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }
    public LocalDateTime getExpiresAt(){
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt =expiresAt;
    }
    public String getPaymentRef() {
        return paymentRef;
    }

    public void setPaymentRef(String paymentRef) {
        this.paymentRef = paymentRef;
    }

    public LocalDateTime getCreatedAt(){
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public enum Plan{
        MONTHLY,
        YEARLY,
        LIFETIME
    }
    public enum Status{
        PENDING,
        ACTIVE,
        EXPIRED,
        CANCELLED
    }
}
