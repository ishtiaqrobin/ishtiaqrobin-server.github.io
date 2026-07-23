# Raihan Islam - Backend API

This is the RESTful API for the Raihan Islam portfolio website. It handles authentication, tutor management, booking logic, payment processing, and administrative controls.

## 🚀 Technologies

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Cloud Storage**: [Cloudinary](https://cloudinary.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **Email**: [Nodemailer](https://nodemailer.com/) with EJS templates

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL instance
- Stripe API Key
- Cloudinary Credentials
- SMTP server (for emails)

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

3. Setup the database:

   ```bash
   npm run migrate
   npm run generate
   ```

4. Seed initial data (optional):

   ```bash
   npm run seed:admin
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

- `npm run dev`: Starts the development server with hot-reload.
- `npm run build`: Generates Prisma client and builds the project using `tsup`.
- `npm run migrate`: Runs Prisma migrations.
- `npm run db`: Pushes schema changes to the database.
- `npm run studio`: Opens Prisma Studio to view/edit database data.
- `npm run stripe:webhook`: Starts a Stripe webhook listener for local development.

## 🔑 Environment Variables

Required variables in `.env`:

| Key                     | Description                        |
| ----------------------- | ---------------------------------- |
| `DATABASE_URL`          | PostgreSQL connection string       |
| `BETTER_AUTH_SECRET`    | Secret key for Better Auth         |
| `BETTER_AUTH_URL`       | Base URL for authentication        |
| `STRIPE_SECRET_KEY`     | Stripe API secret key              |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name              |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                 |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret              |
| `EMAIL_USER`            | SMTP email address                 |
| `EMAIL_PASS`            | SMTP password                      |

## 📡 API Modules

- `User`: Profile management and role handling.
- `Tutor`: Specialized profile for tutors with expertise and pricing.
- `Category`: Tutor specialization categories.
- `Booking`: Appointment scheduling and status tracking.
- `Payment`: Stripe integration and transaction history.
- `Review`: Feedback system for tutors.
- `Admin`: Global management and analytics.

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
