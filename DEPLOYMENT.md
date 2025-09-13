# Deployment Guide

This document provides detailed instructions for deploying the Career Counseling AI Chat Application to Vercel and setting up a PostgreSQL database.

## Vercel Deployment

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. The [Vercel CLI](https://vercel.com/docs/cli) installed
3. A PostgreSQL database (see options below)
4. An OpenAI API key

### Deployment Steps

1. **Login to Vercel CLI**

```bash
vercel login
```

2. **Deploy the application**

From the project root directory:

```bash
vercel
```

Follow the interactive prompts. When asked about build settings, the defaults should work as our `vercel.json` file contains the necessary configuration.

3. **Set up environment variables**

After deployment, set up the required environment variables in the Vercel dashboard:

- Go to your project in the Vercel dashboard
- Navigate to Settings > Environment Variables
- Add the following variables:
  - `DATABASE_URL`: Your PostgreSQL connection string
  - `OPENAI_API_KEY`: Your OpenAI API key
  - `NODE_ENV`: Set to `production`

4. **Redeploy with environment variables**

```bash
vercel --prod
```

## PostgreSQL Database Options

### Option 1: Vercel Postgres

Vercel offers a PostgreSQL database service that integrates seamlessly with Vercel deployments.

1. In your Vercel dashboard, go to Storage
2. Select "Create Database"
3. Choose PostgreSQL
4. Follow the setup wizard
5. Once created, Vercel will automatically add the `DATABASE_URL` to your project

### Option 2: Supabase

1. Create an account on [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Settings > Database to find your connection string
4. Use the connection string as your `DATABASE_URL` environment variable

### Option 3: Railway

1. Create an account on [Railway](https://railway.app/)
2. Start a new PostgreSQL project
3. Get the connection details from the Connect tab
4. Use the connection string as your `DATABASE_URL` environment variable

### Option 4: Neon

1. Create an account on [Neon](https://neon.tech/)
2. Create a new project
3. Get the connection string from the dashboard
4. Use the connection string as your `DATABASE_URL` environment variable

## Database Migration

After setting up your database and deploying your application, you need to run migrations to create the database schema:

1. **Add Prisma to your production dependencies**

Make sure Prisma is in your `dependencies` (not just `devDependencies`) in `package.json`:

```bash
npm install prisma @prisma/client
```

2. **Run migrations in production**

You can run migrations directly from the Vercel dashboard using the "Run Command" feature:

```bash
npx prisma migrate deploy
```

Alternatively, you can set up a build command in your `vercel.json` that includes the migration:

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node",
      "config": {
        "buildCommand": "npx prisma migrate deploy && next build"
      }
    }
  ]
}
```

## Troubleshooting

### Database Connection Issues

- Ensure your database allows connections from Vercel's IP addresses
- Check that your connection string is correctly formatted
- Verify that the database user has the necessary permissions

### OpenAI API Issues

- Confirm your API key is valid and has sufficient credits
- Check for any rate limiting or quota issues in the OpenAI dashboard

### Deployment Failures

- Review the build logs in the Vercel dashboard
- Ensure all dependencies are correctly installed
- Check that your environment variables are correctly set

## Monitoring and Maintenance

- Use Vercel Analytics to monitor application performance
- Set up logging with a service like Logtail or Datadog
- Regularly update dependencies to maintain security and performance

## Scaling

As your application grows, consider:

- Upgrading your database plan for better performance
- Implementing caching strategies
- Using edge functions for global distribution
- Setting up a CDN for static assets