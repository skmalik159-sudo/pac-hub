-- =====================================================
-- PAC HUB — Supabase Database Setup
-- Ye poora script Supabase Dashboard -> SQL Editor mein
-- paste karke "Run" karen. Ek hi baar chalana hai.
-- =====================================================

-- 1. PROFILES TABLE (members)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  username text unique not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- 2. POSTS TABLE (discussion, buysell, jobs, services, rentals, vehicles)
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  title text,
  price text,
  location text,
  route text,
  body text,
  image_url text,
  author_id uuid references auth.users(id) on delete cascade,
  author_name text not null,
  author_username text not null,
  created_at timestamptz default now()
);

alter table posts enable row level security;

create policy "Posts are viewable by everyone"
  on posts for select
  using (true);

create policy "Logged in users can create posts"
  on posts for insert
  with check (auth.uid() = author_id);

create policy "Users can delete their own posts"
  on posts for delete
  using (auth.uid() = author_id);

create index if not exists posts_category_idx on posts (category, created_at desc);

-- 3. STORAGE BUCKET for post images
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

create policy "Post images are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "Logged in users can upload post images"
  on storage.objects for insert
  with check (bucket_id = 'post-images' and auth.role() = 'authenticated');

-- =====================================================
-- IMPORTANT: Supabase Dashboard mein ye setting bhi karen:
-- Authentication -> Providers -> Email ->
-- "Confirm email" ko OFF kar den (kyunke hum fake/internal
-- email addresses use kar rahe hain jahan user ko real
-- confirmation email nahi mil sakta).
-- =====================================================
