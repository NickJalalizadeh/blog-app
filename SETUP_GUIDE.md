# Blog Application - Complete Setup Guide

This document provides a step-by-step guide to set up and run the blogging application.

## Quick Start Checklist

- [ ] Install Node.js 18+
- [ ] Install dependencies
- [ ] Set up Vercel Postgres database
- [ ] Configure environment variables
- [ ] Run database schema
- [ ] Start development server

## Detailed Setup Instructions

### 1. Project Setup

Create a new Next.js project or use the provided files:

```bash
# If starting fresh
npx create-next-app@latest blog-app --typescript --tailwind --app
cd blog-app

# Copy all provided files to your project directory
```

### 2. Install Dependencies

```bash
npm install @radix-ui/react-label @radix-ui/react-slot
npm install @tailwindcss/typography
npm install @vercel/postgres
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate
```

### 3. Database Setup (Vercel Postgres)

#### Option A: Using Vercel Dashboard

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to the Storage tab
3. Create a new Postgres database
4. Name it (e.g., "blog-database")
5. Select a region close to your users
6. Copy the provided environment variables

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Create database
vercel postgres create blog-database

# Connect to database
vercel postgres connect blog-database
```

### 4. Environment Variables

Create `.env.local` file in your project root:

```env
# Copy from Vercel Postgres dashboard
POSTGRES_URL="your-postgres-connection-string"
POSTGRES_PRISMA_URL="your-prisma-connection-string"
POSTGRES_URL_NON_POOLING="your-non-pooling-connection-string"
POSTGRES_USER="default"
POSTGRES_HOST="your-host.postgres.vercel-storage.com"
POSTGRES_PASSWORD="your-password"
POSTGRES_DATABASE="verceldb"
```

### 5. Initialize Database Schema

Run the SQL schema to create tables:

```bash
# If using Vercel CLI
vercel postgres sql -- "$(cat schema.sql)"

# Or manually:
# 1. Open Vercel dashboard
# 2. Go to your Postgres database
# 3. Click on "Query" tab
# 4. Copy and paste content from schema.sql
# 5. Execute the query
```

The schema will create:
- `blog_posts` table with all necessary columns
- Indexes for performance
- Sample blog posts (optional)

### 6. File Structure

Ensure your project has this structure:

```
blog-app/
├── app/
│   ├── api/
│   │   └── posts/
│   │       ├── route.ts
│   │       ├── create/
│   │       │   └── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── posts/
│   │   ├── [slug]/
│   │   │   ├── page.tsx
│   │   │   └── edit/
│   │   │       └── page.tsx
│   │   └── create/
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── textarea.tsx
│   ├── BlogCard.tsx
│   └── BlogForm.tsx
├── lib/
│   ├── db.ts
│   ├── queries.ts
│   └── utils.ts
├── .env.local (create this)
├── .env.example
├── schema.sql
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

### 7. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Verifying Installation

### 1. Check Database Connection

Create a test file `test-db.ts`:

```typescript
import { sql } from '@vercel/postgres';

async function testConnection() {
  try {
    const { rows } = await sql`SELECT COUNT(*) FROM blog_posts`;
    console.log('Database connected! Posts count:', rows[0].count);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();
```

Run with: `npx tsx test-db.ts`

### 2. Test API Endpoints

```bash
# Get all posts
curl http://localhost:3000/api/posts

# Create a post
curl -X POST http://localhost:3000/api/posts/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "slug": "test-post",
    "excerpt": "Test excerpt",
    "content": "Test content",
    "author": "Test Author",
    "tags": ["test"]
  }'
```

## Common Issues & Solutions

### Issue: "Module not found" errors

**Solution**: Ensure all dependencies are installed
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database connection errors

**Solutions**:
1. Verify environment variables are correct
2. Check `.env.local` is in project root
3. Restart dev server after changing env vars
4. Ensure database exists in Vercel dashboard

### Issue: TypeScript errors

**Solution**: Update tsconfig.json paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue: Tailwind styles not working

**Solution**: Ensure globals.css is imported in layout.tsx
```typescript
import "./globals.css";
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Next.js configuration
4. Connect your Postgres database (if not already connected)
5. Deploy!

Environment variables are automatically configured if you created the database through Vercel.

### 3. Post-Deployment

- Your app will be live at `your-project.vercel.app`
- Database is automatically connected
- All environment variables are set
- HTTPS is enabled by default

## Next Steps

After successful setup:

1. **Customize the design**: Edit colors in `globals.css`
2. **Add authentication**: Implement user login/register
3. **Rich text editor**: Replace textarea with a WYSIWYG editor
4. **Image uploads**: Add image upload functionality
5. **Search**: Implement post search feature
6. **Comments**: Add a commenting system
7. **Analytics**: Track page views and engagement

## Support

If you encounter issues:
- Check the README.md for detailed documentation
- Review the API routes in `app/api/posts/`
- Verify database schema matches `schema.sql`
- Check Vercel logs for deployment issues

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)
