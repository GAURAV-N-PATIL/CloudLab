package cloudlab_backend.service;
import cloudlab_backend.entity.Project;
import cloudlab_backend.entity.ProjectRequiredTopic;
import cloudlab_backend.entity.ProjectResource;
import cloudlab_backend.entity.User;
import cloudlab_backend.entity.UserProjectProgress;
import cloudlab_backend.entity.UserTopicProgress;
import cloudlab_backend.repository.ProjectRepository;
import cloudlab_backend.repository.ProjectRequiredTopicRepository;
import cloudlab_backend.repository.ProjectResourceRepository;
import cloudlab_backend.repository.UserProjectProgressRepository;
import cloudlab_backend.repository.UserTopicProgressRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;

@Service
public class ProjectRoadmapService{
    private final ProjectRepository projectRepository;
    private final ProjectRequiredTopicRepository projectRequiredTopicRepository;
    private final ProjectResourceRepository projectResourceRepository;
    private final UserProjectProgressRepository userProjectProgressRepository;
    private final UserTopicProgressRepository userTopicProgressRepository;
    public ProjectRoadmapService(
            ProjectRepository projectRepository,
            ProjectRequiredTopicRepository projectRequiredTopicRepository,
            ProjectResourceRepository projectResourceRepository,
            UserProjectProgressRepository userProjectProgressRepository,
            UserTopicProgressRepository userTopicProgressRepository
    ){
        this.projectRepository = projectRepository;
        this.projectRequiredTopicRepository = projectRequiredTopicRepository;
        this.projectResourceRepository=projectResourceRepository;
        this.userProjectProgressRepository = userProjectProgressRepository;
        this.userTopicProgressRepository= userTopicProgressRepository;
    }
    public List<ProjectSummary> getProjects(User user){
        Long cloudProviderId=user.getSelectedCloud()!=null ? user.getSelectedCloud().getId() : null;
        List<Project> projects = cloudProviderId == null
                ? projectRepository.findByCloudProviderIsNull()
                : projectRepository.findByCloudProviderIsNullOrCloudProvider_Id(cloudProviderId);
        Set<Long> completedTopicIds = getCompletedTopicIds(user);
        Map<Long, UserProjectProgress.Status> progressMap =getProjectProgressMap(user);
        return projects.stream()
                .sorted((a, b)-> Integer.compare(a.getOrderIndex(), b.getOrderIndex()))
                .map(project -> buildProjectSummary(project, completedTopicIds, progressMap))
                .toList();
    }
    public ProjectDetail getProjectBySlug(String slug, User user) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new NoSuchElementException("Project not found"));
        assertAvailableForUser(project, user);
        Set<Long> completedTopicIds = getCompletedTopicIds(user);
        Map<Long, UserProjectProgress.Status> progressMap = getProjectProgressMap(user);
        String status = getProjectStatus(project,completedTopicIds,progressMap);
        List<ProjectResource> resources=projectResourceRepository.findByProject_IdOrderByOrderIndexAsc(project.getId());
        List<ProjectResourceResponse> resourceResponses = resources.stream()
                .map(resource -> new ProjectResourceResponse(
                        resource.getId(),
                        resource.getType().name(),
                        resource.getTitle(),
                        resource.getUrl(),
                        resource.getOrderIndex()
                ))
                .toList();
        List<String> requiredTopicSlugs=projectRequiredTopicRepository.findByProject_Id(project.getId()).stream().map(required ->required.getTopic().getSlug()).toList();
        return new ProjectDetail(
                project.getId(),
                project.getTitle(),
                project.getSlug(),
                project.getLevel().name(),
                project.getOrderIndex(),
                project.getDescription(),
                project.getFree(),
                status,
                requiredTopicSlugs,
                resourceResponses
        );
    }
    public void submitProject(String slug, User user) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new NoSuchElementException("Project not found"));
        assertAvailableForUser(project, user);

        Set<Long> completedTopicIds = getCompletedTopicIds(user);

        if(!isProjectUnlocked(project, completedTopicIds)) {
            throw new IllegalStateException("Project is locked");
        }
        UserProjectProgress progress = userProjectProgressRepository
                .findByUser_IdAndProject_Id(user.getId(), project.getId())
                .orElseGet(() -> {
                    UserProjectProgress newProgress = new UserProjectProgress();
                    newProgress.setUser(user);
                    newProgress.setProject(project);
                    newProgress.setStartedAt(LocalDateTime.now());
                    return newProgress;
                });

        progress.setStatus(UserProjectProgress.Status.SUBMITTED);
        progress.setSubmittedAt(LocalDateTime.now());
        userProjectProgressRepository.save(progress);
    }

    private void assertAvailableForUser(Project project, User user) {
        Long cloudProviderId = user.getSelectedCloud() != null
                ? user.getSelectedCloud().getId()
                : null;
        if (project.getCloudProvider() != null
                && !project.getCloudProvider().getId().equals(cloudProviderId)) {
            throw new IllegalArgumentException(
                    "Project is not available for the selected cloud provider"
            );
        }
    }
    private Set<Long> getCompletedTopicIds(User user){
        Set<Long> completed = new HashSet<>();
        for (UserTopicProgress progress : userTopicProgressRepository.findByUser_Id(user.getId())) {
            if(progress.getStatus() == UserTopicProgress.Status.COMPLETED) {
                completed.add(progress.getTopic().getId());
            }
        }
        return completed;
    }
    private Map<Long, UserProjectProgress.Status> getProjectProgressMap(User user) {
        Map<Long, UserProjectProgress.Status> map = new HashMap<>();
        for (UserProjectProgress progress : userProjectProgressRepository.findByUser_Id(user.getId())) {
            map.put(progress.getProject().getId(), progress.getStatus());
        }
        return map;
    }
    private boolean isProjectUnlocked(Project project, Set<Long> completedTopicIds) {
        if (Boolean.TRUE.equals(project.getFree())) {
            return true;}
        List<ProjectRequiredTopic> required =
                projectRequiredTopicRepository.findByProject_Id(project.getId());
        if (required.isEmpty()){
            return true;
        }
        for (ProjectRequiredTopic requiredTopic : required) {
            if(!completedTopicIds.contains(requiredTopic.getTopic().getId())) {
                return false;
            }
        }
        return true;
    }
    private String getProjectStatus(
            Project project,
            Set<Long> completedTopicIds,
            Map<Long, UserProjectProgress.Status> progressMap
    ){
        UserProjectProgress.Status progressStatus = progressMap.get(project.getId());
        if (progressStatus == UserProjectProgress.Status.COMPLETED) {
            return "COMPLETED";
        }
        if (progressStatus == UserProjectProgress.Status.SUBMITTED) {
            return "SUBMITTED";
        }
        if (progressStatus == UserProjectProgress.Status.IN_PROGRESS) {
            return "IN_PROGRESS";
        }
        if (isProjectUnlocked(project, completedTopicIds)) {
            return "UNLOCKED";
        }
        return "LOCKED";
    }
    private ProjectSummary buildProjectSummary(
            Project project,
            Set<Long> completedTopicIds,
            Map<Long, UserProjectProgress.Status> progressMap
    ){
        return new ProjectSummary(
                project.getId(),
                project.getTitle(),
                project.getSlug(),
                project.getLevel().name(),
                project.getOrderIndex(),
                project.getFree(),
                getProjectStatus(project, completedTopicIds, progressMap)
        );
    }
    public record ProjectSummary(
            Long id,
            String title,
            String slug,
            String level,
            Integer orderIndex,
            Boolean free,
            String status
    ){
    }
    public record ProjectDetail(
            Long id,
            String title,
            String slug,
            String level,
            Integer orderIndex,
            String description,
            Boolean free,
            String status,
            List<String> requiredTopicSlugs,
            List<ProjectResourceResponse> resources
    ) {
    }
    public record ProjectResourceResponse(
            Long id,
            String type,
            String title,
            String url,
            Integer orderIndex
    ) {
    }
}
