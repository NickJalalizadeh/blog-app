-- Create the posts table in your Vercel Postgres database
-- You can run this SQL in the Vercel dashboard or via psql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  featured_image TEXT,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Create an index on published_at for sorting
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);

-- Sample data (optional)
INSERT INTO posts (title, slug, summary, content, author, featured_image) VALUES
(
  'Welcome to The Chronicle',
  'welcome-to-the-chronicle',
  'Introducing our new blogging platform built with modern web technologies. Discover what makes The Chronicle different and how we''re reimagining content creation.',
  'Welcome to The Chronicle, a thoughtfully crafted blogging platform that puts your words first. We believe in the power of long-form writing and the importance of creating a beautiful, distraction-free reading experience.

Our platform is built on cutting-edge technology: Next.js for blazing-fast performance, React for interactive interfaces, and TypeScript for reliability. But technology is just the foundation. What really matters is how we use it to elevate your stories.

Every post on The Chronicle is designed to be a pleasure to read. From the carefully chosen typography to the generous white space, every detail has been considered. We want your readers to lose themselves in your words, not in cluttered interfaces.

Getting started is simple. Create your first post, share your ideas, and join our community of writers who value quality over quantity. Whether you''re sharing technical insights, personal essays, or creative fiction, The Chronicle is your canvas.

Welcome aboard. We can''t wait to see what you create.',
  'The Chronicle Team',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop'
),
(
  'The Art of Writing in the Digital Age',
  'the-art-of-writing-in-the-digital-age',
  'In an era of endless scrolling and bite-sized content, long-form writing remains a powerful medium for deep thinking and meaningful connection.',
  'The internet has transformed how we write and read. Social media trained us to think in tweets and status updates. But something important gets lost when we compress every thought into 280 characters.

Long-form writing allows for nuance. It gives us space to explore ideas thoroughly, to build arguments carefully, to tell stories that breathe. When we write long-form, we''re not just sharing information—we''re inviting readers into our thought process.

The digital age hasn''t killed long-form content; it has made it more valuable. In a world of quick takes and hot takes, a well-researched, thoughtfully written article stands out. It demonstrates that the author cares enough to do the work.

Good writing in the digital age requires the same skills it always has: clarity, structure, voice. But it also requires understanding your medium. Online readers scan before they read. They appreciate clear headings, short paragraphs, and white space. They want substance, but they also want accessibility.

The key is finding the balance. Write with depth, but make your depth accessible. Take time to craft your sentences, but respect your reader''s time. Be thorough, but be clear.

In the end, great writing transcends the medium. Whether on paper or screen, it''s about connecting with readers through words that matter.',
  'Sarah Chen',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=600&fit=crop'
),
(
  'Building a Better Web, One Component at a Time',
  'building-a-better-web-one-component-at-a-time',
  'Modern web development is about composability and reusability. Learn how component-driven design is reshaping how we build for the web.',
  'The evolution of web development has been remarkable. We''ve gone from static HTML pages to dynamic, interactive applications that rival native software in functionality and user experience.

At the heart of this evolution is the concept of components. Instead of building monolithic applications, we now build collections of small, reusable pieces that snap together like LEGO blocks. Each component has a single responsibility, a clear interface, and can be used across different parts of an application.

This component-driven approach has several advantages. First, it encourages code reuse. Build a button component once, use it everywhere. Second, it makes testing easier. Small, focused components are simpler to test than large, complex systems. Third, it improves maintainability. When everything is broken down into discrete units, fixing bugs and adding features becomes more manageable.

Modern frameworks like React, Vue, and Svelte have embraced this philosophy wholeheartedly. They provide the tools and patterns needed to build component-driven applications efficiently. Type systems like TypeScript add an additional layer of safety, catching errors before they reach production.

But components are more than just a technical pattern. They represent a way of thinking about user interfaces. When we design in components, we''re forced to think about reusability, consistency, and the relationships between different parts of our interface.

The best part? This approach scales. Whether you''re building a small blog or a complex web application, thinking in components will serve you well. It''s not just about better code—it''s about building a better web.',
  'Alex Rodriguez',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop'
);