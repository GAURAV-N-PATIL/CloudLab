-- CloudLab — Seed Data (FIXED)
-- Database: MySQL 8.0+

USE cloudlab;

-- 1. Cloud providers
INSERT INTO cloud_providers (name, slug, description, is_active)
VALUES
('Amazon Web Services', 'aws',
 'Amazon Web Services cloud learning path covering AWS infrastructure, networking, security, DevOps, and cloud-native services.',
 TRUE),
('Microsoft Azure', 'azure',
 'Microsoft Azure cloud learning path covering Azure infrastructure, networking, identity, DevOps, monitoring, and cloud-native services.',
 TRUE);

-- 2. Topic categories
INSERT INTO topic_categories (name, slug, order_index)
VALUES
('Linux & OS', 'linux-os', 1),
('Networking', 'networking', 2),
('Git & Collaboration', 'git-collaboration', 3),
('Containers & CI/CD', 'containers-cicd', 4),
('Kubernetes', 'kubernetes', 5),
('Infrastructure as Code', 'infrastructure-as-code', 6),
('Cloud & DevOps', 'cloud-devops', 7);

INSERT INTO topics (
    category_id, cloud_provider_id, name, slug, level, order_index,
    prerequisite_topic_id, description
)
SELECT (SELECT id FROM topic_categories WHERE slug = 'linux-os'), NULL,
       'Linux Fundamentals', 'linux-fundamentals', 'BEGINNER', 1, NULL,
       'Introduction to Linux, the command line, shells, terminals, and basic server concepts.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'linux-os'), NULL,
       'Linux File System', 'linux-file-system', 'BEGINNER', 2, NULL,
       'Understand the Linux filesystem hierarchy, paths, directories, and file management.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'linux-os'), NULL,
       'Essential Linux Commands', 'essential-linux-commands', 'BEGINNER', 3, NULL,
       'Learn the essential Linux commands used for navigation, file manipulation, searching, and system administration.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'linux-os'), NULL,
       'Users & Permissions', 'linux-users-permissions', 'BEGINNER', 4, NULL,
       'Learn Linux users, groups, ownership, permissions, sudo, and access control.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'linux-os'), NULL,
       'Processes & Services', 'linux-processes-services', 'BEGINNER', 5, NULL,
       'Understand processes, system services, process management, and service lifecycle operations.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'linux-os'), NULL,
       'Package Management', 'linux-package-management', 'BEGINNER', 6, NULL,
       'Learn how to install, update, remove, and manage software packages on Linux.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'linux-os'), NULL,
       'Shell Scripting Basics', 'shell-scripting-basics', 'BEGINNER', 7, NULL,
       'Introduction to shell scripting, variables, conditions, loops, functions, and automation.'
-- NETWORKING
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'networking'), NULL,
       'Networking Fundamentals', 'networking-fundamentals', 'BEGINNER', 8, NULL,
       'Introduction to computer networking and the concepts required for DevOps and cloud infrastructure.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'networking'), NULL,
       'OSI & TCP/IP Models', 'osi-tcp-ip-models', 'BEGINNER', 9, NULL,
       'Understand the OSI and TCP/IP networking models and how protocols operate across network layers.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'networking'), NULL,
       'IP Addressing & Subnetting', 'ip-addressing-subnetting', 'BEGINNER', 10, NULL,
       'Learn IPv4 addressing, CIDR notation, subnetting, private networks, and address ranges.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'networking'), NULL,
       'DNS', 'dns', 'BEGINNER', 11, NULL,
       'Understand domain names, DNS records, resolution, zones, and common DNS troubleshooting techniques.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'networking'), NULL,
       'HTTP & HTTPS', 'http-https', 'BEGINNER', 12, NULL,
       'Learn HTTP methods, status codes, headers, TLS, HTTPS, and how web traffic works.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'networking'), NULL,
       'Ports & Protocols', 'ports-protocols', 'BEGINNER', 13, NULL,
       'Understand TCP, UDP, ports, common protocols, and service-to-service communication.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'networking'), NULL,
       'Firewalls & Security Groups', 'firewalls-security-groups', 'BEGINNER', 14, NULL,
       'Learn network traffic filtering, firewall rules, inbound and outbound traffic, and security-group concepts.'
-- GIT & COLLABORATION
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'git-collaboration'), NULL,
       'Git Fundamentals', 'git-fundamentals', 'BEGINNER', 15, NULL,
       'Learn Git repositories, commits, staging, history, and everyday version-control workflows.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'git-collaboration'), NULL,
       'Git Branching', 'git-branching', 'BEGINNER', 16, NULL,
       'Understand branches and branch-based development workflows.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'git-collaboration'), NULL,
       'Git Merge & Conflict Resolution', 'git-merge-conflicts', 'BEGINNER', 17, NULL,
       'Learn merging, resolving conflicts, rebasing concepts, and maintaining clean Git history.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'git-collaboration'), NULL,
       'GitHub', 'github', 'BEGINNER', 18, NULL,
       'Learn how GitHub hosts repositories and supports collaborative software development.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'git-collaboration'), NULL,
       'Pull Requests & Code Review', 'pull-requests-code-review', 'BEGINNER', 19, NULL,
       'Learn pull requests, reviews, approvals, discussions, and collaborative development workflows.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'git-collaboration'), NULL,
       'GitHub Actions Fundamentals', 'github-actions-fundamentals', 'BEGINNER', 20, NULL,
       'Introduction to GitHub Actions, workflows, jobs, steps, triggers, and basic automation.'
-- CONTAINERS & CI/CD
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'), NULL,
       'Docker Fundamentals', 'docker-fundamentals', 'BEGINNER', 21, NULL,
       'Introduction to containers, Docker architecture, images, containers, and the Docker CLI.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'), NULL,
       'Docker Images & Containers', 'docker-images-containers', 'BEGINNER', 22, NULL,
       'Understand container lifecycle, images, registries, tags, and container management.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'), NULL,
       'Dockerfile', 'dockerfile', 'BEGINNER', 23, NULL,
       'Learn how to build reproducible container images using Dockerfiles.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'), NULL,
       'Docker Compose', 'docker-compose', 'BEGINNER', 24, NULL,
       'Learn how to define and run multi-container applications using Docker Compose.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'), NULL,
       'Docker Networking & Volumes', 'docker-networking-volumes', 'INTERMEDIATE', 25, NULL,
       'Learn Docker networks, persistent volumes, bind mounts, and container data management.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'), NULL,
       'CI/CD Fundamentals', 'cicd-fundamentals', 'INTERMEDIATE', 26, NULL,
       'Understand continuous integration, continuous delivery, pipelines, automation, and deployment workflows.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'), NULL,
       'Jenkins Fundamentals', 'jenkins-fundamentals', 'INTERMEDIATE', 27, NULL,
       'Introduction to Jenkins, controllers, agents, jobs, credentials, and basic automation.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'), NULL,
       'Jenkins Pipelines', 'jenkins-pipelines', 'INTERMEDIATE', 28, NULL,
       'Learn Jenkins Pipeline concepts, stages, steps, agents, and pipeline-as-code.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'), NULL,
       'Jenkins + Docker', 'jenkins-docker', 'INTERMEDIATE', 29, NULL,
       'Integrate Jenkins pipelines with Docker image builds and container workflows.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'), NULL,
       'CI/CD Pipeline Architecture', 'cicd-pipeline-architecture', 'INTERMEDIATE', 30, NULL,
       'Design complete CI/CD pipelines covering source control, testing, builds, artifacts, containers, and deployment.'
-- KUBERNETES
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'kubernetes'), NULL,
       'Kubernetes Fundamentals', 'kubernetes-fundamentals', 'ADVANCED', 31, NULL,
       'Introduction to Kubernetes and container orchestration.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'kubernetes'), NULL,
       'Kubernetes Architecture', 'kubernetes-architecture', 'ADVANCED', 32, NULL,
       'Understand clusters, control plane components, worker nodes, and Kubernetes architecture.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'kubernetes'), NULL,
       'Pods', 'kubernetes-pods', 'ADVANCED', 33, NULL,
       'Learn Kubernetes Pods, containers, lifecycle, and pod configuration.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'kubernetes'), NULL,
       'Deployments', 'kubernetes-deployments', 'ADVANCED', 34, NULL,
       'Learn Deployments, ReplicaSets, rolling updates, rollbacks, and application scaling.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'kubernetes'), NULL,
       'Services', 'kubernetes-services', 'ADVANCED', 35, NULL,
       'Learn Kubernetes Services and how applications communicate with workloads.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'kubernetes'), NULL,
       'ConfigMaps & Secrets', 'kubernetes-configmaps-secrets', 'ADVANCED', 36, NULL,
       'Learn how Kubernetes manages application configuration and sensitive values.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'kubernetes'), NULL,
       'Volumes & Persistent Storage', 'kubernetes-storage', 'ADVANCED', 37, NULL,
       'Understand Kubernetes volumes, persistent volumes, claims, and stateful application storage.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'kubernetes'), NULL,
       'Kubernetes Networking', 'kubernetes-networking', 'ADVANCED', 38, NULL,
       'Learn pod networking, service networking, cluster networking, and network policies.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'kubernetes'), NULL,
       'Ingress', 'kubernetes-ingress', 'ADVANCED', 39, NULL,
       'Learn HTTP routing into Kubernetes applications using Ingress.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'kubernetes'), NULL,
       'Helm', 'helm', 'ADVANCED', 40, NULL,
       'Learn Helm charts, templates, values, releases, and Kubernetes package management.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'kubernetes'), NULL,
       'Kubernetes Troubleshooting', 'kubernetes-troubleshooting', 'ADVANCED', 41, NULL,
       'Develop systematic approaches for diagnosing Kubernetes workloads, networking, scheduling, and configuration issues.'
-- INFRASTRUCTURE AS CODE
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'), NULL,
       'Infrastructure as Code Concepts', 'iac-concepts', 'INTERMEDIATE', 42, NULL,
       'Understand infrastructure as code principles, declarative infrastructure, reproducibility, and automation.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'), NULL,
       'Terraform Fundamentals', 'terraform-fundamentals', 'INTERMEDIATE', 43, NULL,
       'Introduction to Terraform, configuration files, initialization, planning, and applying infrastructure.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'), NULL,
       'Terraform Providers & Resources', 'terraform-providers-resources', 'INTERMEDIATE', 44, NULL,
       'Learn Terraform providers, resources, resource dependencies, and infrastructure definitions.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'), NULL,
       'Terraform Variables & Outputs', 'terraform-variables-outputs', 'INTERMEDIATE', 45, NULL,
       'Learn Terraform variables, locals, outputs, types, and reusable configuration patterns.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'), NULL,
       'Terraform State', 'terraform-state', 'INTERMEDIATE', 46, NULL,
       'Understand Terraform state, state management, remote state, locking, and state safety.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'), NULL,
       'Terraform Modules', 'terraform-modules', 'INTERMEDIATE', 47, NULL,
       'Learn how to design and consume reusable Terraform modules.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'), NULL,
       'Terraform Workspaces & Environments', 'terraform-workspaces-environments', 'INTERMEDIATE', 48, NULL,
       'Learn approaches for managing development, staging, and production infrastructure environments.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'), NULL,
       'Terraform + CI/CD', 'terraform-cicd', 'INTERMEDIATE', 49, NULL,
       'Integrate Terraform planning and infrastructure changes into automated CI/CD workflows.'
-- CLOUD & DEVOPS — PROVIDER NEUTRAL
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), NULL,
       'Cloud Computing Fundamentals', 'cloud-computing-fundamentals', 'BEGINNER', 50, NULL,
       'Understand cloud computing models, regions, availability zones, scalability, elasticity, high availability, and shared responsibility.'
-- AWS PATH
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'aws'),
       'AWS Core Services & Account Structure', 'aws-core-services-account-structure', 'INTERMEDIATE', 51, NULL,
       'Understand AWS accounts, regions, availability zones, core services, and the AWS resource model.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'aws'),
       'AWS Compute — EC2', 'aws-ec2', 'INTERMEDIATE', 52, NULL,
       'Learn Amazon EC2 instances, machine images, instance types, storage, and lifecycle management.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'aws'),
       'AWS Storage — S3 & EBS', 'aws-storage-s3-ebs', 'INTERMEDIATE', 53, NULL,
       'Learn AWS object and block storage using Amazon S3 and EBS.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'aws'),
       'AWS Networking — VPC', 'aws-vpc', 'INTERMEDIATE', 54, NULL,
       'Learn VPCs, subnets, route tables, internet gateways, NAT, and AWS network architecture.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'aws'),
       'AWS IAM', 'aws-iam', 'INTERMEDIATE', 55, NULL,
       'Learn AWS identity and access management, users, roles, policies, and least-privilege access.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'aws'),
       'AWS Databases', 'aws-databases', 'INTERMEDIATE', 56, NULL,
       'Understand AWS managed database options and common cloud database architectures.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'aws'),
       'AWS Load Balancing & Auto Scaling', 'aws-load-balancing-auto-scaling', 'ADVANCED', 57, NULL,
       'Learn AWS load balancing and automatic scaling for highly available applications.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'aws'),
       'AWS Monitoring & Logging', 'aws-monitoring-logging', 'ADVANCED', 58, NULL,
       'Learn AWS monitoring, metrics, logs, alerts, and operational visibility.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'aws'),
       'AWS DevOps & CI/CD', 'aws-devops-cicd', 'ADVANCED', 59, NULL,
       'Apply DevOps and CI/CD concepts using AWS services and cloud-native deployment workflows.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'aws'),
       'Amazon EKS & Production Architecture', 'aws-eks-production-architecture', 'ADVANCED', 60, NULL,
       'Learn Amazon EKS and design production-grade AWS architectures using Kubernetes and cloud services.'
-- AZURE PATH
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'azure'),
       'Azure Core Services & Subscription Structure', 'azure-core-services-subscription-structure', 'INTERMEDIATE', 61, NULL,
       'Understand Azure subscriptions, resource groups, regions, availability zones, and core Azure services.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'azure'),
       'Azure Compute — Virtual Machines', 'azure-virtual-machines', 'INTERMEDIATE', 62, NULL,
       'Learn Azure Virtual Machines, VM sizes, images, disks, and lifecycle management.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'azure'),
       'Azure Storage', 'azure-storage', 'INTERMEDIATE', 63, NULL,
       'Learn Azure storage services and common cloud storage architectures.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'azure'),
       'Azure Networking — Virtual Network', 'azure-virtual-network', 'INTERMEDIATE', 64, NULL,
       'Learn Azure Virtual Networks, subnets, routing, network security, and cloud networking architecture.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'azure'),
       'Microsoft Entra ID & RBAC', 'azure-entra-id-rbac', 'INTERMEDIATE', 65, NULL,
       'Learn Azure identity, Microsoft Entra ID, role-based access control, and least-privilege access.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'azure'),
       'Azure Databases', 'azure-databases', 'INTERMEDIATE', 66, NULL,
       'Understand Azure managed database services and common cloud database architectures.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'azure'),
       'Azure Load Balancing & Scale Sets', 'azure-load-balancing-scale-sets', 'ADVANCED', 67, NULL,
       'Learn Azure load balancing and virtual machine scale sets for highly available applications.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'azure'),
       'Azure Monitor & Log Analytics', 'azure-monitor-log-analytics', 'ADVANCED', 68, NULL,
       'Learn Azure monitoring, metrics, logs, alerts, and operational visibility.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'azure'),
       'Azure DevOps & CI/CD', 'azure-devops-cicd', 'ADVANCED', 69, NULL,
       'Apply DevOps and CI/CD concepts using Azure DevOps and Azure cloud services.'
UNION ALL
SELECT (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'), (SELECT id FROM cloud_providers WHERE slug = 'azure'),
       'Azure Kubernetes Service & Production Architecture', 'azure-aks-production-architecture', 'ADVANCED', 70, NULL,
       'Learn Azure Kubernetes Service and design production-grade Azure architectures using Kubernetes and cloud services.';

UPDATE topics t
JOIN (
    SELECT 'linux-file-system' AS slug, 'linux-fundamentals' AS prereq_slug
    UNION ALL SELECT 'essential-linux-commands', 'linux-file-system'
    UNION ALL SELECT 'linux-users-permissions', 'essential-linux-commands'
    UNION ALL SELECT 'linux-processes-services', 'linux-users-permissions'
    UNION ALL SELECT 'linux-package-management', 'linux-processes-services'
    UNION ALL SELECT 'shell-scripting-basics', 'linux-package-management'
    UNION ALL SELECT 'networking-fundamentals', 'linux-fundamentals'
    UNION ALL SELECT 'osi-tcp-ip-models', 'networking-fundamentals'
    UNION ALL SELECT 'ip-addressing-subnetting', 'osi-tcp-ip-models'
    UNION ALL SELECT 'dns', 'ip-addressing-subnetting'
    UNION ALL SELECT 'http-https', 'networking-fundamentals'
    UNION ALL SELECT 'ports-protocols', 'ip-addressing-subnetting'
    UNION ALL SELECT 'firewalls-security-groups', 'ports-protocols'
    UNION ALL SELECT 'git-fundamentals', 'linux-fundamentals'
    UNION ALL SELECT 'git-branching', 'git-fundamentals'
    UNION ALL SELECT 'git-merge-conflicts', 'git-branching'
    UNION ALL SELECT 'github', 'git-fundamentals'
    UNION ALL SELECT 'pull-requests-code-review', 'github'
    UNION ALL SELECT 'github-actions-fundamentals', 'github'
    UNION ALL SELECT 'docker-fundamentals', 'linux-fundamentals'
    UNION ALL SELECT 'docker-images-containers', 'docker-fundamentals'
    UNION ALL SELECT 'dockerfile', 'docker-images-containers'
    UNION ALL SELECT 'docker-compose', 'dockerfile'
    UNION ALL SELECT 'docker-networking-volumes', 'docker-compose'
    UNION ALL SELECT 'cicd-fundamentals', 'github-actions-fundamentals'
    UNION ALL SELECT 'jenkins-fundamentals', 'cicd-fundamentals'
    UNION ALL SELECT 'jenkins-pipelines', 'jenkins-fundamentals'
    UNION ALL SELECT 'jenkins-docker', 'jenkins-pipelines'
    UNION ALL SELECT 'cicd-pipeline-architecture', 'jenkins-docker'
    UNION ALL SELECT 'kubernetes-fundamentals', 'docker-images-containers'
    UNION ALL SELECT 'kubernetes-architecture', 'kubernetes-fundamentals'
    UNION ALL SELECT 'kubernetes-pods', 'kubernetes-architecture'
    UNION ALL SELECT 'kubernetes-deployments', 'kubernetes-pods'
    UNION ALL SELECT 'kubernetes-services', 'kubernetes-deployments'
    UNION ALL SELECT 'kubernetes-configmaps-secrets', 'kubernetes-services'
    UNION ALL SELECT 'kubernetes-storage', 'kubernetes-services'
    UNION ALL SELECT 'kubernetes-networking', 'kubernetes-services'
    UNION ALL SELECT 'kubernetes-ingress', 'kubernetes-networking'
    UNION ALL SELECT 'helm', 'kubernetes-deployments'
    UNION ALL SELECT 'kubernetes-troubleshooting', 'kubernetes-networking'
    UNION ALL SELECT 'iac-concepts', 'kubernetes-fundamentals'
    UNION ALL SELECT 'terraform-fundamentals', 'iac-concepts'
    UNION ALL SELECT 'terraform-providers-resources', 'terraform-fundamentals'
    UNION ALL SELECT 'terraform-variables-outputs', 'terraform-providers-resources'
    UNION ALL SELECT 'terraform-state', 'terraform-variables-outputs'
    UNION ALL SELECT 'terraform-modules', 'terraform-state'
    UNION ALL SELECT 'terraform-workspaces-environments', 'terraform-modules'
    UNION ALL SELECT 'terraform-cicd', 'terraform-modules'
    UNION ALL SELECT 'cloud-computing-fundamentals', 'terraform-fundamentals'
    UNION ALL SELECT 'aws-core-services-account-structure', 'cloud-computing-fundamentals'
    UNION ALL SELECT 'aws-ec2', 'aws-core-services-account-structure'
    UNION ALL SELECT 'aws-storage-s3-ebs', 'aws-ec2'
    UNION ALL SELECT 'aws-vpc', 'aws-core-services-account-structure'
    UNION ALL SELECT 'aws-iam', 'aws-core-services-account-structure'
    UNION ALL SELECT 'aws-databases', 'aws-storage-s3-ebs'
    UNION ALL SELECT 'aws-load-balancing-auto-scaling', 'aws-vpc'
    UNION ALL SELECT 'aws-monitoring-logging', 'aws-ec2'
    UNION ALL SELECT 'aws-devops-cicd', 'terraform-cicd'
    UNION ALL SELECT 'aws-eks-production-architecture', 'kubernetes-fundamentals'
    UNION ALL SELECT 'azure-core-services-subscription-structure', 'cloud-computing-fundamentals'
    UNION ALL SELECT 'azure-virtual-machines', 'azure-core-services-subscription-structure'
    UNION ALL SELECT 'azure-storage', 'azure-virtual-machines'
    UNION ALL SELECT 'azure-virtual-network', 'azure-core-services-subscription-structure'
    UNION ALL SELECT 'azure-entra-id-rbac', 'azure-core-services-subscription-structure'
    UNION ALL SELECT 'azure-databases', 'azure-storage'
    UNION ALL SELECT 'azure-load-balancing-scale-sets', 'azure-virtual-network'
    UNION ALL SELECT 'azure-monitor-log-analytics', 'azure-virtual-machines'
    UNION ALL SELECT 'azure-devops-cicd', 'terraform-cicd'
    UNION ALL SELECT 'azure-aks-production-architecture', 'kubernetes-fundamentals'
) AS prereq_map ON prereq_map.slug = t.slug
JOIN topics p ON p.slug = prereq_map.prereq_slug
SET t.prerequisite_topic_id = p.id;

