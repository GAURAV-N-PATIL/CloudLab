package cloudlab_backend.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
@Embeddable
public class ProjectRequiredTopicId implements Serializable{
    @Column(name = "project_id", nullable=false)
    private Long projectId;
    @Column(name = "topic_id",nullable= false)
    private Long topicId;
    public ProjectRequiredTopicId(){}
    public ProjectRequiredTopicId(Long projectId,Long topicId){
        this.projectId = projectId;
        this.topicId =topicId;
    }
    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getTopicId() {
        return topicId;
    }
    public void setTopicId(Long topicId){
        this.topicId = topicId;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o){
            return true;
        }
        if (!(o instanceof ProjectRequiredTopicId that)){
            return false;
        }
        return Objects.equals(projectId,that.projectId)
                && Objects.equals(topicId, that.topicId);
    }
    @Override
    public int hashCode(){
        return Objects.hash(projectId, topicId);
    }
}
