# Survivor Incubator Platform

This is a full-stack web application for a startup incubator, built with SvelteKit, Bun, and Prisma. It provides a platform for startups, investors, and administrators to connect and manage their activities.

## Project Overview

The platform serves three main user roles:
- **Founders**: Can create and manage their startup profiles, view their dashboard, and see relevant news and events.
- **Investors**: Can browse and filter startups, express interest, and follow their progress.
- **Admins**: Have full control over the platform, including user management, content management, and data synchronization.

## Tech Stack

- **Framework**: SvelteKit
- **Runtime**: Bun
- **Database**: SQLite (via Prisma)
- **Styling**: CSS (via `app.css`)
- **Testing**: Vitest, Playwright
- **CI/CD**: GitHub Actions

## Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    bun install
    ```
3.  **Set up environment variables**:
    Rename `.env.example` to `.env` and fill in the required values, especially `JWT_SECRET`.
4.  **Run database migrations**:
    ```bash
    bunx prisma migrate dev
    ```
5.  **Sync with external API (optional but recommended)**:
    This will populate the database with initial data.
    ```bash
    bun run src/lib/server/jeb-sync.ts
    ```
6.  **Start the development server**:
    ```bash
    bun run dev
    ```

## Project Structure

```
.
├── prisma/             # Prisma schema, migrations, and dev database
├── src/
│   ├── lib/            # Shared utilities and modules
│   │   ├── server/     # Server-side only modules (auth, API sync)
│   │   └── test-utils/ # Utilities for testing
│   ├── routes/         # SvelteKit routes
│   │   ├── api/        # API endpoints
│   │   ├── admin/      # Admin-only routes
│   │   ├── investor/   # Investor-only routes
│   │   └── startup/    # Founder-only routes
│   └── tests/          # Vitest unit tests
├── static/             # Static assets
├── .github/workflows/  # CI/CD pipeline
...
```

## Dashboards

### Startup Dashboard (`/startup/dashboard`)
This is a private area for founders to manage their startup profile.
- **Authentication**: Requires a user with the `FOUNDER` role.
- **Features**:
    - View and edit their startup's profile information.
    - See a list of interested investors.
    - Track key metrics and milestones.
    - View news and events tailored to their industry.

### Investor Dashboard (`/investor/dashboard`)
A personalized space for investors to discover and track startups.
- **Authentication**: Requires a user with the `INVESTOR` role.
- **Features**:
    - Browse a list of all approved startups.
    - Filter startups by industry, funding stage, and other criteria.
    - View detailed startup profiles, including financials and team information.
    - Mark startups as "interested" to receive updates.
    - A personalized feed of news and events.

### Admin Dashboard (`/admin/dashboard`)
The central control panel for platform administrators.
- **Authentication**: Requires a user with the `ADMIN` role.
- **Features**:
    - **User Management**: Create, edit, and delete users of all roles.
    - **Startup Management**: Approve new startups, feature promising ones, and manage profiles.
    - **Content Management**: Create and publish news articles and events.
    - **Data Sync**: Manually trigger the synchronization with the external JEB API.
    - **Platform Analytics**: View key metrics on user engagement and platform growth.

## Authentication and Authorization

- **Authentication**: Implemented using JSON Web Tokens (JWT). The `hooks.server.ts` file decodes the JWT from the `Authorization` cookie on every request and populates `event.locals.user`.
- **Authorization**: API routes and dashboard pages are protected based on user roles. The `hooks.server.ts` file includes logic to check a user's role against a permissions object, ensuring that only authorized users can access specific routes. For example, `/api/admin/*` routes require the `ADMIN` role.

## Testing

- **Unit Tests**: Vitest is used for unit testing API endpoints and business logic in `src/lib`. Tests are located in the `src/tests` directory. Run tests with:
  ```bash
  bun test
  ```
- **End-to-End Tests**: Playwright is set up for E2E testing. (Configuration in `playwright.config.ts`).

## CI/CD

A GitHub Actions workflow is defined in `.github/workflows/ci.yml`. It runs on every push to the `main` branch and performs the following steps:
1.  **Lint**: Checks for code style issues.
2.  **Test**: Runs the Vitest unit tests.
3.  **Build**: Creates a production build of the SvelteKit application.
4.  **Playwright**: Installs browsers and runs E2E tests (if configured).
