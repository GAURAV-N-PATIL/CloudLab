-- CloudLab
-- Database: MySQL 8.0+
-- Backend: Spring Boot + Spring Data JPA
-- 12 tables
CREATE DATABASE IF NOT EXISTS cloudlab
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE cloudlab;

-- 1.Cloud provider
CREATE TABLE cloud_providers (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) NOT NULL,
    description     TEXT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_cloud_providers_name (name),
    UNIQUE KEY uk_cloud_providers_slug (slug)
) ENGINE=InnoDB;

-- 2.Users
CREATE TABLE users(
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name                VARCHAR(100) NOT NULL,
    email               VARCHAR(255) NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    role                ENUM(
                            'USER',
                            'ADMIN'
                        ) NOT NULL DEFAULT 'USER',
    email_verified      BOOLEAN NOT NULL DEFAULT FALSE,
    selected_cloud_id   BIGINT UNSIGNED NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_selected_cloud (selected_cloud_id),
    CONSTRAINT fk_users_selected_cloud
        FOREIGN KEY (selected_cloud_id)
        REFERENCES cloud_providers (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 3.Topic Category
CREATE TABLE topic_categories (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) NOT NULL,
    order_index     INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uk_topic_categories_name (name),
    UNIQUE KEY uk_topic_categories_slug (slug),
    INDEX idx_topic_categories_order (order_index)
) ENGINE=InnoDB;

-- 4.Topics
CREATE TABLE topics(
    id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id           BIGINT UNSIGNED NOT NULL,
    /* NULL  = provider-neutral ,AWS   = AWS-specific, AZURE = Azure-specific */
    cloud_provider_id     BIGINT UNSIGNED NULL,
    name                  VARCHAR(150) NOT NULL,
    slug                  VARCHAR(150) NOT NULL,
    level                 ENUM(
                              'BEGINNER',
                              'INTERMEDIATE',
                              'ADVANCED'
                          ) NOT NULL,
    order_index           INT NOT NULL,
    prerequisite_topic_id BIGINT UNSIGNED NULL,
    description           TEXT NULL,
    created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                          ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_topics_slug (slug),
    INDEX idx_topics_category (category_id),
    INDEX idx_topics_cloud_provider (cloud_provider_id),
    INDEX idx_topics_level (level),
    INDEX idx_topics_order (order_index),
    INDEX idx_topics_prerequisite (prerequisite_topic_id),
    CONSTRAINT fk_topics_category
        FOREIGN KEY (category_id)
        REFERENCES topic_categories (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_topics_cloud_provider
        FOREIGN KEY (cloud_provider_id)
        REFERENCES cloud_providers (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_topics_prerequisite
        FOREIGN KEY (prerequisite_topic_id)
        REFERENCES topics (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5.Topics  Resources
CREATE TABLE topic_resources(
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    topic_id        BIGINT UNSIGNED NOT NULL,
    type            ENUM(
                        'YOUTUBE_VIDEO',
                        'YOUTUBE_PLAYLIST',
                        'PDF',
                        'ARTICLE'
                    ) NOT NULL,
    title           VARCHAR(255) NOT NULL,
    url             VARCHAR(2048) NOT NULL,
    order_index     INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_topic_resources_topic (topic_id),
    INDEX idx_topic_resources_order (
        topic_id,
        order_index
    ),
    CONSTRAINT fk_topic_resources_topic
        FOREIGN KEY (topic_id)
        REFERENCES topics (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6.User Topcis progress
CREATE TABLE user_topic_progress (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id         BIGINT UNSIGNED NOT NULL,
    topic_id        BIGINT UNSIGNED NOT NULL,
    status          ENUM(
                        'IN_PROGRESS',
                        'COMPLETED'
                    ) NOT NULL DEFAULT 'IN_PROGRESS',
    started_at      TIMESTAMP NULL,
    completed_at    TIMESTAMP NULL,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_topic_progress (
        user_id,
        topic_id
    ),
    INDEX idx_user_topic_progress_user (user_id),
    INDEX idx_user_topic_progress_topic (topic_id),
    INDEX idx_user_topic_progress_status (
        user_id,
        status
    ),
    CONSTRAINT fk_user_topic_progress_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_user_topic_progress_topic
        FOREIGN KEY (topic_id)
        REFERENCES topics (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 7.Project
CREATE TABLE projects (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    /*NULL = provider-neutral project, AWS  = AWS-specific project, AZURE = Azure-specific project */
    cloud_provider_id   BIGINT UNSIGNED NULL,
    title               VARCHAR(200) NOT NULL,
    slug                VARCHAR(200) NOT NULL,
    description         TEXT NOT NULL,
    level               ENUM(
                            'BEGINNER',
                            'INTERMEDIATE',
                            'ADVANCED'
                        ) NOT NULL,
    is_free             BOOLEAN NOT NULL DEFAULT FALSE,
    order_index         INT NOT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_projects_slug (slug),
    INDEX idx_projects_cloud_provider (cloud_provider_id),
    INDEX idx_projects_level (level),
    INDEX idx_projects_free (is_free),
    INDEX idx_projects_order (order_index),
    CONSTRAINT fk_projects_cloud_provider
        FOREIGN KEY (cloud_provider_id)
        REFERENCES cloud_providers (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 8.Project Resources
CREATE TABLE project_resources(
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id      BIGINT UNSIGNED NOT NULL,
    type            ENUM(
                        'YOUTUBE_VIDEO',
                        'YOUTUBE_PLAYLIST',
                        'PDF',
                        'REPO',
                        'ARTICLE'
                    ) NOT NULL,
    title           VARCHAR(255) NOT NULL,
    url             VARCHAR(2048) NOT NULL,
    order_index     INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_project_resources_project (project_id),
    INDEX idx_project_resources_order (
        project_id,
        order_index
    ),
    CONSTRAINT fk_project_resources_project
        FOREIGN KEY (project_id)
        REFERENCES projects (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 9.Project topics required
CREATE TABLE project_required_topics(
    project_id      BIGINT UNSIGNED NOT NULL,
    topic_id        BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (
        project_id,
        topic_id
    ),
    INDEX idx_project_required_topics_topic (topic_id),
    CONSTRAINT fk_project_required_topics_project
        FOREIGN KEY (project_id)
        REFERENCES projects (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_project_required_topics_topic
        FOREIGN KEY (topic_id)
        REFERENCES topics (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 10.User project progress
CREATE TABLE user_project_progress (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id         BIGINT UNSIGNED NOT NULL,
    project_id      BIGINT UNSIGNED NOT NULL,
    status          ENUM(
                        'IN_PROGRESS',
                        'SUBMITTED',
                        'COMPLETED'
                    ) NOT NULL DEFAULT 'IN_PROGRESS',
    started_at      TIMESTAMP NULL,
    submitted_at    TIMESTAMP NULL,
    completed_at    TIMESTAMP NULL,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_project_progress (
        user_id,
        project_id
    ),
    INDEX idx_user_project_progress_user (user_id),
    INDEX idx_user_project_progress_project (project_id),
    INDEX idx_user_project_progress_status (
        user_id,
        status
    ),
    CONSTRAINT fk_user_project_progress_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_user_project_progress_project
        FOREIGN KEY (project_id)
        REFERENCES projects (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 11.Subscription
CREATE TABLE subscriptions (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id         BIGINT UNSIGNED NOT NULL,
    plan            ENUM(
                        'MONTHLY',
                        'YEARLY',
                        'LIFETIME'
                    ) NOT NULL,
    status          ENUM(
                        'PENDING',
                        'ACTIVE',
                        'EXPIRED',
                        'CANCELLED'
                    ) NOT NULL DEFAULT 'PENDING',
    started_at      TIMESTAMP NULL,
    expires_at      TIMESTAMP NULL,
    payment_ref     VARCHAR(255) NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_subscriptions_user (user_id),
    INDEX idx_subscriptions_status (
        user_id,
        status
    ),
    INDEX idx_subscriptions_payment_ref (
        payment_ref
    ),
    CONSTRAINT fk_subscriptions_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_subscriptions_dates
        CHECK (
            expires_at IS NULL
            OR started_at IS NULL
            OR expires_at > started_at
        )
) ENGINE=InnoDB;

-- 12. Certificates
CREATE TABLE certificates (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id             BIGINT UNSIGNED NOT NULL,
    certificate_code    VARCHAR(100) NOT NULL,
    issued_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pdf_url             VARCHAR(2048) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_certificates_code (
        certificate_code
    ),
    INDEX idx_certificates_user (user_id),
    CONSTRAINT fk_certificates_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;
