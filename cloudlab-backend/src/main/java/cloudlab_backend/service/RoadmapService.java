package cloudlab_backend.service;
import cloudlab_backend.entity.Topic;
import cloudlab_backend.entity.User;
import cloudlab_backend.entity.UserTopicProgress;
import cloudlab_backend.repository.TopicRepository;
import cloudlab_backend.repository.UserTopicProgressRepository;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class RoadmapService{
    private final TopicRepository topicRepository;
    private final UserTopicProgressRepository progressRepository;
    public RoadmapService(
            TopicRepository topicRepository,
            UserTopicProgressRepository progressRepository
    ){
        this.topicRepository = topicRepository;
        this.progressRepository=progressRepository;
    }
    public List<RoadmapTopic>getRoadmap(User user){
        Long cloudProviderId = user.getSelectedCloud()!=null ? user.getSelectedCloud().getId()
                : null;
        List<Topic> topics;
        if(cloudProviderId== null){
            topics = topicRepository.findAll();
        } else{
            topics =topicRepository
                    .findByCloudProviderIsNullOrCloudProvider_Id(
                            cloudProviderId
                    );
        }
        List<UserTopicProgress> progressList = progressRepository.findByUser_Id(user.getId());
        Map<Long, UserTopicProgress.Status> progressMap =new HashMap<>();
        for(UserTopicProgress progress : progressList) {
            progressMap.put(
                    progress.getTopic().getId(),
                    progress.getStatus()
            );
        }
        return topics.stream()
                .sorted((a, b) -> Integer.compare(
                                a.getOrderIndex(),
                                b.getOrderIndex()
                        )
                )
                .map(topic -> buildRoadmapTopic(topic, progressMap))
                .toList();
    }
    private RoadmapTopic buildRoadmapTopic(
            Topic topic,
            Map<Long, UserTopicProgress.Status>progressMap
    ){
        UserTopicProgress.Status progressStatus= progressMap.get(topic.getId());
        String status;
        if(progressStatus ==UserTopicProgress.Status.COMPLETED){
            status ="COMPLETED";
	}else if (progressStatus == UserTopicProgress.Status.IN_PROGRESS) {
            status ="IN_PROGRESS";
        } else if(isUnlocked(topic, progressMap)) {
            status= "UNLOCKED";
        } else{
            status = "LOCKED";
        }
        return new RoadmapTopic(
                topic.getId(),
                topic.getName(),
                topic.getSlug(),
                topic.getLevel().name(),
                topic.getOrderIndex(),
                topic.getDescription(),
                status
        );
    }
    private boolean isUnlocked(Topic topic, Map<Long, UserTopicProgress.Status> progressMap
    ){
        Topic prerequisite = topic.getPrerequisiteTopic();
        if(prerequisite == null){
            return true;
        }
        return progressMap.get(prerequisite.getId())
                == UserTopicProgress.Status.COMPLETED;
    }
    public record RoadmapTopic(
            Long id,
            String name,
            String slug,
            String level,
            Integer orderIndex,
            String description,
            String status
    ) {
    }
}
