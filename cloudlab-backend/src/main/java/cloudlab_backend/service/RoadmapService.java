package cloudlab_backend.service;
import cloudlab_backend.entity.Topic;
import cloudlab_backend.entity.User;
import cloudlab_backend.entity.UserTopicProgress;
import cloudlab_backend.repository.TopicRepository;
import cloudlab_backend.repository.TopicResourceRepository;
import cloudlab_backend.repository.UserTopicProgressRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

// Transactional so lazy associations (e.g. a topic's prerequisite) can be read while
// building responses; open-in-view is off, so there is no session outside a transaction.
@Service
@Transactional(readOnly = true)
public class RoadmapService{
    private final TopicRepository topicRepository;
    private final TopicResourceRepository topicResourceRepository;
    private final UserTopicProgressRepository progressRepository;
    private final CertificateService certificateService;
    public RoadmapService(
            TopicRepository topicRepository,
            TopicResourceRepository topicResourceRepository,
            UserTopicProgressRepository progressRepository,
            CertificateService certificateService
    ) {
        this.topicRepository = topicRepository;
        this.topicResourceRepository =topicResourceRepository;
        this.progressRepository =progressRepository;
        this.certificateService = certificateService;
    }
    public List<RoadmapTopic> getRoadmap(User user){
        Map<Long, UserTopicProgress.Status> progressMap = progressByTopicId(user);
        return availableTopics(user).stream()
                .map(topic -> buildRoadmapTopic(topic, progressMap))
                .toList();
    }
    public TopicDetail getTopicBySlug(String slug, User user) {
        Topic topic = findAvailableTopic(slug, user);
        String status = getTopicStatus(topic, progressByTopicId(user));
        List<TopicResourceResponse> resources = topicResourceRepository
                .findByTopic_IdOrderByOrderIndexAsc(topic.getId())
                .stream()
                .map(resource -> new TopicResourceResponse(
                        resource.getId(),
                        resource.getType().name(),
                        resource.getTitle(),
                        resource.getUrl(),
                        resource.getOrderIndex()
                ))
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
                resources
        );
    }
    // Idempotent: completing a finished topic changes nothing, but still re-checks the certificate.
    @Transactional
    public void completeTopic(String slug, User user) {
        Topic topic = findAvailableTopic(slug, user);
        Map<Long, UserTopicProgress.Status> progressMap = progressByTopicId(user);
        if (progressMap.get(topic.getId()) != UserTopicProgress.Status.COMPLETED) {
            if (!isUnlocked(topic, progressMap)) {
                throw new IllegalStateException("Topic is locked");
            }
            UserTopicProgress progress = progressRepository
                    .findByUser_IdAndTopic_Id(user.getId(), topic.getId())
                    .orElseGet(() -> {
                        UserTopicProgress newProgress = new UserTopicProgress();
                        newProgress.setUser(user);
                        newProgress.setTopic(topic);
                        newProgress.setStartedAt(LocalDateTime.now());
                        return newProgress;
                    });
            progress.setStatus(UserTopicProgress.Status.COMPLETED);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);
            progressMap.put(topic.getId(), UserTopicProgress.Status.COMPLETED);
        }
        List<Topic> track = availableTopics(user);
        if (user.getSelectedCloud() != null && !track.isEmpty() && allCompleted(track, progressMap)) {
            certificateService.issueIfMissing(user);
        }
    }
    // The cloud track can only be chosen once every provider-neutral topic is complete.
    public boolean hasFinishedNeutralPath(User user) {
        return allCompleted(topicRepository.findByCloudProviderIsNull(), progressByTopicId(user));
    }

    // Neutral topics always; provider topics only for the learner's chosen cloud.
    private List<Topic> availableTopics(User user) {
        Long cloudProviderId = selectedCloudId(user);
        List<Topic> topics = cloudProviderId == null
                ? topicRepository.findByCloudProviderIsNull()
                : topicRepository.findByCloudProviderIsNullOrCloudProvider_Id(cloudProviderId);
        return topics.stream()
                .sorted(Comparator.comparing(Topic::getOrderIndex))
                .toList();
    }
    private Topic findAvailableTopic(String slug, User user) {
        Topic topic = topicRepository.findBySlug(slug)
                .orElseThrow(() -> new NoSuchElementException("Topic not found"));
        if (topic.getCloudProvider() != null
                && !topic.getCloudProvider().getId().equals(selectedCloudId(user))) {
            throw new AccessDeniedException("Topic is not available for the selected cloud provider");
        }
        return topic;
    }
    private static Long selectedCloudId(User user) {
        return user.getSelectedCloud() != null ? user.getSelectedCloud().getId() : null;
    }
    private Map<Long, UserTopicProgress.Status> progressByTopicId(User user) {
        Map<Long, UserTopicProgress.Status> progressMap = new HashMap<>();
        for (UserTopicProgress progress : progressRepository.findByUser_Id(user.getId())) {
            progressMap.put(progress.getTopic().getId(), progress.getStatus());
        }
        return progressMap;
    }
    private static boolean allCompleted(List<Topic> topics, Map<Long, UserTopicProgress.Status> progressMap) {
        return topics.stream()
                .allMatch(topic -> progressMap.get(topic.getId()) == UserTopicProgress.Status.COMPLETED);
    }
    private String getTopicStatus(Topic topic, Map<Long, UserTopicProgress.Status> progressMap) {
        UserTopicProgress.Status progressStatus = progressMap.get(topic.getId());
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
    private RoadmapTopic buildRoadmapTopic(Topic topic, Map<Long, UserTopicProgress.Status> progressMap) {
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
    private boolean isUnlocked(Topic topic, Map<Long, UserTopicProgress.Status> progressMap) {
        Topic prerequisite = topic.getPrerequisiteTopic();
        if (prerequisite == null) {
            return true;
        }
        return progressMap.get(prerequisite.getId()) == UserTopicProgress.Status.COMPLETED;
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
