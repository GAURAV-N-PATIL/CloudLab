-- Minimal catalogue for the integration tests: two neutral topics, one topic per cloud,
-- a free project and a paid project that needs the second neutral topic.
INSERT INTO cloud_providers (id, name, slug, description, is_active) VALUES
(1, 'Amazon Web Services', 'aws', 'AWS track', TRUE),
(2, 'Microsoft Azure', 'azure', 'Azure track', TRUE);

INSERT INTO topic_categories (id, name, slug, order_index) VALUES
(1, 'Basics', 'basics', 1);

INSERT INTO topics (id, category_id, cloud_provider_id, name, slug, level, order_index, prerequisite_topic_id, description) VALUES
(1, 1, NULL, 'Linux Basics', 'linux-basics', 'BEGINNER', 1, NULL, 'Shell'),
(2, 1, NULL, 'Networking', 'networking', 'BEGINNER', 2, 1, 'IP and DNS'),
(3, 1, 1, 'AWS Core', 'aws-core', 'INTERMEDIATE', 3, 2, 'EC2 and S3'),
(4, 1, 2, 'Azure Core', 'azure-core', 'INTERMEDIATE', 3, 2, 'VMs and Storage');

INSERT INTO topic_resources (topic_id, type, title, url, order_index) VALUES
(2, 'ARTICLE', 'Networking primer', 'https://example.com/net', 1);

INSERT INTO projects (id, cloud_provider_id, title, slug, description, level, is_free, order_index) VALUES
(1, NULL, 'Hello Linux', 'hello-linux', 'First project', 'BEGINNER', TRUE, 1),
(2, NULL, 'Network Lab', 'network-lab', 'Second project', 'BEGINNER', FALSE, 2);

INSERT INTO project_required_topics (project_id, topic_id) VALUES
(2, 2);
