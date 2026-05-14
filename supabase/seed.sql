-- Supabase Seed Data
-- For Nuxt Mkdirs Navigation Site
-- Run this SQL in Supabase SQL Editor AFTER running schema.sql
-- NOTE: Users are managed via Supabase Auth, NOT via this seed file.
--       Create test users in Supabase Dashboard > Authentication.

-- ============================================================================
-- STEP 1: CREATE TEST USERS IN SUPABASE AUTH (IMPORTANT!)
-- ============================================================================
-- Before running this seed file:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Create these 3 test users (or use your own):
--    - admin@example.com (password: whatever you want)
--    - john@example.com (password: whatever you want) 
--    - jane@example.com (password: whatever you want)
-- 3. After creating users, COPY THEIR USER IDS (UUIDs)
-- 4. UPDATE the UUIDs below in this seed file before running!
-- 5. Also run the UPDATE auth.users queries below to set roles!

-- Set admin role (run this after creating users):
/*
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role":"ADMIN","name":"Admin User"}' 
WHERE email = 'admin@example.com';

UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role":"USER","name":"John Doe"}' 
WHERE email = 'john@example.com';

UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role":"USER","name":"Jane Smith"}' 
WHERE email = 'jane@example.com';
*/

-- ============================================================================
-- REPLACE THESE UUIDS WITH YOUR REAL USER IDS FROM SUPABASE AUTH!
-- ============================================================================
-- Get your user IDs from: Supabase Dashboard > Authentication > Users
-- Copy each user's UUID and paste them below:
\set admin_user_id '11111111-1111-1111-1111-111111111111'
\set user1_id '22222222-2222-2222-2222-222222222222'
\set user2_id '33333333-3333-3333-3333-333333333333'

-- If \set doesn't work in your SQL editor, replace ALL occurrences 
-- of :'admin_user_id', :'user1_id', :'user2_id' with your actual UUIDs!

-- ============================================================================
-- OPTIONAL: CLEAR EXISTING DATA
-- ============================================================================
-- DELETE FROM item_collections;
-- DELETE FROM item_tags;
-- DELETE FROM item_categories;
-- DELETE FROM blog_post_categories;
-- DELETE FROM blog_post_related;
-- DELETE FROM orders;
-- DELETE FROM items;
-- DELETE FROM blog_posts;
-- DELETE FROM collections;
-- DELETE FROM tags;
-- DELETE FROM categories;
-- DELETE FROM groups;
-- DELETE FROM subscribers;
-- DELETE FROM pages;
-- DELETE FROM settings;

-- ============================================================================
-- GROUPS
-- ============================================================================
INSERT INTO groups (id, name, slug, description, priority) VALUES
('a1111111-1111-1111-1111-111111111111', 'Development Tools', 'development-tools', 'Tools for software development and programming', 100),
('a2222222-2222-2222-2222-222222222222', 'Productivity', 'productivity', 'Tools to boost your productivity', 90),
('a3333333-3333-3333-3333-333333333333', 'Design Tools', 'design-tools', 'Design and creative tools', 80);

-- ============================================================================
-- CATEGORIES
-- ============================================================================
INSERT INTO categories (id, name, slug, description, group_id, priority) VALUES
('b1111111-1111-1111-1111-111111111111', 'Frontend', 'frontend', 'Frontend frameworks and libraries', 'a1111111-1111-1111-1111-111111111111', 100),
('b2222222-2222-2222-2222-222222222222', 'Backend', 'backend', 'Backend frameworks and servers', 'a1111111-1111-1111-1111-111111111111', 90),
('b3333333-3333-3333-3333-333333333333', 'Database', 'database', 'Databases and data storage', 'a1111111-1111-1111-1111-111111111111', 80),
('b4444444-4444-4444-4444-444444444444', 'AI Tools', 'ai-tools', 'Artificial intelligence and ML tools', 'a2222222-2222-2222-2222-222222222222', 100),
('b5555555-5555-5555-5555-555555555555', 'Note Taking', 'note-taking', 'Notes and knowledge management', 'a2222222-2222-2222-2222-222222222222', 90),
('b6666666-6666-6666-6666-666666666666', 'UI Design', 'ui-design', 'User interface design tools', 'a3333333-3333-3333-3333-333333333333', 100);

-- ============================================================================
-- TAGS
-- ============================================================================
INSERT INTO tags (id, name, slug, description) VALUES
('c1111111-1111-1111-1111-111111111111', 'JavaScript', 'javascript', 'JavaScript programming language'),
('c2222222-2222-2222-2222-222222222222', 'TypeScript', 'typescript', 'TypeScript programming language'),
('c3333333-3333-3333-3333-333333333333', 'Python', 'python', 'Python programming language'),
('c4444444-4444-4444-4444-444444444444', 'Open Source', 'open-source', 'Open source projects'),
('c5555555-5555-5555-5555-555555555555', 'Free', 'free', 'Free to use'),
('c6666666-6666-6666-6666-666666666666', 'AI', 'ai', 'Artificial intelligence');

-- ============================================================================
-- COLLECTIONS
-- ============================================================================
INSERT INTO collections (id, name, slug, description, icon_url, icon_alt, priority) VALUES
('d1111111-1111-1111-1111-111111111111', 'Trending', 'trending', 'Most popular tools this month', 'https://api.iconify.design/trophy.json?color=%23f59e0b', 'Trophy icon', 100),
('d2222222-2222-2222-2222-222222222222', 'New Arrivals', 'new-arrivals', 'Recently added tools', 'https://api.iconify.design/sparkles.json?color=%2310b981', 'Sparkles icon', 90),
('d3333333-3333-3333-3333-333333333333', 'Must Have', 'must-have', 'Essential tools for developers', 'https://api.iconify.design/star.json?color=%23ef4444', 'Star icon', 80);

-- ============================================================================
-- ITEMS (Navigation Items)
-- NOTE: Remember to replace the submitter_id with your actual user IDs!
-- ============================================================================
INSERT INTO items (id, name, slug, link, affiliate_link, description, introduction, image_url, image_alt, icon_url, icon_alt, featured, sponsor, sponsor_start_date, sponsor_end_date, publish_date, price_plan, free_plan_status, pro_plan_status, sponsor_plan_status, paid, submitter_id) VALUES
('e1111111-1111-1111-1111-111111111111', 'Vue.js', 'vuejs', 'https://vuejs.org', NULL, 'The Progressive JavaScript Framework', 'Vue.js is a progressive framework for building user interfaces. It is designed from the ground up to be incrementally adoptable.', 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800', 'Vue.js logo', NULL, NULL, TRUE, TRUE, NOW(), NOW() + INTERVAL '30 days', NOW(), 'sponsor', 'approved', 'success', 'success', TRUE, :'admin_user_id'),
('e2222222-2222-2222-2222-222222222222', 'React', 'react', 'https://react.dev', NULL, 'The library for web and native user interfaces', 'React lets you build user interfaces out of individual pieces called components.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', 'React logo', NULL, NULL, TRUE, FALSE, NULL, NULL, NOW(), 'free', 'approved', 'submitting', 'submitting', FALSE, :'user1_id'),
('e3333333-3333-3333-3333-333333333333', 'Next.js', 'nextjs', 'https://nextjs.org', NULL, 'The React Framework for the Web', 'Next.js enables you to create full-stack Web applications by extending the latest React features.', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800', 'Next.js logo', NULL, NULL, TRUE, TRUE, NOW(), NOW() + INTERVAL '15 days', NOW(), 'pro', 'approved', 'success', 'success', TRUE, :'admin_user_id'),
('e4444444-4444-4444-4444-444444444444', 'Nuxt', 'nuxt', 'https://nuxt.com', NULL, 'The Intuitive Vue Framework', 'Nuxt is an open source framework that makes web development simple and powerful.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', 'Nuxt logo', NULL, NULL, FALSE, FALSE, NULL, NULL, NOW(), 'free', 'pending', 'submitting', 'submitting', FALSE, :'user2_id'),
('e5555555-5555-5555-5555-555555555555', 'TypeScript', 'typescript', 'https://www.typescriptlang.org', NULL, 'JavaScript with syntax for types', 'TypeScript is a strongly typed programming language that builds on JavaScript.', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800', 'TypeScript logo', NULL, NULL, FALSE, FALSE, NULL, NULL, NOW(), 'free', 'approved', 'submitting', 'submitting', FALSE, :'user1_id'),
('e6666666-6666-6666-6666-666666666666', 'Tailwind CSS', 'tailwindcss', 'https://tailwindcss.com', NULL, 'A utility-first CSS framework', 'Tailwind CSS is a utility-first CSS framework for rapidly building custom designs.', 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800', 'Tailwind CSS logo', NULL, NULL, TRUE, TRUE, NOW(), NOW() + INTERVAL '20 days', NOW(), 'sponsor', 'approved', 'success', 'success', TRUE, :'admin_user_id'),
('e7777777-7777-7777-7777-777777777777', 'PostgreSQL', 'postgresql', 'https://www.postgresql.org', NULL, 'The worlds most advanced open source database', 'PostgreSQL is a powerful, open source object-relational database system.', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800', 'PostgreSQL logo', NULL, NULL, FALSE, FALSE, NULL, NULL, NOW(), 'free', 'approved', 'submitting', 'submitting', FALSE, :'user2_id'),
('e8888888-8888-8888-8888-888888888888', 'Supabase', 'supabase', 'https://supabase.com', NULL, 'The open source Firebase alternative', 'Supabase is an open source Firebase alternative providing all the backend services you need.', 'https://images.unsplash.com/photo-1565473227480-2a9f7dc27c4c?w=800', 'Supabase logo', NULL, NULL, TRUE, FALSE, NULL, NULL, NOW(), 'free', 'approved', 'submitting', 'submitting', FALSE, :'user1_id'),
('e9999999-9999-9999-9999-999999999999', 'ChatGPT', 'chatgpt', 'https://chat.openai.com', NULL, 'AI conversational assistant', 'ChatGPT is an AI assistant designed to help with a wide range of tasks.', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', 'ChatGPT logo', NULL, NULL, TRUE, TRUE, NOW(), NOW() + INTERVAL '30 days', NOW(), 'sponsor', 'approved', 'success', 'success', TRUE, :'admin_user_id'),
('eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Figma', 'figma', 'https://figma.com', NULL, 'The collaborative interface design tool', 'Figma is a collaborative web application for interface design and prototyping.', 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800', 'Figma logo', NULL, NULL, FALSE, FALSE, NULL, NULL, NOW(), 'pro', 'approved', 'success', 'submitting', TRUE, :'admin_user_id'),
('ebbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Obsidian', 'obsidian', 'https://obsidian.md', NULL, 'A second brain for you', 'Obsidian is a powerful knowledge base that works on top of your local folder of plain text Markdown files.', 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800', 'Obsidian logo', NULL, NULL, FALSE, FALSE, NULL, NULL, NOW(), 'free', 'approved', 'submitting', 'submitting', FALSE, :'user2_id'),
('eccccccc-cccc-cccc-cccc-cccccccccccc', 'Notion', 'notion', 'https://notion.so', NULL, 'The connected workspace', 'Notion is a workspace for your notes, tasks, wikis, and databases.', 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800', 'Notion logo', NULL, NULL, TRUE, FALSE, NULL, NULL, NOW(), 'pro', 'approved', 'success', 'submitting', TRUE, :'user1_id');

-- ============================================================================
-- ITEM-CATEGORIES JUNCTION
-- ============================================================================
INSERT INTO item_categories (item_id, category_id) VALUES
('e1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111'),
('e2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111'),
('e3333333-3333-3333-3333-333333333333', 'b1111111-1111-1111-1111-111111111111'),
('e4444444-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111'),
('e5555555-5555-5555-5555-555555555555', 'b1111111-1111-1111-1111-111111111111'),
('e5555555-5555-5555-5555-555555555555', 'b2222222-2222-2222-2222-222222222222'),
('e6666666-6666-6666-6666-666666666666', 'b1111111-1111-1111-1111-111111111111'),
('e7777777-7777-7777-7777-777777777777', 'b3333333-3333-3333-3333-333333333333'),
('e8888888-8888-8888-8888-888888888888', 'b3333333-3333-3333-3333-333333333333'),
('e8888888-8888-8888-8888-888888888888', 'b2222222-2222-2222-2222-222222222222'),
('e9999999-9999-9999-9999-999999999999', 'b4444444-4444-4444-4444-444444444444'),
('eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b6666666-6666-6666-6666-666666666666'),
('ebbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b5555555-5555-5555-5555-555555555555'),
('eccccccc-cccc-cccc-cccc-cccccccccccc', 'b5555555-5555-5555-5555-555555555555');

-- ============================================================================
-- ITEM-TAGS JUNCTION
-- ============================================================================
INSERT INTO item_tags (item_id, tag_id) VALUES
('e1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111'),
('e1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222'),
('e1111111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444'),
('e2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111'),
('e2222222-2222-2222-2222-222222222222', 'c4444444-4444-4444-4444-444444444444'),
('e2222222-2222-2222-2222-222222222222', 'c5555555-5555-5555-5555-555555555555'),
('e3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111'),
('e3333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222'),
('e4444444-4444-4444-4444-444444444444', 'c1111111-1111-1111-1111-111111111111'),
('e4444444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222'),
('e5555555-5555-5555-5555-555555555555', 'c2222222-2222-2222-2222-222222222222'),
('e6666666-6666-6666-6666-666666666666', 'c1111111-1111-1111-1111-111111111111'),
('e6666666-6666-6666-6666-666666666666', 'c4444444-4444-4444-4444-444444444444'),
('e7777777-7777-7777-7777-777777777777', 'c3333333-3333-3333-3333-333333333333'),
('e7777777-7777-7777-7777-777777777777', 'c4444444-4444-4444-4444-444444444444'),
('e8888888-8888-8888-8888-888888888888', 'c1111111-1111-1111-1111-111111111111'),
('e8888888-8888-8888-8888-888888888888', 'c4444444-4444-4444-4444-444444444444'),
('e9999999-9999-9999-9999-999999999999', 'c4444444-4444-4444-4444-444444444444'),
('e9999999-9999-9999-9999-999999999999', 'c6666666-6666-6666-6666-666666666666'),
('eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c4444444-4444-4444-4444-444444444444'),
('ebbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c4444444-4444-4444-4444-444444444444'),
('eccccccc-cccc-cccc-cccc-cccccccccccc', 'c4444444-4444-4444-4444-444444444444');

-- ============================================================================
-- ITEM-COLLECTIONS JUNCTION
-- ============================================================================
INSERT INTO item_collections (item_id, collection_id) VALUES
('e1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111'),
('e1111111-1111-1111-1111-111111111111', 'd3333333-3333-3333-3333-333333333333'),
('e2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111'),
('e2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222'),
('e3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111'),
('e3333333-3333-3333-3333-333333333333', 'd3333333-3333-3333-3333-333333333333'),
('e4444444-4444-4444-4444-444444444444', 'd2222222-2222-2222-2222-222222222222'),
('e6666666-6666-6666-6666-666666666666', 'd3333333-3333-3333-3333-333333333333'),
('e8888888-8888-8888-8888-888888888888', 'd2222222-2222-2222-2222-222222222222'),
('e9999999-9999-9999-9999-999999999999', 'd1111111-1111-1111-1111-111111111111'),
('eccccccc-cccc-cccc-cccc-cccccccccccc', 'd3333333-3333-3333-3333-333333333333');

-- ============================================================================
-- BLOG CATEGORIES
-- ============================================================================
INSERT INTO blog_categories (id, name, slug, description, priority) VALUES
('61111111-1111-1111-1111-111111111111', 'Tutorials', 'tutorials', 'Step-by-step guides and tutorials', 100),
('62222222-2222-2222-2222-222222222222', 'News', 'news', 'Latest news and updates', 90),
('63333333-3333-3333-3333-333333333333', 'Tips & Tricks', 'tips-tricks', 'Useful tips and tricks', 80);

-- ============================================================================
-- BLOG POSTS
-- NOTE: Remember to replace author_id with your actual user IDs!
-- ============================================================================
INSERT INTO blog_posts (id, title, slug, excerpt, featured, body, image_url, image_alt, publish_date, author_id) VALUES
('71111111-1111-1111-1111-111111111111', 'Getting Started with Vue 3', 'getting-started-with-vue-3', 'Learn how to build modern web applications with Vue 3', TRUE, '<p>Vue 3 is the latest version of the Vue framework. In this tutorial, we will learn how to get started with Vue 3 and build our first application.</p><h2>Installation</h2><p>First, let us create a new Vue 3 project using the CLI.</p>', 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800', 'Vue 3 tutorial', NOW() - INTERVAL '5 days', :'admin_user_id'),
('72222222-2222-2222-2222-222222222222', 'Why Supabase is the Future of Backend', 'why-supabase-is-the-future', 'Exploring Supabase as an open source Firebase alternative', TRUE, '<p>Supabase is an open source Firebase alternative that provides a complete backend solution. Let us explore why it is gaining so much popularity.</p>', 'https://images.unsplash.com/photo-1565473227480-2a9f7dc27c4c?w=800', 'Supabase illustration', NOW() - INTERVAL '3 days', :'user1_id'),
('73333333-3333-3333-3333-333333333333', '10 VS Code Extensions You Need in 2024', 'vscode-extensions-2024', 'Must-have VS Code extensions for developers', FALSE, '<p>Visual Studio Code is one of the most popular code editors. Here are the top 10 extensions you should install.</p>', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', 'VS Code', NOW() - INTERVAL '1 day', :'admin_user_id'),
('74444444-4444-4444-4444-444444444444', 'Understanding TypeScript Generics', 'understanding-typescript-generics', 'A deep dive into TypeScript generics', FALSE, '<p>Generics are one of the most powerful features in TypeScript. Let us understand how to use them effectively.</p>', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800', 'TypeScript', NOW(), :'user2_id');

-- ============================================================================
-- BLOG POST-CATEGORIES JUNCTION
-- ============================================================================
INSERT INTO blog_post_categories (blog_post_id, blog_category_id) VALUES
('71111111-1111-1111-1111-111111111111', '61111111-1111-1111-1111-111111111111'),
('72222222-2222-2222-2222-222222222222', '62222222-2222-2222-2222-222222222222'),
('73333333-3333-3333-3333-333333333333', '63333333-3333-3333-3333-333333333333'),
('74444444-4444-4444-4444-444444444444', '61111111-1111-1111-1111-111111111111');

-- ============================================================================
-- BLOG POST-RELATED JUNCTION
-- ============================================================================
INSERT INTO blog_post_related (blog_post_id, related_post_id) VALUES
('71111111-1111-1111-1111-111111111111', '72222222-2222-2222-2222-222222222222'),
('71111111-1111-1111-1111-111111111111', '74444444-4444-4444-4444-444444444444'),
('72222222-2222-2222-2222-222222222222', '71111111-1111-1111-1111-111111111111');

-- ============================================================================
-- ORDERS
-- NOTE: Remember to replace user_id with your actual user IDs!
-- ============================================================================
INSERT INTO orders (id, user_id, item_id, status, payment_provider, payment_id, amount, currency, created_at) VALUES
('81111111-1111-1111-1111-111111111111', :'user1_id', 'e3333333-3333-3333-3333-333333333333', 'success', 'creem', 'creem_payment_123', 29.99, 'USD', NOW() - INTERVAL '10 days'),
('82222222-2222-2222-2222-222222222222', :'user2_id', 'e6666666-6666-6666-6666-666666666666', 'success', 'creem', 'creem_payment_456', 49.99, 'USD', NOW() - INTERVAL '5 days'),
('83333333-3333-3333-3333-333333333333', :'user1_id', 'eccccccc-cccc-cccc-cccc-cccccccccccc', 'success', 'creem', 'creem_payment_789', 19.99, 'USD', NOW() - INTERVAL '2 days');

-- Update items with order references
UPDATE items SET order_id = '81111111-1111-1111-1111-111111111111' WHERE id = 'e3333333-3333-3333-3333-333333333333';
UPDATE items SET order_id = '82222222-2222-2222-2222-222222222222' WHERE id = 'e6666666-6666-6666-6666-666666666666';

-- ============================================================================
-- SUBSCRIBERS
-- ============================================================================
INSERT INTO subscribers (id, email, status, source, metadata, created_at, updated_at) VALUES
('91111111-1111-1111-1111-111111111111', 'subscriber1@example.com', 'active', 'website', '{"name": "Subscriber One"}', NOW(), NOW()),
('92222222-2222-2222-2222-222222222222', 'subscriber2@example.com', 'active', 'website', '{"name": "Subscriber Two"}', NOW(), NOW()),
('93333333-3333-3333-3333-333333333333', 'subscriber3@example.com', 'active', 'newsletter', '{"name": "Subscriber Three"}', NOW(), NOW());

-- ============================================================================
-- PAGES
-- ============================================================================
INSERT INTO pages (id, title, slug, excerpt, body, publish_date) VALUES
('a1111111-1111-1111-1111-111111111111', 'Privacy Policy', 'privacy-policy', 'Our privacy policy', '<h1>Privacy Policy</h1><p>This is our privacy policy page content.</p>', NOW()),
('a2222222-2222-2222-2222-222222222222', 'Terms of Service', 'terms-of-service', 'Our terms of service', '<h1>Terms of Service</h1><p>These are our terms of service.</p>', NOW()),
('a3333333-3333-3333-3333-333333333333', 'About Us', 'about-us', 'Learn more about us', '<h1>About Us</h1><p>We are a team passionate about building great tools for developers.</p>', NOW());

-- ============================================================================
-- SETTINGS
-- ============================================================================
INSERT INTO settings (id, key, value) VALUES
('b1111111-1111-1111-1111-111111111111', 'site_name', '{"value": "Nuxt Mkdirs"}'),
('b2222222-2222-2222-2222-222222222222', 'site_description', '{"value": "A curated collection of the best tools for developers"}'),
('b3333333-3333-3333-3333-333333333333', 'social_links', '{"value": {"twitter": "https://twitter.com", "github": "https://github.com"}}'),
('b4444444-4444-4444-4444-444444444444', 'featured_items_limit', '{"value": 10}'),
('b5555555-5555-5555-5555-555555555555', 'items_per_page', '{"value": 12}');

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
SELECT '✅ Seed data insertion complete! If you see this message, everything worked!' AS message;
