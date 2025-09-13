# Career Counseling AI Chat Application

A Next.js application that provides career counseling through an AI-powered chat interface. Built with tRPC, Prisma, PostgreSQL, and Google's Gemini API.

## Features

- 💬 Real-time chat interface with AI career counselor
- 📚 Session management for multiple conversations
- 🔄 Message history with pagination
- 🎨 Modern UI with TailwindCSS and ShadcnUI
- 🔒 Type-safe API with tRPC
- 🗃️ PostgreSQL database with Prisma ORM

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, ShadcnUI
- **Backend**: tRPC, Prisma, PostgreSQL
- **AI**: Google Gemini API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Gemini API key

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd job-assignment
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the src directory with the following variables:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/career_counseling"
GEMINI_API_KEY="your-gemini-api-key"
NODE_ENV="development"
```

4. Set up the database

```bash
npx prisma migrate dev --name init
```

5. Start the development server

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This application is configured for deployment on Vercel. Follow these steps:

1. Create a Vercel account and install the Vercel CLI

```bash
npm install -g vercel
```

2. Deploy to Vercel

```bash
vercel
```

3. Set up environment variables in the Vercel dashboard

- `DATABASE_URL`: Your PostgreSQL connection string
- `OPENAI_API_KEY`: Your OpenAI API key

## Database Setup

For production, you can use any PostgreSQL provider like:

- Vercel Postgres
- Supabase
- Railway
- Neon

Make sure to update your `DATABASE_URL` environment variable accordingly.

## Project Structure

```
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/        # React components
│   │   ├── chat/         # Chat-related components
│   │   └── ui/           # UI components from ShadcnUI
│   ├── lib/              # Utility functions and libraries
│   │   ├── api/          # tRPC client setup
│   │   ├── db.ts         # Prisma client
│   │   └── openai.ts     # OpenAI integration
│   └── server/           # Server-side code
│       └── api/          # tRPC routers and procedures
└── ...config files
```
