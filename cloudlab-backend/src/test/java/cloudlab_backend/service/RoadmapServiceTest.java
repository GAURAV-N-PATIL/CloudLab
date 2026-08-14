package cloudlab_backend.service;
import cloudlab_backend.entity.Topic;
import cloudlab_backend.entity.User;
import cloudlab_backend.entity.UserTopicProgress;
import cloudlab_backend.repository.TopicRepository;
import cloudlab_backend.repository.TopicResourceRepository;
import cloudlab_backend.repository.UserTopicProgressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoadmapServiceTest {
    @Mock
    private TopicRepository topicRepository;
    @Mock
    private TopicResourceRepository topicResourceRepository;
    @Mock
    private UserTopicProgressRepository progressRepository;
    private RoadmapService roadmapService;
    private User user;
    @BeforeEach
    void setUp(){
        roadmapService=new RoadmapService(topicRepository,topicResourceRepository, progressRepository);
        user = new User();
        ReflectionTestUtils.setField(user,"id", 1L);
    }
    private Topic topic(long id, String slug, Integer orderIndex, Topic prerequisite) {
        Topic topic = new Topic();
        ReflectionTestUtils.setField(topic, "id", id);
        topic.setSlug(slug);
        topic.setOrderIndex(orderIndex);
        topic.setLevel(Topic.Level.BEGINNER);
        topic.setPrerequisiteTopic(prerequisite);
        topic.setDescription("desc");
        topic.setName(slug);
        return topic;
    }

    @Test
    void topicWithNoPrerequisiteIsUnlockedByDefault(){
        Topic linuxBasics=topic(1L, "linux-basics",1,null);
        when(topicRepository.findByCloudProviderIsNull())
                .thenReturn(List.of(linuxBasics));
        when(progressRepository.findByUser_Id(1L))
                .thenReturn(Collections.emptyList());
        List<RoadmapService.RoadmapTopic> roadmap =roadmapService.getRoadmap(user);
        assertEquals("UNLOCKED", roadmap.get(0).status());
    }
    @Test
    void topicWithIncompletePrerequisiteIsLocked() {
        Topic linuxBasics = topic(1L, "linux-basics", 1, null);
        Topic networking = topic(2L, "networking", 2, linuxBasics);
   when(topicRepository.findByCloudProviderIsNull())
                .thenReturn(List.of(linuxBasics, networking));
        when(progressRepository.findByUser_Id(1L))
                .thenReturn(Collections.emptyList());
        List<RoadmapService.RoadmapTopic> roadmap =roadmapService.getRoadmap(user);
        RoadmapService.RoadmapTopic networkingStatus=roadmap.stream()
                .filter(t -> t.slug().equals("networking"))
                .findFirst()
                .orElseThrow();
        assertEquals("LOCKED", networkingStatus.status());
    }
    @Test
    void topicUnlocksOnceItsPrerequisiteIsCompleted() {
        Topic linuxBasics = topic(1L, "linux-basics", 1, null);
        Topic networking = topic(2L,"networking",2,linuxBasics);
        UserTopicProgress completedProgress = new UserTopicProgress();
        completedProgress.setTopic(linuxBasics);
        completedProgress.setStatus(UserTopicProgress.Status.COMPLETED);

        when(topicRepository.findByCloudProviderIsNull())
                .thenReturn(List.of(linuxBasics, networking));
        when(progressRepository.findByUser_Id(1L))
                .thenReturn(List.of(completedProgress));
        List<RoadmapService.RoadmapTopic> roadmap = roadmapService.getRoadmap(user);
        RoadmapService.RoadmapTopic networkingStatus = roadmap.stream()
                .filter(t -> t.slug().equals("networking"))
                .findFirst()
                .orElseThrow();
        assertEquals("UNLOCKED", networkingStatus.status());
    }
    @Test
    void completingALockedTopicThrows() {
        Topic linuxBasics = topic(1L, "linux-basics", 1, null);
        Topic networking = topic(2L, "networking", 2, linuxBasics);

        when(topicRepository.findBySlug("networking"))
                .thenReturn(Optional.of(networking));
        when(progressRepository.findByUser_Id(1L))
                .thenReturn(Collections.emptyList());

        assertThrows(
                IllegalStateException.class,
                () -> roadmapService.completeTopic("networking", user)
        );
    }

    @Test
    void completingAnUnlockedTopicSavesCompletedProgress() {
        Topic linuxBasics = topic(1L, "linux-basics", 1, null);
        when(topicRepository.findBySlug("linux-basics"))
                .thenReturn(Optional.of(linuxBasics));
        when(progressRepository.findByUser_Id(1L))
                .thenReturn(Collections.emptyList());
        when(progressRepository.findByUser_IdAndTopic_Id(1L, 1L))
                .thenReturn(Optional.empty());
        roadmapService.completeTopic("linux-basics",user);
        verify(progressRepository).save(argThat(progress -> progress.getStatus()==UserTopicProgress.Status.COMPLETED
        ));
    }
}

