package cloudlab_backend;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import java.util.UUID;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// End-to-end through the real security filter chain, controllers, services and JPA.
// Deliberately not @Transactional: a test transaction would keep a Hibernate session open
// and hide lazy-loading bugs that real requests hit.
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApiIntegrationTest {
    private static final long AWS = 1L;

    @Autowired
    private MockMvc mvc;
    private String email;
    private String token;

    @BeforeEach
    void signUp() throws Exception {
        email = "learner-" + UUID.randomUUID() + "@example.com";
        String body = mvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("name", "Learner", "email", email, "password", "password123")))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        token = JsonPath.read(body, "$.token");
    }

    private MockHttpServletRequestBuilder authed(MockHttpServletRequestBuilder request) {
        return request.header("Authorization", "Bearer " + token);
    }

    private static String json(String... pairs) {
        StringBuilder sb = new StringBuilder("{");
        for (int i = 0; i < pairs.length; i += 2) {
            if (i > 0) sb.append(',');
            sb.append('"').append(pairs[i]).append("\":\"").append(pairs[i + 1]).append('"');
        }
        return sb.append('}').toString();
    }

    private void complete(String slug) throws Exception {
        mvc.perform(authed(post("/api/roadmap/" + slug + "/complete"))).andExpect(status().isNoContent());
    }

    private void selectCloud(long id) throws Exception {
        mvc.perform(authed(post("/api/users/select-cloud"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"cloudProviderId\":" + id + "}"))
                .andExpect(status().isOk());
    }

    @Test
    void protectedEndpointsReturn401WithoutAToken() throws Exception {
        mvc.perform(get("/api/roadmap")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/roadmap").header("Authorization", "Bearer not-a-jwt"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void wrongPasswordReturns401WithAMessage() throws Exception {
        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("email", email, "password", "wrong-password")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void loginIgnoresEmailCaseAndSurroundingSpaces() throws Exception {
        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("email", "  " + email.toUpperCase() + " ", "password", "password123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void duplicateSignupReturns409WithAMessage() throws Exception {
        mvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("name", "Again", "email", email, "password", "password123")))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void invalidSignupReturns400WithAMessage() throws Exception {
        mvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("name", "X", "email", "not-an-email", "password", "short")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void topicDetailIncludesThePrerequisiteSlug() throws Exception {
        mvc.perform(authed(get("/api/roadmap/networking")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.prerequisiteSlug").value("linux-basics"))
                .andExpect(jsonPath("$.status").value("LOCKED"))
                .andExpect(jsonPath("$.resources[0].title").value("Networking primer"));
    }

    @Test
    void unknownTopicReturns404() throws Exception {
        mvc.perform(authed(get("/api/roadmap/no-such-topic")))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Topic not found"));
    }

    @Test
    void completingALockedTopicReturns409() throws Exception {
        mvc.perform(authed(post("/api/roadmap/networking/complete")))
                .andExpect(status().isConflict());
    }

    @Test
    void projectListAndDetailIncludeRequiredTopics() throws Exception {
        mvc.perform(authed(get("/api/projects")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[1].slug").value("network-lab"))
                .andExpect(jsonPath("$[1].status").value("LOCKED"))
                .andExpect(jsonPath("$[1].description").value("Second project"))
                .andExpect(jsonPath("$[1].requiredTopicSlugs", contains("networking")));
        mvc.perform(authed(get("/api/projects/network-lab")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.requiredTopicSlugs", contains("networking")));
    }

    @Test
    void cloudCannotBeChosenBeforeTheNeutralPathIsFinished() throws Exception {
        mvc.perform(authed(post("/api/users/select-cloud"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"cloudProviderId\":" + AWS + "}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void fullTrackChoosesACloudOnceAndEarnsACertificate() throws Exception {
        complete("linux-basics");
        complete("networking");
        selectCloud(AWS);

        mvc.perform(authed(get("/api/users/me")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.selectedCloudSlug").value("aws"));
        mvc.perform(authed(get("/api/roadmap")))
                .andExpect(jsonPath("$[*].slug", hasItem("aws-core")))
                .andExpect(jsonPath("$[*].slug", not(hasItem("azure-core"))));
        mvc.perform(authed(get("/api/roadmap/azure-core"))).andExpect(status().isForbidden());

        // The choice is permanent.
        mvc.perform(authed(post("/api/users/select-cloud"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"cloudProviderId\":2}"))
                .andExpect(status().isConflict());

        mvc.perform(authed(get("/api/certificates"))).andExpect(jsonPath("$.length()").value(0));
        complete("aws-core");
        mvc.perform(authed(get("/api/certificates")))
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].certificateCode").isNotEmpty());

        // Completing again is idempotent and never issues a second certificate.
        complete("aws-core");
        mvc.perform(authed(get("/api/certificates"))).andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void unlockedProjectCanBeSubmitted() throws Exception {
        complete("linux-basics");
        complete("networking");
        mvc.perform(authed(post("/api/projects/network-lab/submit"))).andExpect(status().isNoContent());
        mvc.perform(authed(get("/api/projects/network-lab")))
                .andExpect(jsonPath("$.status").value("SUBMITTED"));
    }

    @Test
    void noActiveSubscriptionReturns204() throws Exception {
        mvc.perform(authed(get("/api/subscriptions/active"))).andExpect(status().isNoContent());
    }
}
