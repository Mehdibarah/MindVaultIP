-- MindVaultIP Chat System Database Schema
-- This file contains the SQL schema for the real-time chat feature

-- Messages table for storing chat messages
create table if not exists messages (
  id bigint generated always as identity primary key,
  room_id text not null,
  sender text not null,
  text text not null,
  created_at timestamp with time zone default now()
);

-- Index for efficient querying by room and time
create index if not exists idx_messages_room_created on messages(room_id, created_at desc);

-- Row Level Security (RLS) policies
-- Note: These are basic policies for demo purposes. 
-- In production, you should implement proper authentication with SIWE (Sign-In with Ethereum)
alter table messages enable row level security;

-- Drop existing policies if they exist
drop policy if exists p_messages_read on messages;
drop policy if exists p_messages_insert on messages;

-- Allow anyone to read messages (for demo purposes)
create policy p_messages_read on messages for select using (true);

-- Allow anyone to insert messages (for demo purposes)
create policy p_messages_insert on messages for insert with check (true);

-- Optional: Add a function to clean up old messages (older than 30 days)
create or replace function cleanup_old_messages()
returns void as $$
begin
  delete from messages 
  where created_at < now() - interval '30 days';
end;
$$ language plpgsql;

-- Optional: Create a scheduled job to run cleanup (requires pg_cron extension)
-- select cron.schedule('cleanup-messages', '0 2 * * *', 'select cleanup_old_messages();');

-- Example queries for testing:

-- Insert a test message
-- insert into messages (room_id, sender, text) 
-- values ('global', '0x1234567890123456789012345678901234567890', 'Hello, world!');

-- Get recent messages from global room
-- select * from messages 
-- where room_id = 'global' 
-- order by created_at desc 
-- limit 10;

-- Get messages between two specific addresses (DM room)
-- select * from messages 
-- where room_id = '0x...' -- DM room ID computed from two addresses
-- order by created_at desc 
-- limit 50;
