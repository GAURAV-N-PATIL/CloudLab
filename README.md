# CloudLab

CloudLab is a learning platform for cloud and DevOps engineering. It teaches Linux, Networking, Git & GitHub, Docker, CI/CD, Jenkins, Kubernetes and Terraform in a fixed order, then goes deep on one cloud (AWS or Azure). Finishing a topic unlocks the next one, finishing topics unlocks projects, and finishing the track earns a certificate.

Built as a mini project for **Entrepreneurship Development** and **Full Stack Java Programming**.

## How it works

- Topics unlock in order. Projects unlock once the topics they need are complete.
- Everyone starts on the provider-neutral path. After finishing it, the learner picks **AWS or Azure once, permanently**.
- Free: beginner topics and two projects. Paid: the cloud track, remaining projects, certificates.
- All unlock and gating rules live in the Spring Boot backend. The frontend only displays what the API returns.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, plain CSS with design tokens |
| Backend | Spring Boot 4.1, Java 21, Spring Security (JWT via JJWT), Spring Data JPA |
| Database | MySQL 8 (`schema.sql` is the source of truth, `ddl-auto=validate`) |
| API docs | springdoc-openapi (Swagger UI) |

## Repository layout

```
cloudlab-backend/    Spring Boot API, schema.sql, seed.sql, tests
cloudlab-frontend/   React app (Vite)
cloudlab-planning/   Planning documents and the original schema draft
```

## Prerequisites

- JDK 21
- MySQL 8
- Node.js 18 or newer (for the frontend)

## Environment variables

| Variable | Used by | Purpose |
|---|---|---|
| `DB_PASSWORD` | backend | Password for the MySQL `root` user |
| `JWT_SECRET` | backend | Secret used to sign JWTs. Use a long random string (at least 32 characters) |
| `SPRING_PROFILES_ACTIVE` | backend | Optional. Defaults to `dev`. Set to `prod` when deploying |

Export them in the same shell you run the backend from, otherwise startup fails:

```bash
export DB_PASSWORD='your-mysql-password'
export JWT_SECRET='replace-with-a-long-random-string-of-32-or-more-chars'
```

## Run the backend

1. Create the database and tables, then load the seed data:

   ```bash
   mysql -u root -p < cloudlab-backend/src/main/resources/db/schema.sql
   mysql -u root -p < cloudlab-backend/src/main/resources/db/seed.sql
   ```

2. Start the API on port 8080:

   ```bash
   cd cloudlab-backend
   ./mvnw spring-boot:run
   ```

3. Run the tests:

   ```bash
   ./mvnw test
   ```

Swagger UI is available at <http://localhost:8080/swagger-ui.html> while the backend is running.

### Profiles

- `dev` (default): verbose Spring Security logging and SQL logging, from `application-dev.properties`.
- `prod`: quiet logging. Activate with `SPRING_PROFILES_ACTIVE=prod`.

## Run the frontend

```bash
cd cloudlab-frontend
cp .env.example .env.local
npm install
npm run dev
```

Open <http://localhost:5173>.

The frontend has two modes, controlled by `VITE_USE_MOCK` in `.env.local`:

- `VITE_USE_MOCK=true`: runs entirely in the browser on mock data that mirrors the real API. No backend needed. Demo login: `demo@cloudlab.dev` / `password123`.
- `VITE_USE_MOCK=false`: calls the real backend. In dev, Vite proxies `/api` to `http://localhost:8080`, so no CORS setup is needed.

## Status

- [x] Database schema and seed data
- [x] Backend: auth, roadmap, projects, cloud selection, subscriptions and certificates (read endpoints), tests
- [ ] Frontend: scaffold, routing, auth, core flow on mock data (Part A) is in place; live API wiring (Part B) is next
- [ ] Payments (subscribe/checkout endpoint)
- [ ] Certificate PDF generation
- [ ] Deployment

## Frontend-improvement branch contents

## License

See [LICENSE](LICENSE).
