package cloudlab_backend.entity;
import jakarta.persistence.*;
@Entity
@Table(
    name ="project_required_topics",
    indexes={
        @Index(
            name="idx_project_required_topics_topic",
            columnList="topic_id"
        )
    }
)
public class ProjectRequiredTopic{
    @EmbeddedId
    private ProjectRequiredTopicId id;
    @ManyToOne(fetch=FetchType.LAZY,optional = false)
    @MapsId("projectId")
    @JoinColumn(
        name = "project_id",
        nullable =false,
        foreignKey= @ForeignKey(
            name= "fk_project_required_topics_project"
        )
    )
    private Project project;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("topicId")
    @JoinColumn(
        name= "topic_id",
        nullable = false,
        foreignKey = @ForeignKey(
            name= "fk_project_required_topics_topic"
        )
    )
    private Topic topic;
    public ProjectRequiredTopic() {
    }

    public ProjectRequiredTopic(Project project,Topic topic){
        this.project = project;
        this.topic =topic;

        this.id =new ProjectRequiredTopicId(
            project.getId(),
            topic.getId()
        );
    }

    public ProjectRequiredTopicId getId(){
        return id;
    }
    public void setId(ProjectRequiredTopicId id) {
        this.id = id;
    }

    public Project getProject(){
        return project;
    }

    public void setProject(Project project) {
        this.project =project;
    }
    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic= topic;
    }
}
