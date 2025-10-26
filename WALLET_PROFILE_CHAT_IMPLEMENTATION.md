# Wallet-Based Profile & DM Chat Implementation

## Overview
This implementation adds wallet-based profile management and direct messaging (DM) chat functionality to the MindVaultIP application using Supabase as the backend.

## Features Implemented

### 1. Profile Management
- **Auto Profile Creation**: Profiles are automatically created when users connect their wallet
- **Profile Display**: Users can view and edit their display name and avatar URL
- **Wallet Integration**: Profiles are linked to wallet addresses as primary keys
- **Multilingual Support**: Profile interface supports multiple languages

### 2. Direct Messaging (DM) Chat
- **Wallet-to-Wallet Chat**: Users can search for wallet addresses and start private conversations
- **Real-time Messaging**: Messages are delivered in real-time using Supabase realtime subscriptions
- **Conversation Management**: Automatic conversation creation and management
- **Message History**: Persistent message storage with conversation threading

### 3. Database Schema
- **Profiles Table**: Stores user profile information
- **Conversations Table**: Manages conversation metadata
- **Messages Table**: Stores individual messages with conversation threading
- **Row Level Security (RLS)**: Proper security policies for data access

## Files Changed

### New Files Created
1. **`supabase-schema.sql`** - Database schema with tables and RLS policies
2. **`src/components/chat/ChatList.jsx`** - Chat conversation list component
3. **`src/components/chat/ChatRoom.jsx`** - Individual chat room component
4. **`WALLET_PROFILE_CHAT_IMPLEMENTATION.md`** - This documentation file

### Modified Files
1. **`src/lib/supabaseClient.ts`**
   - Added `ProfileService` class for profile management
   - Enhanced `ChatService` with conversation-based messaging
   - Added new interfaces for Profile and Conversation
   - Updated message handling for conversation threading

2. **`src/pages/Profile.jsx`**
   - Complete rewrite to use wallet-based profiles
   - Added profile creation and editing functionality
   - Integrated with Supabase for data persistence
   - Added conversation list display

3. **`src/pages/Chat.jsx`**
   - Updated to use new ChatList and ChatRoom components
   - Implemented conversation selection interface
   - Removed old global chat functionality

4. **`src/pages/DM.jsx`**
   - Updated to use new ChatRoom component
   - Simplified conversation handling

5. **`src/components/wallet/UnifiedWalletConnect.jsx`**
   - Added auto-profile creation on wallet connection
   - Integrated with ProfileService for seamless user experience

## Database Schema

### Tables Created

#### 1. Profiles Table
```sql
CREATE TABLE profiles (
  wallet TEXT PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. Conversations Table
```sql
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  a_wallet TEXT NOT NULL,
  b_wallet TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. Messages Table
```sql
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  conv_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  receiver TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Functions Created
- `generate_conversation_id()` - Creates deterministic conversation IDs
- `upsert_profile()` - Handles profile creation and updates
- `get_or_create_conversation()` - Manages conversation creation

## API Endpoints Used

### ProfileService Methods
- `upsertProfile(displayName?, avatarUrl?)` - Create or update profile
- `getProfile(wallet)` - Get profile by wallet address
- `getCurrentProfile()` - Get current user's profile
- `updateDisplayName(displayName)` - Update display name
- `updateAvatarUrl(avatarUrl)` - Update avatar URL

### ChatService Methods
- `getOrCreateConversation(me, peer)` - Get or create conversation
- `getUserConversations()` - Get user's conversations
- `sendMessageToConversation(convId, body)` - Send message
- `getRecentMessagesForConv(convId, limit)` - Get conversation messages
- `subscribeToMessagesForConv(convId, callback)` - Real-time message subscription

## Security Features

### Row Level Security (RLS)
- **Profiles**: Read access for all, write access for authenticated users
- **Conversations**: Read/write access for all authenticated users
- **Messages**: Read/write access for all authenticated users

### Data Validation
- Wallet address validation using ethers.js
- Input sanitization for messages and profile data
- Conversation ID generation using deterministic hashing

## Usage Instructions

### 1. Database Setup
1. Run the SQL commands in `supabase-schema.sql` in your Supabase SQL editor
2. Ensure RLS policies are properly configured

### 2. Environment Variables
Ensure these are set in your `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Profile Creation
- Profiles are automatically created when users connect their wallet
- Users can edit their display name and avatar URL in the Profile page
- Profile data is stored in Supabase and linked to wallet addresses

### 4. Starting a Chat
- Navigate to the Chat page
- Use the search bar to enter a wallet address
- Click "Start Chat" to begin a conversation
- Messages are delivered in real-time

### 5. Chat Features
- Real-time message delivery
- Message history persistence
- Conversation threading
- User profile display in chat headers

## Error Handling

### Graceful Degradation
- Chat features are disabled if Supabase is not configured
- Fallback notices are shown for missing configurations
- Error boundaries prevent application crashes

### User Feedback
- Toast notifications for successful operations
- Error messages for failed operations
- Loading states for async operations

## Performance Considerations

### Database Optimization
- Indexes on frequently queried columns
- Efficient conversation ID generation
- Optimized message queries with limits

### Real-time Efficiency
- Selective message subscriptions
- Connection management for real-time features
- Proper cleanup of subscriptions

## Future Enhancements

### Potential Improvements
1. **Message Encryption**: End-to-end encryption for private messages
2. **File Sharing**: Support for file attachments in messages
3. **Message Reactions**: Emoji reactions to messages
4. **Group Chats**: Multi-participant conversations
5. **Message Search**: Full-text search across conversations
6. **Push Notifications**: Browser notifications for new messages
7. **Message Status**: Read receipts and delivery confirmations

### Scalability Considerations
1. **Message Pagination**: Implement cursor-based pagination for large conversations
2. **Database Sharding**: Consider sharding for high-volume message storage
3. **Caching**: Implement Redis caching for frequently accessed data
4. **CDN Integration**: Use CDN for avatar images and file attachments

## Testing

### Manual Testing Checklist
- [ ] Profile creation on wallet connection
- [ ] Profile editing functionality
- [ ] Wallet address validation in chat search
- [ ] Message sending and receiving
- [ ] Real-time message updates
- [ ] Conversation list updates
- [ ] Error handling for invalid addresses
- [ ] Multilingual interface support

### Integration Testing
- [ ] Supabase connection and authentication
- [ ] Wallet connection and profile creation
- [ ] Message persistence and retrieval
- [ ] Real-time subscription functionality
- [ ] Error boundary behavior

## Conclusion

This implementation provides a robust foundation for wallet-based profile management and direct messaging in the MindVaultIP application. The system is designed with security, scalability, and user experience in mind, providing a solid base for future enhancements and features.
