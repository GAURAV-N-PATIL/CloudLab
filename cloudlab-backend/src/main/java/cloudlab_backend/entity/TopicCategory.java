package cloudlab_backend.entity;
import jakarta.persistence.*;
@Entity
@Table(
    name="topic_categories",
    uniqueConstraints ={
        @UniqueConstraint(name ="uk_topic_categories_name",columnNames="name"),
        @UniqueConstraint(name="uk_topic_categories_slug",columnNames= "slug")},
    indexes ={
        @Index(name= "idx_topic_categories_order",columnList ="order_index")
    }
)
public class TopicCategory{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(
        name ="id",
        nullable = false,
        updatable= false
    )
    private Long id;
    @Column(
        name ="name",
        nullable = false,
        length= 100
	)
    private String name;
    @Column(
        name="slug",
        nullable = false,
        length = 100
    )
    private String slug;
    @Column(
        name = "order_index",
        nullable =false
    )
    private Integer orderIndex =0;
    public TopicCategory(){
    }
    public Long getId(){
        return id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name=name;
    }
    public String getSlug(){
        return slug;
    }
    public void setSlug(String slug) {
        this.slug= slug;
    }
    public Integer getOrderIndex(){
        return orderIndex;
    }
    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex=orderIndex;
    }
}
