package cloudlab_backend.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(
    name ="certificates",
    uniqueConstraints = {
        @UniqueConstraint(
            name= "uk_certificates_code",
            columnNames ="certificate_code"
        )
    },
    indexes={
        @Index(
            name = "idx_certificates_user",
            columnList= "user_id"
        )
    }
)
public class Certificate{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(
        name ="id",
        nullable = false,
        updatable=false
    )
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY,optional =false)
    @JoinColumn(
        name ="user_id",
        nullable= false,
        foreignKey = @ForeignKey(name ="fk_certificates_user")
    )
    private User user;
    @Column(
        name = "certificate_code",
        nullable = false,
        length =100
    )
    private String certificateCode;
    @Column(
        name = "issued_at",
        nullable =false,
        insertable = false,
        updatable =false
    )
    private LocalDateTime issuedAt;
    @Column(
        name = "pdf_url",
        length=2048
    )
    private String pdfUrl;
    public Certificate() {
    }
    public Long getId() {
        return id;
    }
    public User getUser(){
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public String getCertificateCode() {
        return certificateCode;
    }

    public void setCertificateCode(String certificateCode){
        this.certificateCode=certificateCode;
    }

    public LocalDateTime getIssuedAt(){
        return issuedAt;
    }

    public String getPdfUrl(){
        return pdfUrl;
    }

    public void setPdfUrl(String pdfUrl){
        this.pdfUrl= pdfUrl;
    }
}
