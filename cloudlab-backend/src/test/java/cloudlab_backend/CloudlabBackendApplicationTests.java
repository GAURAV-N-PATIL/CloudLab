package cloudlab_backend;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
@SpringBootTest
@TestPropertySource(properties={"jwt.secret=test-only-secret-key-not-used-in-production-32-bytes-min","jwt.expiration=86400000"})
class CloudlabBackendApplicationTests {
	@Test
	void contextLoads() {
	}
}
