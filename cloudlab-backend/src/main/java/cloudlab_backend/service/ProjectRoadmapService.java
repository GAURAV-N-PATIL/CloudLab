package cloudlab_backend.service;
import cloudlab_backend.entity.Project;
import cloudlab_backend.entity.ProjectRequiredTopic;
import cloudlab_backend.entity.User;
import cloudlab_backend.entity.UserProjectProgress;
import cloudlab_backend.entity.UserTopicProgress;
import cloudlab_backend.repository.ProjectRepository;
import cloudlab_backend.repository.ProjectRequiredTopicRepository;
import cloudlab_backend.repository.ProjectResourceRepository;
import cloudlab_backend.repository.UserProjectProgressRepository;
import cloudlab_backend.repository.UserTopicProgressRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
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
        Long cloudProviderId = selectedCloudId(user);
        List<Project> projects = cloudProviderId == null
                ? projectRepository.findByCloudProviderIsNull()
                : projectRepository.findByCloudProviderIsNullOrCloudProvider_Id(cloudProviderId);
        Set<Long> completedTopicIds = getCompletedTopicIds(user);
        Map<Long, UserProjectProgress.Status> progressMap = getProjectProgressMap(user);
        // One query for every project's required topics, instead of one per project.
        Map<Long, List<ProjectRequiredTopic>> requiredByProject = projects.isEmpty()
                ? Map.of()
                : projectRequiredTopicRepository
                        .findByProject_IdIn(projects.stream().map(Project::getId).toList())
                        .stream()
                        .collect(Collectors.groupingBy(required -> required.getProject().getId()));
        return projects.stream()
                .sorted(Comparator.comparing(Project::getOrderIndex))
                .map(project -> {
                    List<ProjectRequiredTopic> required = requiredByProject.getOrDefault(project.getId(), List.of());
                    return new ProjectSummary(
                            project.getId(),
                            project.getTitle(),
                            project.getSlug(),
                            project.getLevel().name(),
                            project.getOrderIndex(),
                            project.getDescription(),
                            project.getFree(),
                            getProjectStatus(project, required, completedTopicIds, progressMap),
                            requiredSlugs(required)
                    );
                })
                .toList();
    }
    public ProjectDetail getProjectBySlug(String slug, User user) {
        Project project = findAvailableProject(slug, user);
        List<ProjectRequiredTopic> required = projectRequiredTopicRepository.findByProject_Id(project.getId());
        String status = getProjectStatus(project, required, getCompletedTopicIds(user), getProjectProgressMap(user));
        List<ProjectResourceResponse> resources = projectResourceRepository
                .findByProject_IdOrderByOrderIndexAsc(project.getId())
                .stream()
                .map(resource -> new ProjectResourceResponse(
                        resource.getId(),
                        resource.getType().name(),
                        resource.getTitle(),
                        resource.getUrl(),
                        resource.getOrderIndex()
                ))
                .toList();
        return new ProjectDetail(
                project.getId(),
                project.getTitle(),
                project.getSlug(),
                project.getLevel().name(),
                project.getOrderIndex(),
                project.getDescription(),
                project.getFree(),
                status,
                requiredSlugs(required),
                resources
        );
    }
    @Transactional
    public void submitProject(String slug, User user) {
        Project project = findAvailableProject(slug, user);
        List<ProjectRequiredTopic> required = projectRequiredTopicRepository.findByProject_Id(project.getId());
        if(!isProjectUnlocked(project, required, getCompletedTopicIds(user))) {
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
        if (progress.getStatus() == UserProjectProgress.Status.COMPLETED) {
            throw new IllegalStateException("Project is already completed");
        }
        progress.setStatus(UserProjectProgress.Status.SUBMITTED);
        progress.setSubmittedAt(LocalDateTime.now());
        userProjectProgressRepository.save(progress);
    }

    private Project findAvailableProject(String slug, User user) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new NoSuchElementException("Project not found"));
        if (project.getCloudProvider() != null
                && !project.getCloudProvider().getId().equals(selectedCloudId(user))) {
            throw new AccessDeniedException("Project is not available for the selected cloud provider");
        }
        return project;
    }
    private static Long selectedCloudId(User user) {
        return user.getSelectedCloud() != null ? user.getSelectedCloud().getId() : null;
    }
    private static List<String> requiredSlugs(List<ProjectRequiredTopic> required) {
        return required.stream().map(r -> r.getTopic().getSlug()).sorted().toList();
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
    private static boolean isProjectUnlocked(
            Project project,
            List<ProjectRequiredTopic> required,
            Set<Long> completedTopicIds
    ) {
        if (Boolean.TRUE.equals(project.getFree())) {
            return true;
        }
        return required.stream()
                .allMatch(requiredTopic -> completedTopicIds.contains(requiredTopic.getTopic().getId()));
    }
    private static String getProjectStatus(
            Project project,
            List<ProjectRequiredTopic> required,
            Set<Long> completedTopicIds,
            Map<Long, UserProjectProgress.Status> progressMap
    ){
        UserProjectProgress.Status progressStatus = progressMap.get(project.getId());
        if (progressStatus != null) {
            return progressStatus.name();
        }
        return isProjectUnlocked(project, required, completedTopicIds) ? "UNLOCKED" : "LOCKED";
    }
    public record ProjectSummary(
            Long id,
            String title,
            String slug,
            String level,
            Integer orderIndex,
            String description,
            Boolean free,
            String status,
            List<String> requiredTopicSlugs
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
