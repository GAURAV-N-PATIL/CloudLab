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

## Assignments & Experiment library

The public `/explore` page ("Assignments & Experiment") lists experiments, assignments and each team member's certificate and index. Every card opens its PDF in a viewer on the same page. There is no database or backend for this: the list is a JSON file and the PDFs live in Google Drive.

### Where the data lives

`cloudlab-frontend/src/data/resources.json`. It holds sections, and each section holds resources:

```json
{
  "id": "experiment-01",
  "title": "Experiment no. 1",
  "description": "Business Idea Generation using Mind Mapping.",
  "previewImage": null,
  "googleDriveFileId": null,
  "available": false,
  "tags": ["Experiment", "2 hrs"],
  "badge": null,
  "coverText": "01"
}
```

`badge` (a small label on the cover) and `coverText` (the big text on the placeholder cover) are optional. Add, edit or remove entries in this file only; the page and card code never need to change.

### Upload a PDF to Google Drive and get its file ID

1. Upload the PDF to Google Drive.
2. Right-click the file, choose **Share**, and under General access choose **Anyone with the link**, role **Viewer**. Without this the viewer shows a Google sign-in page instead of the document.
3. Copy the link. It looks like `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`. The file ID is the part between `/d/` and `/view`.

### Add a resource before its PDF exists

Add the entry with `"googleDriveFileId": null` and `"available": false`. The card shows a "Coming soon" badge and nothing opens when it is clicked.

### Make a resource available later

Paste the file ID into `googleDriveFileId` and set `"available": true`. Both are required: a card with `available: true` but no valid ID stays locked. The viewer opens `https://drive.google.com/file/d/FILE_ID/preview`.

### Add or replace a preview image

Export the first page of the PDF as a PNG or JPG (around 800 px wide), save it in `cloudlab-frontend/public/resources/previews/`, and set `"previewImage": "/resources/previews/experiment-01.png"`. With no image, or if the image fails to load, the card shows a generated placeholder cover.

### Test the viewer

1. Run `npm run dev` in `cloudlab-frontend` and open <http://localhost:5173/explore>.
2. Set one entry to `available: true` with a real file ID (shared as above).
3. Click the card: the viewer opens with the title in the header. Press Escape or the close button to close it; focus returns to the card.

### Limitations

A static JSON file is public. Anyone who can load the site can read the file IDs, and anyone with the Drive link can open the PDF. This setup does not protect paid or private documents. If some documents must be restricted, they need access control in the backend instead.

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
