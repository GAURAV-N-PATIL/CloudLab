// Static mock content for Part A. Shapes mirror the backend DTOs exactly.
// Slugs marked (seed) exist in seed.sql; the rest are illustrative.
// `prerequisite` / `requires` are extra fields used only by mock.js to compute statuses
// the same way the server does; they are stripped before anything is returned.

export const cloudProviders = [
  {
    id: 1,
    name: 'Amazon Web Services',
    slug: 'aws',
    description: 'Infrastructure, networking, security and DevOps on AWS.',
  },
  {
    id: 2,
    name: 'Microsoft Azure',
    slug: 'azure',
    description: 'Infrastructure, networking, identity and DevOps on Azure.',
  },
]

const article = (id, title, url, orderIndex = 1) => ({ id, type: 'ARTICLE', title, url, orderIndex })

export const topics = [
  // Provider-neutral (cloud provider = null)
  {
    id: 1, name: 'Linux Fundamentals', slug: 'linux-fundamentals', level: 'BEGINNER', orderIndex: 1, // (seed)
    description: 'Introduction to Linux, the command line, shells, terminals, and basic server concepts.',
    cloud: null, prerequisite: null,
    resources: [article(1, 'GNU Bash reference manual', 'https://www.gnu.org/software/bash/manual/bash.html')],
  },
  {
    id: 2, name: 'Linux File System', slug: 'linux-file-system', level: 'BEGINNER', orderIndex: 2, // (seed)
    description: 'Understand the Linux filesystem hierarchy, paths, directories, and file management.',
    cloud: null, prerequisite: 'linux-fundamentals',
    resources: [article(2, 'Linux man pages online', 'https://man7.org/linux/man-pages/')],
  },
  {
    id: 3, name: 'Essential Linux Commands', slug: 'essential-linux-commands', level: 'BEGINNER', orderIndex: 3, // (seed)
    description: 'Navigation, file manipulation, searching, and system administration commands.',
    cloud: null, prerequisite: 'linux-file-system',
    resources: [article(3, 'Linux man pages online', 'https://man7.org/linux/man-pages/')],
  },
  {
    id: 4, name: 'Networking Fundamentals', slug: 'networking-fundamentals', level: 'BEGINNER', orderIndex: 4, // (seed)
    description: 'Introduction to computer networking and the concepts needed for DevOps and cloud infrastructure.',
    cloud: null, prerequisite: 'essential-linux-commands',
    resources: [article(4, 'What is a network?', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Web_standards/How_the_web_works')],
  },
  {
    id: 5, name: 'DNS', slug: 'dns', level: 'BEGINNER', orderIndex: 5, // (seed)
    description: 'Domain names, DNS records, resolution, zones, and common troubleshooting.',
    cloud: null, prerequisite: 'networking-fundamentals',
    resources: [article(5, 'What is DNS?', 'https://www.cloudflare.com/learning/dns/what-is-dns/')],
  },
  {
    id: 6, name: 'HTTP & HTTPS', slug: 'http-https', level: 'BEGINNER', orderIndex: 6, // (seed)
    description: 'HTTP methods, status codes, headers, TLS, HTTPS, and how web traffic works.',
    cloud: null, prerequisite: 'dns',
    resources: [article(6, 'An overview of HTTP', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview')],
  },
  {
    id: 7, name: 'Git & GitHub', slug: 'git-and-github', level: 'BEGINNER', orderIndex: 7,
    description: 'Version control with Git: commits, branches, merges, and collaborating through GitHub.',
    cloud: null, prerequisite: 'http-https',
    resources: [article(7, 'Pro Git book', 'https://git-scm.com/book/en/v2')],
  },
  {
    id: 8, name: 'Docker Fundamentals', slug: 'docker-fundamentals', level: 'BEGINNER', orderIndex: 8,
    description: 'Images, containers, volumes and networks, and writing a Dockerfile.',
    cloud: null, prerequisite: 'git-and-github',
    resources: [
      article(8, 'Docker get started guide', 'https://docs.docker.com/get-started/', 2),
      // Not an 11-character ID, so the UI falls back to a plain link instead of a broken embed.
      { id: 9, type: 'YOUTUBE_VIDEO', title: 'Docker walkthrough (replace with a real video)', url: 'https://www.youtube.com/watch?v=VIDEO_ID_HERE', orderIndex: 1 },
    ],
  },

  // AWS track
  {
    id: 9, name: 'AWS IAM Basics', slug: 'aws-iam-basics', level: 'INTERMEDIATE', orderIndex: 9,
    description: 'Users, roles, policies, and the principle of least privilege on AWS.',
    cloud: 'aws', prerequisite: 'docker-fundamentals',
    resources: [article(10, 'IAM user guide', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html')],
  },
  {
    id: 10, name: 'AWS EC2', slug: 'aws-ec2', level: 'INTERMEDIATE', orderIndex: 10,
    description: 'Launching, connecting to, and managing virtual servers on EC2.',
    cloud: 'aws', prerequisite: 'aws-iam-basics',
    resources: [article(11, 'What is Amazon EC2?', 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html')],
  },
  {
    id: 11, name: 'AWS VPC', slug: 'aws-vpc', level: 'INTERMEDIATE', orderIndex: 11,
    description: 'Subnets, route tables, gateways, and security groups in a Virtual Private Cloud.',
    cloud: 'aws', prerequisite: 'aws-ec2',
    resources: [article(12, 'How Amazon VPC works', 'https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html')],
  },

  // Azure track
  {
    id: 12, name: 'Azure Identity Basics', slug: 'azure-identity-basics', level: 'INTERMEDIATE', orderIndex: 12,
    description: 'Microsoft Entra ID, users, groups, and role-based access control on Azure.',
    cloud: 'azure', prerequisite: 'docker-fundamentals',
    resources: [article(13, 'What is Azure RBAC?', 'https://learn.microsoft.com/en-us/azure/role-based-access-control/overview')],
  },
  {
    id: 13, name: 'Azure Virtual Machines', slug: 'azure-virtual-machines', level: 'INTERMEDIATE', orderIndex: 13,
    description: 'Creating, connecting to, and managing virtual machines on Azure.',
    cloud: 'azure', prerequisite: 'azure-identity-basics',
    resources: [article(14, 'Virtual machines overview', 'https://learn.microsoft.com/en-us/azure/virtual-machines/overview')],
  },
  {
    id: 14, name: 'Azure Virtual Networks', slug: 'azure-virtual-networks', level: 'INTERMEDIATE', orderIndex: 14,
    description: 'Virtual networks, subnets, network security groups, and peering.',
    cloud: 'azure', prerequisite: 'azure-virtual-machines',
    resources: [article(15, 'Virtual network overview', 'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview')],
  },
]

export const projects = [
  {
    id: 1, title: 'Host a static site on a Linux server', slug: 'static-site-on-linux',
    level: 'BEGINNER', orderIndex: 1, free: true, cloud: null,
    description: 'Set up a Linux server, install a web server, and publish a static page you wrote yourself.',
    requires: ['linux-fundamentals', 'essential-linux-commands'],
    resources: [article(1, 'Nginx beginner guide', 'https://nginx.org/en/docs/beginners_guide.html')],
  },
  {
    id: 2, title: 'Containerize a web app', slug: 'containerize-a-web-app',
    level: 'BEGINNER', orderIndex: 2, free: true, cloud: null,
    description: 'Write a Dockerfile for a small web app, build the image, and run it as a container.',
    requires: ['docker-fundamentals'],
    resources: [article(2, 'Dockerfile reference', 'https://docs.docker.com/reference/dockerfile/')],
  },
  {
    id: 3, title: 'Ship code with a CI pipeline', slug: 'ci-pipeline',
    level: 'INTERMEDIATE', orderIndex: 3, free: false, cloud: null,
    description: 'Run tests and build a container image on every push using GitHub Actions.',
    requires: ['git-and-github', 'docker-fundamentals'],
    resources: [article(3, 'GitHub Actions docs', 'https://docs.github.com/en/actions')],
  },
  {
    id: 4, title: 'Launch a server inside your own VPC', slug: 'aws-ec2-in-vpc',
    level: 'INTERMEDIATE', orderIndex: 4, free: false, cloud: 'aws',
    description: 'Create a VPC with a public subnet and launch an EC2 instance you can reach over SSH.',
    requires: ['aws-ec2', 'aws-vpc'],
    resources: [article(4, 'VPC getting started', 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-getting-started.html')],
  },
  {
    id: 5, title: 'Launch a VM inside your own virtual network', slug: 'azure-vm-in-vnet',
    level: 'INTERMEDIATE', orderIndex: 5, free: false, cloud: 'azure',
    description: 'Create a virtual network with a subnet and deploy a VM you can reach over SSH.',
    requires: ['azure-virtual-machines', 'azure-virtual-networks'],
    resources: [article(5, 'Create a virtual network', 'https://learn.microsoft.com/en-us/azure/virtual-network/quick-create-portal')],
  },
]
