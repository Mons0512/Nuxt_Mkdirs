-- Supabase Database Schema
-- For Nuxt Mkdirs Navigation Site
-- Run this SQL in Supabase SQL Editor to create all tables
-- NOTE: We use Supabase Auth for user management, no separate users table needed
-- User metadata (role, name, etc.) is stored in auth.users table via user_metadata

-- ============================================================================
-- GROUPS TABLE (Group of categories)
-- ============================================================================
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TAGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COLLECTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    icon_alt TEXT,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ITEMS TABLE (Core navigation items)
-- ============================================================================
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    link TEXT,
    affiliate_link TEXT,
    description TEXT,
    introduction TEXT,
    image_url TEXT,
    image_alt TEXT,
    icon_url TEXT,
    icon_alt TEXT,
    featured BOOLEAN DEFAULT FALSE,
    sponsor BOOLEAN DEFAULT FALSE,
    sponsor_start_date TIMESTAMPTZ,
    sponsor_end_date TIMESTAMPTZ,
    publish_date TIMESTAMPTZ,
    price_plan TEXT DEFAULT 'free' CHECK (price_plan IN ('free', 'pro', 'sponsor')),
    free_plan_status TEXT DEFAULT 'submitting' CHECK (free_plan_status IN ('submitting', 'pending', 'approved', 'rejected')),
    pro_plan_status TEXT DEFAULT 'submitting' CHECK (pro_plan_status IN ('submitting', 'pending', 'success', 'failed')),
    sponsor_plan_status TEXT DEFAULT 'submitting' CHECK (sponsor_plan_status IN ('submitting', 'pending', 'success', 'failed')),
    rejection_reason TEXT,
    paid BOOLEAN DEFAULT FALSE,
    force_hidden BOOLEAN DEFAULT FALSE,
    note TEXT,
    submitter_id UUID, -- References auth.users(id)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ITEM-CATEGORIES JUNCTION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS item_categories (
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (item_id, category_id)
);

-- ============================================================================
-- ITEM-TAGS JUNCTION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS item_tags (
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (item_id, tag_id)
);

-- ============================================================================
-- ITEM-COLLECTIONS JUNCTION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS item_collections (
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    PRIMARY KEY (item_id, collection_id)
);

-- ============================================================================
-- BLOG CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BLOG POSTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    featured BOOLEAN DEFAULT FALSE,
    body TEXT,
    image_url TEXT,
    image_alt TEXT,
    publish_date TIMESTAMPTZ,
    author_id UUID, -- References auth.users(id)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BLOG POST-CATEGORIES JUNCTION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_post_categories (
    blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    blog_category_id UUID NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, blog_category_id)
);

-- ============================================================================
-- BLOG POST-RELATED JUNCTION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_post_related (
    blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    related_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, related_post_id)
);

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth.users(id)
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
    payment_provider TEXT,
    payment_id TEXT,
    amount DECIMAL(10, 2),
    currency TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add order_id foreign key to items table (after orders table is created)
ALTER TABLE items ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE SET NULL;

-- ============================================================================
-- SUBSCRIBERS TABLE (Newsletter)
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    source TEXT DEFAULT 'website',
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PAGES TABLE (Static pages like privacy, terms)
-- ============================================================================
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    body TEXT,
    publish_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Helper function to check if current user is ADMIN
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.jwt() ->> 'role' = 'ADMIN') OR 
           (auth.jwt() ->> 'user_metadata' ->> 'role' = 'ADMIN');
END;
$$ LANGUAGE plpgsql;

-- Items table RLS
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published items" ON items;
CREATE POLICY "Anyone can view published items" ON items FOR SELECT USING (
    publish_date IS NOT NULL AND force_hidden = FALSE
);
DROP POLICY IF EXISTS "Users can view own submissions" ON items;
CREATE POLICY "Users can view own submissions" ON items FOR SELECT USING (
    submitter_id = auth.uid() OR is_admin()
);
DROP POLICY IF EXISTS "Authenticated users can create items" ON items;
CREATE POLICY "Authenticated users can create items" ON items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Users can update own items" ON items;
CREATE POLICY "Users can update own items" ON items FOR UPDATE USING (
    submitter_id = auth.uid() OR is_admin()
);
DROP POLICY IF EXISTS "Only admins can delete items" ON items;
CREATE POLICY "Only admins can delete items" ON items FOR DELETE USING (is_admin());

-- Categories table RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access" ON categories;
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (is_admin());

-- Tags table RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access" ON tags;
CREATE POLICY "Public read access" ON tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage tags" ON tags;
CREATE POLICY "Admins can manage tags" ON tags FOR ALL USING (is_admin());

-- Groups table RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access" ON groups;
CREATE POLICY "Public read access" ON groups FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage groups" ON groups;
CREATE POLICY "Admins can manage groups" ON groups FOR ALL USING (is_admin());

-- Collections table RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access" ON collections;
CREATE POLICY "Public read access" ON collections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage collections" ON collections;
CREATE POLICY "Admins can manage collections" ON collections FOR ALL USING (is_admin());

-- Blog posts table RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view published posts" ON blog_posts;
CREATE POLICY "Anyone can view published posts" ON blog_posts FOR SELECT USING (
    publish_date IS NOT NULL
);
DROP POLICY IF EXISTS "Authors can manage own posts" ON blog_posts;
CREATE POLICY "Authors can manage own posts" ON blog_posts FOR ALL USING (
    author_id = auth.uid() OR is_admin()
);

-- Blog categories table RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access" ON blog_categories;
CREATE POLICY "Public read access" ON blog_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage blog categories" ON blog_categories;
CREATE POLICY "Admins can manage blog categories" ON blog_categories FOR ALL USING (is_admin());

-- Subscribers table RLS
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can subscribe" ON subscribers;
CREATE POLICY "Public can subscribe" ON subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can manage subscribers" ON subscribers;
CREATE POLICY "Admins can manage subscribers" ON subscribers FOR ALL USING (is_admin());

-- Orders table RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (is_admin());

-- Pages table RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access" ON pages;
CREATE POLICY "Public read access" ON pages FOR SELECT USING (publish_date IS NOT NULL);
DROP POLICY IF EXISTS "Admins can manage pages" ON pages;
CREATE POLICY "Admins can manage pages" ON pages FOR ALL USING (is_admin());

-- Settings table RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view settings" ON settings;
CREATE POLICY "Public can view settings" ON settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage settings" ON settings;
CREATE POLICY "Admins can manage settings" ON settings FOR ALL USING (is_admin());

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Items indexes
CREATE INDEX IF NOT EXISTS idx_items_slug ON items(slug);
CREATE INDEX IF NOT EXISTS idx_items_publish_date ON items(publish_date) WHERE publish_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_items_featured ON items(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_items_submitter ON items(submitter_id);
CREATE INDEX IF NOT EXISTS idx_items_price_plan ON items(price_plan);
CREATE INDEX IF NOT EXISTS idx_items_free_plan_status ON items(free_plan_status);

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_group ON categories(group_id);
CREATE INDEX IF NOT EXISTS idx_categories_priority ON categories(priority DESC);

-- Tags indexes
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- Groups indexes
CREATE INDEX IF NOT EXISTS idx_groups_slug ON groups(slug);
CREATE INDEX IF NOT EXISTS idx_groups_priority ON groups(priority DESC);

-- Collections indexes
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_priority ON collections(priority DESC);

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON blog_posts(publish_date) WHERE publish_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);

-- Blog categories indexes
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_priority ON blog_categories(priority DESC);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_item ON orders(item_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Subscribers indexes
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);

-- Pages indexes
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_publish_date ON pages(publish_date) WHERE publish_date IS NOT NULL;

-- Junction tables indexes
CREATE INDEX IF NOT EXISTS idx_item_categories_item ON item_categories(item_id);
CREATE INDEX IF NOT EXISTS idx_item_categories_category ON item_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_item_tags_item ON item_tags(item_id);
CREATE INDEX IF NOT EXISTS idx_item_tags_tag ON item_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_item_collections_item ON item_collections(item_id);
CREATE INDEX IF NOT EXISTS idx_item_collections_collection ON item_collections(collection_id);

-- ============================================================================
-- STORAGE BUCKETS (Run in Supabase Dashboard or via API)
-- ============================================================================
-- The following buckets should be created in Supabase Dashboard:
-- 1. images - for item/blog images (public)
-- 2. icons - for item icons (public)
-- 3. avatars - for user avatars (public)
--
-- To create via SQL, use the Supabase Storage API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
-- Schema creation complete!
-- Next steps:
-- 1. Create storage buckets in Supabase Dashboard > Storage
-- 2. Update your .env file with Supabase credentials
-- 3. Start building your application
-- 4. For user management, all data is stored in auth.users user_metadata:
--    - name, avatar_url, role, etc. can be set via Supabase Auth API
-- 5. To set a user as ADMIN, update their user_metadata in Supabase Dashboard or via API
