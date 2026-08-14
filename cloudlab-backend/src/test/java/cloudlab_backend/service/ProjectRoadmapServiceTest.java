package cloudlab_backend.service;
import cloudlab_backend.entity.Project;
import cloudlab_backend.entity.ProjectRequiredTopic;
import cloudlab_backend.entity.Topic;
import cloudlab_backend.entity.User;
import cloudlab_backend.entity.UserProjectProgress;
import cloudlab_backend.entity.UserTopicProgress;
import cloudlab_backend.repository.ProjectRepository;
import cloudlab_backend.repository.ProjectRequiredTopicRepository;
import cloudlab_backend.repository.ProjectResourceRepository;
import cloudlab_backend.repository.UserProjectProgressRepository;
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
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
@ExtendWith(MockitoExtension.class)
class ProjectRoadmapServiceTest{
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private ProjectRequiredTopicRepository projectRequiredTopicRepository;
    @Mock
    private ProjectResourceRepository projectResourceRepository;
    @Mock
    private UserProjectProgressRepository userProjectProgressRepository;
    @Mock
    private UserTopicProgressRepository userTopicProgressRepository;
    private ProjectRoadmapService projectRoadmapService;
    private User user;

    @BeforeEach
    void setUp(){
        projectRoadmapService=new ProjectRoadmapService(projectRepository, projectRequiredTopicRepository,projectResourceRepository, userProjectProgressRepository,userTopicProgressRepository);
        user =new User();
        ReflectionTestUtils.setField(user,"id", 1L);
        lenient().when(userProjectProgressRepository.findByUser_Id(1L))
                .thenReturn(Collections.emptyList());
    }
    private Project project(long id, String slug,boolean free) {
        Project project=new Project();
        ReflectionTestUtils.setField(project,"id", id);
        project.setSlug(slug);
        project.setTitle(slug);
        project.setDescription("desc");
        project.setLevel(Project.Level.BEGINNER);
        project.setOrderIndex(1);
        project.setFree(free);
        return project;
    }
    private Topic topic(long id, String slug){
        Topic topic = new Topic();
        ReflectionTestUtils.setField(topic, "id", id);
        topic.setSlug(slug);
        return topic;
    }

    @Test
    void freeProjectIsAlwaysUnlockedRegardlessOfRequiredTopics() {
        Project freeProject = project(1L,"hello-linux",true);
        when(projectRepository.findByCloudProviderIsNull())
                .thenReturn(List.of(freeProject));
        when(userTopicProgressRepository.findByUser_Id(1L))
                .thenReturn(Collections.emptyList());

        List<ProjectRoadmapService.ProjectSummary> projects =projectRoadmapService.getProjects(user);
        assertEquals("UNLOCKED", projects.get(0).status());
    }
    @Test
    void paidProjectIsLockedUntilAllRequiredTopicsAreCompleted() {
        Project paidProject = project(2L, "provision-a-vm",false);
        Topic networking = topic(10L, "networking");
        when(projectRepository.findByCloudProviderIsNull())
                .thenReturn(List.of(paidProject));
        when(userTopicProgressRepository.findByUser_Id(1L))
                .thenReturn(Collections.emptyList());
        when(projectRequiredTopicRepository.findByProject_Id(2L))
                .thenReturn(List.of(
                        new ProjectRequiredTopic(paidProject, networking)
                ));
        List<ProjectRoadmapService.ProjectSummary> projects =
                projectRoadmapService.getProjects(user);
        assertEquals("LOCKED", projects.get(0).status());
    }
    @Test
    void paidProjectUnlocksOnceAllRequiredTopicsAreCompleted() {
        Project paidProject = project(2L, "provision-a-vm", false);
        Topic networking = topic(10L, "networking");
        UserTopicProgress completed = new UserTopicProgress();
        completed.setTopic(networking);
        completed.setStatus(UserTopicProgress.Status.COMPLETED);
        when(projectRepository.findByCloudProviderIsNull())
                .thenReturn(List.of(paidProject));
        when(userTopicProgressRepository.findByUser_Id(1L))
                .thenReturn(List.of(completed));
        when(projectRequiredTopicRepository.findByProject_Id(2L))
                .thenReturn(List.of(
                        new ProjectRequiredTopic(paidProject, networking)
                ));
        List<ProjectRoadmapService.ProjectSummary> projects =
                projectRoadmapService.getProjects(user);
        assertEquals("UNLOCKED", projects.get(0).status());
    }

    @Test
    void submittingALockedProjectThrows() {
        Project paidProject = project(2L,"provision-a-vm",false);
        Topic networking = topic(10L, "networking");
        when(projectRepository.findBySlug("provision-a-vm"))
                .thenReturn(Optional.of(paidProject));
        when(userTopicProgressRepository.findByUser_Id(1L))
                .thenReturn(Collections.emptyList());
        when(projectRequiredTopicRepository.findByProject_Id(2L))
                .thenReturn(List.of(
                        new ProjectRequiredTopic(paidProject, networking)
                ));
        assertThrows(
                IllegalStateException.class,
                () -> projectRoadmapService.submitProject("provision-a-vm", user)
        );
    }
    @Test
    void submittingAnUnlockedFreeProjectSavesSubmittedProgress() {
        Project freeProject = project(1L, "hello-linux", true);
        when(projectRepository.findBySlug("hello-linux"))
                .thenReturn(Optional.of(freeProject));
        when(userProjectProgressRepository.findByUser_IdAndProject_Id(1L, 1L))
                .thenReturn(Optional.empty());
        projectRoadmapService.submitProject("hello-linux", user);
        verify(userProjectProgressRepository).save(argThat(progress ->
                progress.getStatus() == UserProjectProgress.Status.SUBMITTED
        ));
    }
}

