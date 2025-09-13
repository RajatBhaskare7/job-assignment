# Environment Variables Setup Guide

## Local Development

For local development, you need to set up environment variables in a `.env` file. This file should be placed in the `src` directory of your project.

### Required Environment Variables

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/career_counseling"
GEMINI_API_KEY="your-gemini-api-key"
NODE_ENV="development"
```

### Environment Variables Explanation

1. **DATABASE_URL**
   - This is the connection string for your PostgreSQL database
   - Format: `postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME`
   - For local development, you can use a local PostgreSQL instance
   - Example: `postgresql://postgres:password@localhost:5432/career_counseling`

2. **GEMINI_API_KEY**
   - This is your API key from Google's Gemini AI
   - You can get this from your Google AI Studio dashboard
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey) to create a new key
   - Example: `AIzaSyA1BCdefGHIjkLMNopqrSTUvwxyz123456`

3. **NODE_ENV**
   - This specifies the environment your application is running in
   - For local development, set this to `development`
   - For production, set this to `production`
   - Example: `development`

## Setting Up Environment Variables in Vercel

When deploying to Vercel, you need to set up environment variables in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `NODE_ENV`: Set to `production`

## Using Environment Variables in the Application

The application uses the `@t3-oss/env-nextjs` package to validate and access environment variables. This ensures that all required environment variables are present and correctly formatted.

The environment variables are defined in `src/env.mjs` and can be accessed throughout the application using the `env` object:

```typescript
import { env } from "~/env.mjs";

// Access environment variables
const databaseUrl = env.DATABASE_URL;
const geminiApiKey = env.GEMINI_API_KEY;
```

## Security Considerations

1. **Never commit your `.env` file to version control**
   - The `.env` file contains sensitive information and should never be committed to your repository
   - The `.env` file is already included in the `.gitignore` file

2. **Use environment variable references in Vercel**
   - For sensitive information like API keys, use Vercel's environment variable references
   - This allows you to store the actual values securely and reference them in your project
   - Example: `@gemini-api-key` instead of the actual API key

3. **Rotate API keys regularly**
   - Regularly rotate your API keys to minimize the risk of unauthorized access
   - Update the environment variables in Vercel and your local `.env` file when you rotate keys