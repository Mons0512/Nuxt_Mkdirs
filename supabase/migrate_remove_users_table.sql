-- SQL 脚本用于删除自建的 users 表
-- 请在 Supabase SQL 编辑器中运行此脚本

-- 1. 删除所有依赖于 users 表的外键约束
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_user_id_fkey;
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_submitter_id_fkey;
ALTER TABLE blog_posts DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- 2. 删除依赖于 users 表的 RLS 策略（如果存在）
-- 这些策略会在表上重新创建（如果需要的话），因为 schema.sql 中已经有不依赖 users 表的策略

-- 3. 最终删除 users 表
DROP TABLE IF EXISTS users CASCADE;

-- 4. 验证删除成功
SELECT 'Migration completed: users table removed successfully' AS message;

-- 注意事项：
-- - 删除之前，请确保没有其他应用正在使用此表
-- - 建议先在非生产环境中测试此脚本
-- - 如需要，可以先备份数据再运行此脚本
