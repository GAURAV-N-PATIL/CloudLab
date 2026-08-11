package cloudlab_backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(
    name ="users",
    uniqueConstraints={
        @UniqueConstraint(
            name = "uk_users_email",
            columnNames="email"
        )
    },
    indexes={
        @Index(
            name="idx_users_role",
            columnList="role"
        ),
        @Index(
            name="idx_users_selected_cloud",
            columnList="selected_cloud_id"
        )
    }
)
public class User{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(
        name="id",
        nullable=false,
        updatable=false
    )
    private Long id;
    @Column(
        name="name",
        nullable=false,
        length=100
    )
    private String name;
    @Column(
        name="email",
        nullable=false,
        length=255
    )
    private String email;
    @Column(
        name="password_hash",
        nullable =false,
        length=255
    )
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    @Column(
        name ="role",
        nullable= false
    )
    private Role role =Role.USER;
    @Column(
        name= "email_verified",
        nullable = false
    )
    private boolean emailVerified= false;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "selected_cloud_id",
        foreignKey = @ForeignKey(name ="fk_users_selected_cloud")
    )
    private CloudProvider selectedCloud;
    @Column(
        name = "created_at",
        nullable= false,
        insertable = false,
        updatable =false
    )
    private LocalDateTime createdAt;
    @Column(
        name= "updated_at",
        nullable = false,
        insertable= false,
        updatable = false
    )
    private LocalDateTime updatedAt;
    public User(){
    }
    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id =id;
    }
    public String getName(){
        return name;
    }
    public void setName(String name) {
        this.name= name;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email) {
        this.email=email;
    }
    public String getPasswordHash(){
        return passwordHash;
    }
    public void setPasswordHash(String passwordHash){
        this.passwordHash= passwordHash;
    }
    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role= role;
    }
    public boolean isEmailVerified() {
        return emailVerified;
    }
    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }
    public CloudProvider getSelectedCloud(){
        return selectedCloud;
    }
    public void setSelectedCloud(CloudProvider selectedCloud) {
        this.selectedCloud = selectedCloud;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public LocalDateTime getUpdatedAt(){
        return updatedAt;
    }
    public enum Role{
        USER,
        ADMIN
    }
}
