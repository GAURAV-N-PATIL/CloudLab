USE cloudlab;

INSERT INTO cloud_providers (
    name,
    slug,
    description,
    is_active
)
VALUES
(
    'Amazon Web Services',
    'aws',
    'Amazon Web Services cloud learning path covering AWS infrastructure, networking, security, DevOps, and cloud-native services.',
    TRUE
),
(
    'Microsoft Azure',
    'azure',
    'Microsoft Azure cloud learning path covering Azure infrastructure, networking, identity, DevOps, monitoring, and cloud-native services.',
    TRUE
);

INSERT INTO topic_categories (
    name,
    slug,
    order_index
)
VALUES
(
    'Linux & OS',
    'linux-os',
    1
),
(
    'Networking',
    'networking',
    2
),
(
    'Git & Collaboration',
    'git-collaboration',
    3
),
(
    'Containers & CI/CD',
    'containers-cicd',
    4
),
(
    'Kubernetes',
    'kubernetes',
    5
),
(
    'Infrastructure as Code',
    'infrastructure-as-code',
    6
),
(
    'Cloud & DevOps',
    'cloud-devops',
    7
);

USE cloudlab;
-- CloudLab —topics seed
-- 50 Provider-Neutral + 10 AWS + 10 Azure = 70 topics
-- cloud_provider_id:
--   NULL = provider-neutral
--   AWS   = AWS-specific
--   AZURE = Azure-specific

-- 1. LINUX & OS
INSERT INTO topics (
    category_id,
    cloud_provider_id,
    name,
    slug,
    level,
    order_index,
    prerequisite_topic_id,
    description
)
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'linux-os'),
    NULL,
    'Linux Fundamentals',
    'linux-fundamentals',
    'BEGINNER',
    1,
    NULL,
    'Introduction to Linux, the command line, shells, terminals, and basic server concepts.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'linux-os'),
    NULL,
    'Linux File System',
    'linux-file-system',
    'BEGINNER',
    2,
    (SELECT id FROM topics WHERE slug = 'linux-fundamentals'),
    'Understand the Linux filesystem hierarchy, paths, directories, and file management.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'linux-os'),
    NULL,
    'Essential Linux Commands',
    'essential-linux-commands',
    'BEGINNER',
    3,
    (SELECT id FROM topics WHERE slug = 'linux-file-system'),
    'Learn the essential Linux commands used for navigation, file manipulation, searching, and system administration.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'linux-os'),
    NULL,
    'Users & Permissions',
    'linux-users-permissions',
    'BEGINNER',
    4,
    (SELECT id FROM topics WHERE slug = 'essential-linux-commands'),
    'Learn Linux users, groups, ownership, permissions, sudo, and access control.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'linux-os'),
    NULL,
    'Processes & Services',
    'linux-processes-services',
    'BEGINNER',
    5,
    (SELECT id FROM topics WHERE slug = 'linux-users-permissions'),
    'Understand processes, system services, process management, and service lifecycle operations.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'linux-os'),
    NULL,
    'Package Management',
    'linux-package-management',
    'BEGINNER',
    6,
    (SELECT id FROM topics WHERE slug = 'linux-processes-services'),
    'Learn how to install, update, remove, and manage software packages on Linux.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'linux-os'),
    NULL,
    'Shell Scripting Basics',
    'shell-scripting-basics',
    'BEGINNER',
    7,
    (SELECT id FROM topics WHERE slug = 'linux-package-management'),
    'Introduction to shell scripting, variables, conditions, loops, functions, and automation.'


-- 2. NETWORKING
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'networking'),
    NULL,
    'Networking Fundamentals',
    'networking-fundamentals',
    'BEGINNER',
    8,
    (SELECT id FROM topics WHERE slug = 'linux-fundamentals'),
    'Introduction to computer networking and the concepts required for DevOps and cloud infrastructure.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'networking'),
    NULL,
    'OSI & TCP/IP Models',
    'osi-tcp-ip-models',
    'BEGINNER',
    9,
    (SELECT id FROM topics WHERE slug = 'networking-fundamentals'),
    'Understand the OSI and TCP/IP networking models and how protocols operate across network layers.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'networking'),
    NULL,
    'IP Addressing & Subnetting',
    'ip-addressing-subnetting',
    'BEGINNER',
    10,
    (SELECT id FROM topics WHERE slug = 'osi-tcp-ip-models'),
    'Learn IPv4 addressing, CIDR notation, subnetting, private networks, and address ranges.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'networking'),
    NULL,
    'DNS',
    'dns',
    'BEGINNER',
    11,
    (SELECT id FROM topics WHERE slug = 'ip-addressing-subnetting'),
    'Understand domain names, DNS records, resolution, zones, and common DNS troubleshooting techniques.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'networking'),
    NULL,
    'HTTP & HTTPS',
    'http-https',
    'BEGINNER',
    12,
    (SELECT id FROM topics WHERE slug = 'networking-fundamentals'),
    'Learn HTTP methods, status codes, headers, TLS, HTTPS, and how web traffic works.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'networking'),
    NULL,
    'Ports & Protocols',
    'ports-protocols',
    'BEGINNER',
    13,
    (SELECT id FROM topics WHERE slug = 'ip-addressing-subnetting'),
    'Understand TCP, UDP, ports, common protocols, and service-to-service communication.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'networking'),
    NULL,
    'Firewalls & Security Groups',
    'firewalls-security-groups',
    'BEGINNER',
    14,
    (SELECT id FROM topics WHERE slug = 'ports-protocols'),
    'Learn network traffic filtering, firewall rules, inbound and outbound traffic, and security-group concepts.'


-- 3. GIT & COLLABORATION
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'git-collaboration'),
    NULL,
    'Git Fundamentals',
    'git-fundamentals',
    'BEGINNER',
    15,
    (SELECT id FROM topics WHERE slug = 'linux-fundamentals'),
    'Learn Git repositories, commits, staging, history, and everyday version-control workflows.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'git-collaboration'),
    NULL,
    'Git Branching',
    'git-branching',
    'BEGINNER',
    16,
    (SELECT id FROM topics WHERE slug = 'git-fundamentals'),
    'Understand branches and branch-based development workflows.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'git-collaboration'),
    NULL,
    'Git Merge & Conflict Resolution',
    'git-merge-conflicts',
    'BEGINNER',
    17,
    (SELECT id FROM topics WHERE slug = 'git-branching'),
    'Learn merging, resolving conflicts, rebasing concepts, and maintaining clean Git history.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'git-collaboration'),
    NULL,
    'GitHub',
    'github',
    'BEGINNER',
    18,
    (SELECT id FROM topics WHERE slug = 'git-fundamentals'),
    'Learn how GitHub hosts repositories and supports collaborative software development.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'git-collaboration'),
    NULL,
    'Pull Requests & Code Review',
    'pull-requests-code-review',
    'BEGINNER',
    19,
    (SELECT id FROM topics WHERE slug = 'github'),
    'Learn pull requests, reviews, approvals, discussions, and collaborative development workflows.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'git-collaboration'),
    NULL,
    'GitHub Actions Fundamentals',
    'github-actions-fundamentals',
    'BEGINNER',
    20,
    (SELECT id FROM topics WHERE slug = 'github'),
    'Introduction to GitHub Actions, workflows, jobs, steps, triggers, and basic automation.'


-- 4. CONTAINERS & CI/CD
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'),
    NULL,
    'Docker Fundamentals',
    'docker-fundamentals',
    'BEGINNER',
    21,
    (SELECT id FROM topics WHERE slug = 'linux-fundamentals'),
    'Introduction to containers, Docker architecture, images, containers, and the Docker CLI.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'),
    NULL,
    'Docker Images & Containers',
    'docker-images-containers',
    'BEGINNER',
    22,
    (SELECT id FROM topics WHERE slug = 'docker-fundamentals'),
    'Understand container lifecycle, images, registries, tags, and container management.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'),
    NULL,
    'Dockerfile',
    'dockerfile',
    'BEGINNER',
    23,
    (SELECT id FROM topics WHERE slug = 'docker-images-containers'),
    'Learn how to build reproducible container images using Dockerfiles.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'),
    NULL,
    'Docker Compose',
    'docker-compose',
    'BEGINNER',
    24,
    (SELECT id FROM topics WHERE slug = 'dockerfile'),
    'Learn how to define and run multi-container applications using Docker Compose.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'),
    NULL,
    'Docker Networking & Volumes',
    'docker-networking-volumes',
    'INTERMEDIATE',
    25,
    (SELECT id FROM topics WHERE slug = 'docker-compose'),
    'Learn Docker networks, persistent volumes, bind mounts, and container data management.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'),
    NULL,
    'CI/CD Fundamentals',
    'cicd-fundamentals',
    'INTERMEDIATE',
    26,
    (SELECT id FROM topics WHERE slug = 'github-actions-fundamentals'),
    'Understand continuous integration, continuous delivery, pipelines, automation, and deployment workflows.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'),
    NULL,
    'Jenkins Fundamentals',
    'jenkins-fundamentals',
    'INTERMEDIATE',
    27,
    (SELECT id FROM topics WHERE slug = 'cicd-fundamentals'),
    'Introduction to Jenkins, controllers, agents, jobs, credentials, and basic automation.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'),
    NULL,
    'Jenkins Pipelines',
    'jenkins-pipelines',
    'INTERMEDIATE',
    28,
    (SELECT id FROM topics WHERE slug = 'jenkins-fundamentals'),
    'Learn Jenkins Pipeline concepts, stages, steps, agents, and pipeline-as-code.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'),
    NULL,
    'Jenkins + Docker',
    'jenkins-docker',
    'INTERMEDIATE',
    29,
    (SELECT id FROM topics WHERE slug = 'jenkins-pipelines'),
    'Integrate Jenkins pipelines with Docker image builds and container workflows.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'containers-cicd'),
    NULL,
    'CI/CD Pipeline Architecture',
    'cicd-pipeline-architecture',
    'INTERMEDIATE',
    30,
    (SELECT id FROM topics WHERE slug = 'jenkins-docker'),
    'Design complete CI/CD pipelines covering source control, testing, builds, artifacts, containers, and deployment.'


-- 5. KUBERNETES
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'kubernetes'),
    NULL,
    'Kubernetes Fundamentals',
    'kubernetes-fundamentals',
    'ADVANCED',
    31,
    (SELECT id FROM topics WHERE slug = 'docker-images-containers'),
    'Introduction to Kubernetes and container orchestration.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'kubernetes'),
    NULL,
    'Kubernetes Architecture',
    'kubernetes-architecture',
    'ADVANCED',
    32,
    (SELECT id FROM topics WHERE slug = 'kubernetes-fundamentals'),
    'Understand clusters, control plane components, worker nodes, and Kubernetes architecture.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'kubernetes'),
    NULL,
    'Pods',
    'kubernetes-pods',
    'ADVANCED',
    33,
    (SELECT id FROM topics WHERE slug = 'kubernetes-architecture'),
    'Learn Kubernetes Pods, containers, lifecycle, and pod configuration.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'kubernetes'),
    NULL,
    'Deployments',
    'kubernetes-deployments',
    'ADVANCED',
    34,
    (SELECT id FROM topics WHERE slug = 'kubernetes-pods'),
    'Learn Deployments, ReplicaSets, rolling updates, rollbacks, and application scaling.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'kubernetes'),
    NULL,
    'Services',
    'kubernetes-services',
    'ADVANCED',
    35,
    (SELECT id FROM topics WHERE slug = 'kubernetes-deployments'),
    'Learn Kubernetes Services and how applications communicate with workloads.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'kubernetes'),
    NULL,
    'ConfigMaps & Secrets',
    'kubernetes-configmaps-secrets',
    'ADVANCED',
    36,
    (SELECT id FROM topics WHERE slug = 'kubernetes-services'),
    'Learn how Kubernetes manages application configuration and sensitive values.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'kubernetes'),
    NULL,
    'Volumes & Persistent Storage',
    'kubernetes-storage',
    'ADVANCED',
    37,
    (SELECT id FROM topics WHERE slug = 'kubernetes-services'),
    'Understand Kubernetes volumes, persistent volumes, claims, and stateful application storage.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'kubernetes'),
    NULL,
    'Kubernetes Networking',
    'kubernetes-networking',
    'ADVANCED',
    38,
    (SELECT id FROM topics WHERE slug = 'kubernetes-services'),
    'Learn pod networking, service networking, cluster networking, and network policies.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'kubernetes'),
    NULL,
    'Ingress',
    'kubernetes-ingress',
    'ADVANCED',
    39,
    (SELECT id FROM topics WHERE slug = 'kubernetes-networking'),
    'Learn HTTP routing into Kubernetes applications using Ingress.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'kubernetes'),
    NULL,
    'Helm',
    'helm',
    'ADVANCED',
    40,
    (SELECT id FROM topics WHERE slug = 'kubernetes-deployments'),
    'Learn Helm charts, templates, values, releases, and Kubernetes package management.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'kubernetes'),
    NULL,
    'Kubernetes Troubleshooting',
    'kubernetes-troubleshooting',
    'ADVANCED',
    41,
    (SELECT id FROM topics WHERE slug = 'kubernetes-networking'),
    'Develop systematic approaches for diagnosing Kubernetes workloads, networking, scheduling, and configuration issues.'


-- 6. INFRASTRUCTURE AS CODE
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'),
    NULL,
    'Infrastructure as Code Concepts',
    'iac-concepts',
    'INTERMEDIATE',
    42,
    (SELECT id FROM topics WHERE slug = 'kubernetes-fundamentals'),
    'Understand infrastructure as code principles, declarative infrastructure, reproducibility, and automation.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'),
    NULL,
    'Terraform Fundamentals',
    'terraform-fundamentals',
    'INTERMEDIATE',
    43,
    (SELECT id FROM topics WHERE slug = 'iac-concepts'),
    'Introduction to Terraform, configuration files, initialization, planning, and applying infrastructure.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'),
    NULL,
    'Terraform Providers & Resources',
    'terraform-providers-resources',
    'INTERMEDIATE',
    44,
    (SELECT id FROM topics WHERE slug = 'terraform-fundamentals'),
    'Learn Terraform providers, resources, resource dependencies, and infrastructure definitions.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'),
    NULL,
    'Terraform Variables & Outputs',
    'terraform-variables-outputs',
    'INTERMEDIATE',
    45,
    (SELECT id FROM topics WHERE slug = 'terraform-providers-resources'),
    'Learn Terraform variables, locals, outputs, types, and reusable configuration patterns.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'),
    NULL,
    'Terraform State',
    'terraform-state',
    'INTERMEDIATE',
    46,
    (SELECT id FROM topics WHERE slug = 'terraform-variables-outputs'),
    'Understand Terraform state, state management, remote state, locking, and state safety.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'),
    NULL,
    'Terraform Modules',
    'terraform-modules',
    'INTERMEDIATE',
    47,
    (SELECT id FROM topics WHERE slug = 'terraform-state'),
    'Learn how to design and consume reusable Terraform modules.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'),
    NULL,
    'Terraform Workspaces & Environments',
    'terraform-workspaces-environments',
    'INTERMEDIATE',
    48,
    (SELECT id FROM topics WHERE slug = 'terraform-modules'),
    'Learn approaches for managing development, staging, and production infrastructure environments.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'infrastructure-as-code'),
    NULL,
    'Terraform + CI/CD',
    'terraform-cicd',
    'INTERMEDIATE',
    49,
    (SELECT id FROM topics WHERE slug = 'terraform-modules'),
    'Integrate Terraform planning and infrastructure changes into automated CI/CD workflows.'


-- 7. CLOUD & DEVOPS — PROVIDER NEUTRAL
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    NULL,
    'Cloud Computing Fundamentals',
    'cloud-computing-fundamentals',
    'BEGINNER',
    50,
    (SELECT id FROM topics WHERE slug = 'terraform-fundamentals'),
    'Understand cloud computing models, regions, availability zones, scalability, elasticity, high availability, and shared responsibility.'


-- 8. AWS PATH
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'aws'),
    'AWS Core Services & Account Structure',
    'aws-core-services-account-structure',
    'INTERMEDIATE',
    51,
    (SELECT id FROM topics WHERE slug = 'cloud-computing-fundamentals'),
    'Understand AWS accounts, regions, availability zones, core services, and the AWS resource model.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'aws'),
    'AWS Compute — EC2',
    'aws-ec2',
    'INTERMEDIATE',
    52,
    (SELECT id FROM topics WHERE slug = 'aws-core-services-account-structure'),
    'Learn Amazon EC2 instances, machine images, instance types, storage, and lifecycle management.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'aws'),
    'AWS Storage — S3 & EBS',
    'aws-storage-s3-ebs',
    'INTERMEDIATE',
    53,
    (SELECT id FROM topics WHERE slug = 'aws-ec2'),
    'Learn AWS object and block storage using Amazon S3 and EBS.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'aws'),
    'AWS Networking — VPC',
    'aws-vpc',
    'INTERMEDIATE',
    54,
    (SELECT id FROM topics WHERE slug = 'aws-core-services-account-structure'),
    'Learn VPCs, subnets, route tables, internet gateways, NAT, and AWS network architecture.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'aws'),
    'AWS IAM',
    'aws-iam',
    'INTERMEDIATE',
    55,
    (SELECT id FROM topics WHERE slug = 'aws-core-services-account-structure'),
    'Learn AWS identity and access management, users, roles, policies, and least-privilege access.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'aws'),
    'AWS Databases',
    'aws-databases',
    'INTERMEDIATE',
    56,
    (SELECT id FROM topics WHERE slug = 'aws-storage-s3-ebs'),
    'Understand AWS managed database options and common cloud database architectures.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'aws'),
    'AWS Load Balancing & Auto Scaling',
    'aws-load-balancing-auto-scaling',
    'ADVANCED',
    57,
    (SELECT id FROM topics WHERE slug = 'aws-vpc'),
    'Learn AWS load balancing and automatic scaling for highly available applications.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'aws'),
    'AWS Monitoring & Logging',
    'aws-monitoring-logging',
    'ADVANCED',
    58,
    (SELECT id FROM topics WHERE slug = 'aws-ec2'),
    'Learn AWS monitoring, metrics, logs, alerts, and operational visibility.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'aws'),
    'AWS DevOps & CI/CD',
    'aws-devops-cicd',
    'ADVANCED',
    59,
    (SELECT id FROM topics WHERE slug = 'terraform-cicd'),
    'Apply DevOps and CI/CD concepts using AWS services and cloud-native deployment workflows.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'aws'),
    'Amazon EKS & Production Architecture',
    'aws-eks-production-architecture',
    'ADVANCED',
    60,
    (SELECT id FROM topics WHERE slug = 'kubernetes-fundamentals'),
    'Learn Amazon EKS and design production-grade AWS architectures using Kubernetes and cloud services.'

-- 9. AZURE PATH
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'azure'),
    'Azure Core Services & Subscription Structure',
    'azure-core-services-subscription-structure',
    'INTERMEDIATE',
    61,
    (SELECT id FROM topics WHERE slug = 'cloud-computing-fundamentals'),
    'Understand Azure subscriptions, resource groups, regions, availability zones, and core Azure services.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'azure'),
    'Azure Compute — Virtual Machines',
    'azure-virtual-machines',
    'INTERMEDIATE',
    62,
    (SELECT id FROM topics WHERE slug = 'azure-core-services-subscription-structure'),
    'Learn Azure Virtual Machines, VM sizes, images, disks, and lifecycle management.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'azure'),
    'Azure Storage',
    'azure-storage',
    'INTERMEDIATE',
    63,
    (SELECT id FROM topics WHERE slug = 'azure-virtual-machines'),
    'Learn Azure storage services and common cloud storage architectures.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'azure'),
    'Azure Networking — Virtual Network',
    'azure-virtual-network',
    'INTERMEDIATE',
    64,
    (SELECT id FROM topics WHERE slug = 'azure-core-services-subscription-structure'),
    'Learn Azure Virtual Networks, subnets, routing, network security, and cloud networking architecture.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'azure'),
    'Microsoft Entra ID & RBAC',
    'azure-entra-id-rbac',
    'INTERMEDIATE',
    65,
    (SELECT id FROM topics WHERE slug = 'azure-core-services-subscription-structure'),
    'Learn Azure identity, Microsoft Entra ID, role-based access control, and least-privilege access.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'azure'),
    'Azure Databases',
    'azure-databases',
    'INTERMEDIATE',
    66,
    (SELECT id FROM topics WHERE slug = 'azure-storage'),
    'Understand Azure managed database services and common cloud database architectures.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'azure'),
    'Azure Load Balancing & Scale Sets',
    'azure-load-balancing-scale-sets',
    'ADVANCED',
    67,
    (SELECT id FROM topics WHERE slug = 'azure-virtual-network'),
    'Learn Azure load balancing and virtual machine scale sets for highly available applications.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'azure'),
    'Azure Monitor & Log Analytics',
    'azure-monitor-log-analytics',
    'ADVANCED',
    68,
    (SELECT id FROM topics WHERE slug = 'azure-virtual-machines'),
    'Learn Azure monitoring, metrics, logs, alerts, and operational visibility.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'azure'),
    'Azure DevOps & CI/CD',
    'azure-devops-cicd',
    'ADVANCED',
    69,
    (SELECT id FROM topics WHERE slug = 'terraform-cicd'),
    'Apply DevOps and CI/CD concepts using Azure DevOps and Azure cloud services.'
UNION ALL
SELECT
    (SELECT id FROM topic_categories WHERE slug = 'cloud-devops'),
    (SELECT id FROM cloud_providers WHERE slug = 'azure'),
    'Azure Kubernetes Service & Production Architecture',
    'azure-aks-production-architecture',
    'ADVANCED',
    70,
    (SELECT id FROM topics WHERE slug = 'kubernetes-fundamentals'),
    'Learn Azure Kubernetes Service and design production-grade Azure architectures using Kubernetes and cloud services.';

