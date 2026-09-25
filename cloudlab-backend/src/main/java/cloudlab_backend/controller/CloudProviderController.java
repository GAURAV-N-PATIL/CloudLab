package cloudlab_backend.controller;

import cloudlab_backend.entity.CloudProvider;
import cloudlab_backend.service.CloudProviderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cloud-providers")
public class CloudProviderController{
    private final CloudProviderService cloudProviderService;
    public CloudProviderController(CloudProviderService cloudProviderService) {
        this.cloudProviderService =cloudProviderService;
    }

    @GetMapping
    public ResponseEntity<List<CloudProviderSummary>> getCloudProviders() {
        List<CloudProviderSummary> providers= cloudProviderService.getAllCloudProviders()
                .stream()
                .filter(cp -> Boolean.TRUE.equals(cp.getActive()))
                .map(CloudProviderSummary::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(providers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CloudProviderSummary> getCloudProvider(@PathVariable Long id) {
        return cloudProviderService.getCloudProviderById(id)
                .map(CloudProviderSummary::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
    public static class CloudProviderSummary{
        private Long id;
        private String name;
        private String slug;
        private String description;
        public static CloudProviderSummary from(CloudProvider cp) {
            CloudProviderSummary dto = new CloudProviderSummary();
            dto.id = cp.getId();
            dto.name = cp.getName();
            dto.slug = cp.getSlug();
            dto.description = cp.getDescription();
            return dto;
        }
        public Long getId() {
            return id;
	}
        public String getName() {
            return name;
        }
        public String getSlug() {
            return slug;
        }
        public String getDescription() {
            return description;
        }
    }
}
