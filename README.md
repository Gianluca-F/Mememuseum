# Mememuseum

Project of the **Web Technologies** course at University of Naples Federico II.

Mememuseum is a full-stack web application where users can upload, browse, vote and
comment memes. It is composed of:

- **Backend** (`server/`) — REST API built with Node.js, Express, Sequelize and PostgreSQL.
- **Frontend** (`client/`) — SPA (Single Page Application) built with Angular and Tailwind CSS.
- **E2E tests** (`tests/`) — End-to-end tests written with Playwright.

---

## Prerequisites

Make sure the following tools are installed on your machine:

| Tool        | Version       | Notes                                          |
| ----------- | ------------- | ---------------------------------------------- |
| Node.js     | >= 18 (LTS)   | Required by both client and server             |
| npm         | >= 9          | Comes bundled with Node.js                     |
| PostgreSQL  | >= 14         | The database used by the backend               |

Check your versions with:

```bash
node -v
npm -v
psql --version
```

---

## 1. Clone the repository

```bash
git clone https://github.com/Gianluca-F/Mememuseum.git
cd Mememuseum
```

---

## 2. Database setup (PostgreSQL)

The backend uses PostgreSQL through Sequelize. You only need to create an empty
database — the tables are created **automatically** on the first run
(`database.sync()` in `server/data/Database.js`).

> Don't forget to adjust the connection URI accordingly in the
> next step.

---

## 3. Backend setup (`server/`)

### 3.1 Install dependencies

```bash
cd server
npm install
```

### 3.2 Configure environment variables

Copy the provided example file and edit it with your own values:

```bash
cp .env.example .env
```

`server/.env`:

```ini
DB_CONNECTION_URI = "postgres://mememuseum_user:your_password@localhost:5432/mememuseum"
DIALECT = "postgres"
FRONTEND_URL = "http://localhost:4200"
TOKEN_SECRET = "A V3ry S3cr3t T0k3n S3cr3t Th@t Y0u Sh0uld Ch@ng3"
PORT = 3000
HOST = "localhost"
```

| Variable             | Description                                                        |
| -------------------- | ----------------------------------------------------------------- |
| `DB_CONNECTION_URI`  | Full PostgreSQL connection string (user, password, host, db name) |
| `DIALECT`            | Sequelize dialect — keep `postgres`                               |
| `FRONTEND_URL`       | Origin allowed by CORS (the Angular dev server)                   |
| `TOKEN_SECRET`       | Secret used to sign JWT tokens — **use your own random value**    |
| `PORT`               | Port the API listens on                                          |
| `HOST`               | Host the API binds to                                            |

### 3.3 Run the backend

```bash
npm start
```

Keep in mind that exists an interactive API docs (Swagger UI) `http://localhost:3000/api-docs`, it can be useful for trying the CRUD operations without the frontend built and for having a general schema of the APIs in mind.

---

## 4. Frontend setup (`client/`)

Open a **new terminal** (keep the backend running) from the repository root.

### 4.1 Install dependencies

```bash
cd client
npm install
```

### 4.2 Run the frontend

```bash
npm start
```

This launches the Angular dev server and **opens the app in your browser
automatically** at **http://localhost:4200** (the `-o` flag in the `start` script).

> The frontend expects the backend to be reachable at `http://localhost:3000`.
> If you change the backend port, update the API base URL in the client config
> accordingly.

---

## 5. End-to-end tests (Playwright)

Follow these steps to start the tests.

### 5.1 Install dependencies

```bash
# from the Mememuseum/ root
npm install
npx playwright install
```

`npx playwright install` downloads the browser binaries used by the tests.

### 5.2 Run the tests

```bash
npx playwright test
```

Playwright is configured (see `playwright.config.ts`) to **start both the backend
and the frontend automatically** before running the tests, so you do not need to
have them running beforehand.

View the HTML report after a run:

```bash
npx playwright show-report
```