package cloudlab_backend.service;
import cloudlab_backend.entity.Topic;
import cloudlab_backend.entity.TopicResource;
import cloudlab_backend.entity.User;
import cloudlab_backend.entity.UserTopicProgress;
import cloudlab_backend.repository.TopicRepository;
import cloudlab_backend.repository.TopicResourceRepository;
import cloudlab_backend.repository.UserTopicProgressRepository;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class RoadmapService{
    private final TopicRepository topicRepository;
    private final TopicResourceRepository topicResourceRepository;
    private final UserTopicProgressRepository progressRepository;
    public RoadmapService(
            TopicRepository topicRepository,
            TopicResourceRepository topicResourceRepository,
            UserTopicProgressRepository progressRepository
    ) {
        this.topicRepository = topicRepository;
        this.topicResourceRepository =topicResourceRepository;
        this.progressRepository =progressRepository;
    }
    public List<RoadmapTopic> getRoadmap(User user){
        Long cloudProviderId = user.getSelectedCloud()!=null ? user.getSelectedCloud().getId()
                : null;
        List<Topic> topics;
        if(cloudProviderId == null) {
            topics = topicRepository.findAll();
        } else {
            topics = topicRepository
                    .findByCloudProviderIsNullOrCloudProvider_Id(
                            cloudProviderId
                    );
        }
        List<UserTopicProgress> progressList =
                progressRepository.findByUser_Id(user.getId());
        Map<Long, UserTopicProgress.Status> progressMap =
                new HashMap<>();
        for (UserTopicProgress progress : progressList) {
            progressMap.put(
                    progress.getTopic().getId(),
                    progress.getStatus()
            );
        }
        return topics.stream()
                .sorted((a, b) ->
                        Integer.compare(
                                a.getOrderIndex(),
                                b.getOrderIndex()
                        )
                )
                .map(topic ->
                        buildRoadmapTopic(topic, progressMap)
                )
                .toList();
    }
    public TopicDetail getTopicBySlug(
            String slug,
            User user
    ) {

        Topic topic = topicRepository
                .findBySlug(slug)
                .orElseThrow();

        Long cloudProviderId = user.getSelectedCloud() != null ? user.getSelectedCloud().getId()
                : null;
        if(topic.getCloudProvider() != null
                && !topic.getCloudProvider().getId().equals(cloudProviderId)){
            throw new IllegalArgumentException(
                    "Topic is not available for the selected cloud provider"
            );
        }
        List<UserTopicProgress> progressList =
                progressRepository.findByUser_Id(user.getId());

        Map<Long, UserTopicProgress.Status> progressMap =
                new HashMap<>();

        for (UserTopicProgress progress : progressList) {
            progressMap.put(
                    progress.getTopic().getId(),
                    progress.getStatus()
            );
        }
        String status = getTopicStatus(topic, progressMap);
        List<TopicResource> resources =topicResourceRepository
                        .findByTopic_IdOrderByOrderIndexAsc(
                                topic.getId()
                        );
        List<TopicResourceResponse> resourceResponses =
                resources.stream()
                        .map(resource ->
                                new TopicResourceResponse(
                                        resource.getId(),
                                        resource.getType().name(),
                                        resource.getTitle(),
                                        resource.getUrl(),
                                        resource.getOrderIndex()
                                )
                        )
                        .toList();
        return new TopicDetail(
                topic.getId(),
                topic.getName(),
                topic.getSlug(),
                topic.getLevel().name(),
                topic.getOrderIndex(),
                topic.getDescription(),
                status,
                topic.getPrerequisiteTopic() != null
                        ? topic.getPrerequisiteTopic().getSlug()
                        : null,
                resourceResponses
        );
    }
    private String getTopicStatus(
            Topic topic,
            Map<Long, UserTopicProgress.Status> progressMap
    ) {

        UserTopicProgress.Status progressStatus =
                progressMap.get(topic.getId());

        if (progressStatus == UserTopicProgress.Status.COMPLETED) {
            return "COMPLETED";
        }

        if (progressStatus == UserTopicProgress.Status.IN_PROGRESS) {
            return "IN_PROGRESS";
        }

        if (isUnlocked(topic, progressMap)) {
            return "UNLOCKED";
        }

        return "LOCKED";
    }
    private RoadmapTopic buildRoadmapTopic(
            Topic topic,
            Map<Long, UserTopicProgress.Status> progressMap
    ) {

        return new RoadmapTopic(
                topic.getId(),
                topic.getName(),
                topic.getSlug(),
                topic.getLevel().name(),
                topic.getOrderIndex(),
                topic.getDescription(),
                getTopicStatus(topic, progressMap)
        );
    }
    private boolean isUnlocked(
            Topic topic,
            Map<Long, UserTopicProgress.Status> progressMap
    ) {

        Topic prerequisite = topic.getPrerequisiteTopic();

        if (prerequisite == null) {
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
    public record TopicDetail(
            Long id,
            String name,
            String slug,
            String level,
            Integer orderIndex,
            String description,
            String status,
            String prerequisiteSlug,
            List<TopicResourceResponse> resources
    ) {
    }
    public record TopicResourceResponse(
            Long id,
            String type,
            String title,
            String url,
            Integer orderIndex
    ) {
    }
}
