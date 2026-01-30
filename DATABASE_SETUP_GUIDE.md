# 🗄️ PostgreSQL Database Setup Guide

## 📋 What's Been Created

I've created a **production-ready PostgreSQL database schema** for your Scholar app with:

### ✅ Database Files
- **`database/schema.sql`** - Complete database schema (35+ tables)
- **`database/connection.js`** - PostgreSQL connection configuration  
- **`database/setup.js`** - Automated setup script
- **`database/seed.js`** - Sample data for testing
- **`.env.example`** - Environment variables template

### ✅ Database Features
- **35+ tables** with all relationships
- **User authentication** (with password hashing)
- **Full-text search** indexes
- **Auto-updating timestamps** (triggers)
- **Auto-incrementing counters** (likes, members, etc.)
- **Performance indexes** on all key fields
- **Data validation** (CHECK constraints)
- **Helper functions** (conversations, matches, cleanup)
- **Database views** for common queries

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install PostgreSQL

**Windows:**
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer (keep default port 5432)
3. Set password during installation (use: `Zim1400/8`)
4. Remember to install pgAdmin for GUI management

**Verify installation:**
```powershell
psql --version
```

### Step 2: Install Dependencies

```powershell
npm install pg bcrypt dotenv
```

### Step 3: Run Setup Script

```powershell
# Create .env file (copy from .env.example)
cp .env.example .env

# Run database setup
node database/setup.js

# (Optional) Add sample data
node database/seed.js
```

---

## 📊 Complete Database Schema

### Core Tables (35 total)

1. **users** - User profiles & authentication
2. **connections** - Discovery/swipe system
3. **communities** - Student groups
4. **community_members** - Community membership
5. **posts** - Community posts
6. **comments** - Post comments
7. **post_likes** - Post likes tracking
8. **comment_likes** - Comment likes tracking
9. **scholarships** - Scholarship listings
10. **saved_scholarships** - User saved scholarships
11. **messages** - Chat messages
12. **recipes** - Recipe sharing
13. **recipe_ratings** - Recipe reviews
14. **study_groups** - Study groups
15. **study_group_members** - Group membership
16. **study_sessions** - Study sessions
17. **events** - Campus events
18. **event_attendees** - Event RSVPs
19. **mentor_profiles** - Mentor information
20. **mentorship_requests** - Mentorship matching
21. **alumni_profiles** - Alumni network
22. **university_partners** - Partner universities
23. **university_programs** - University programs
24. **university_inquiries** - Student inquiries
25. **subscriptions** - User subscriptions
26. **transactions** - Payment transactions
27. **notifications** - User notifications
28. **stories** - 24-hour stories
29. **story_views** - Story view tracking
30. **video_call_sessions** - Video calls
31. **cultural_music** - Cultural content
32. **cultural_art** - Art content
33. **cultural_events** - Cultural events
34. **proverbs** - Zimbabwean proverbs
35. **schema_version** - Schema versioning

---

## 🔑 Default Credentials

After setup, you'll have:

**Admin Account:**
- Email: `admin@scholarapp.com`
- Password: `Admin123!`

**Sample Users** (after running seed):
- Email: `tafadzwa@example.com`
- Password: `Password123!`

⚠️ **IMPORTANT:** Change admin password in production!

---

## 📁 Project Structure

```
Scholar/
├── database/
│   ├── schema.sql          # Database schema
│   ├── connection.js       # PostgreSQL connection
│   ├── setup.js           # Setup script
│   └── seed.js            # Sample data script
├── .env.example           # Environment template
└── .env                   # Your config (create this)
```

---

## 🔧 Configuration

### .env File

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=Zim1400/8
DB_NAME=Scholar

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m

# Application
PORT=3000
NODE_ENV=development
```

---

## 💻 Usage Examples

### Connect to Database

```javascript
const { query, getClient, pool } = require('./database/connection');

// Simple query
const users = await query('SELECT * FROM users LIMIT 10');

// Using client for transactions
const client = await getClient();
try {
  await client.query('BEGIN');
  // Your queries here
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}
```

### Example Queries

```javascript
// 1. Create a new user
const newUser = await query(`
  INSERT INTO users (email, password_hash, name, university, country, city)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *
`, ['user@email.com', hashedPassword, 'John Doe', 'UZ', 'Zimbabwe', 'Harare']);

// 2. Get user with communities
const userCommunities = await query(`
  SELECT u.*, 
         json_agg(c.*) as communities
  FROM users u
  LEFT JOIN community_members cm ON u.id = cm.user_id
  LEFT JOIN communities c ON cm.community_id = c.id
  WHERE u.id = $1
  GROUP BY u.id
`, [userId]);

// 3. Get user's matches
const matches = await query(`
  SELECT * FROM get_user_matches($1)
`, [userId]);

// 4. Search scholarships
const scholarships = await query(`
  SELECT * FROM scholarships
  WHERE to_tsvector('english', title || ' ' || description) 
        @@ plainto_tsquery('english', $1)
  AND country = $2
  ORDER BY deadline ASC
`, ['engineering', 'United Kingdom']);

// 5. Get conversation messages
const messages = await query(`
  SELECT * FROM get_conversation_messages($1, $2, 50)
`, [user1Id, user2Id]);
```

---

## 🎯 Key Features

### 1. Auto-Updating Counts
Triggers automatically update:
- Community member counts
- Post like counts
- Comment like counts
- Post comment counts
- Story view counts

### 2. Full-Text Search
Optimized search on:
- Users (name, bio, university)
- Posts (content)
- Scholarships (title, description)
- Events (title, description)
- Recipes (title, description)

### 3. Helper Functions

```sql
-- Get conversation between two users
SELECT * FROM get_conversation_messages(user1_id, user2_id, 50);

-- Get user's matches
SELECT * FROM get_user_matches(user_id);

-- Clean up expired stories
SELECT cleanup_expired_stories();
```

### 4. Database Views

```sql
-- Active stories (not expired)
SELECT * FROM active_stories;

-- Active subscriptions
SELECT * FROM active_subscriptions;

-- Upcoming events
SELECT * FROM upcoming_events;

-- Popular communities
SELECT * FROM popular_communities;
```

---

## 🔍 Managing Your Database

### Using pgAdmin (GUI)
1. Open pgAdmin
2. Right-click "Servers" → Create → Server
3. Name: "Scholar"
4. Connection tab:
   - Host: localhost
   - Port: 5432
   - Database: Scholar
   - Username: admin
   - Password: Zim1400/8

### Using psql (Command Line)

```powershell
# Connect to database
psql -U admin -d Scholar

# Common commands
\dt              # List tables
\d users         # Describe users table
\q               # Quit
```

---

## 📊 Sample Queries for Testing

```sql
-- See all users
SELECT id, name, email, university, country FROM users;

-- See communities with member counts
SELECT name, category, member_count FROM communities;

-- See all scholarships
SELECT title, country, deadline, amount FROM scholarships;

-- See recent messages
SELECT 
  m.content,
  sender.name as sender_name,
  receiver.name as receiver_name,
  m.created_at
FROM messages m
JOIN users sender ON m.sender_id = sender.id
JOIN users receiver ON m.receiver_id = receiver.id
ORDER BY m.created_at DESC
LIMIT 10;

-- See post engagement
SELECT 
  p.content,
  u.name as author,
  p.likes_count,
  p.comments_count
FROM posts p
JOIN users u ON p.author_id = u.id
ORDER BY p.likes_count DESC
LIMIT 10;
```

---

## 🚨 Important Notes

### Security
- ✅ Passwords are hashed with bcrypt
- ✅ SQL injection protection (parameterized queries)
- ✅ Email validation
- ✅ Foreign key constraints
- ⚠️ Change JWT secrets in .env
- ⚠️ Change admin password

### Performance
- ✅ Indexes on all foreign keys
- ✅ Full-text search indexes
- ✅ Connection pooling enabled
- ✅ Query logging for debugging

### Data Integrity
- ✅ CASCADE deletes
- ✅ CHECK constraints
- ✅ UNIQUE constraints
- ✅ NOT NULL constraints
- ✅ Triggers for auto-updates

---

## 🆘 Troubleshooting

### "Connection refused"
```powershell
# Check if PostgreSQL is running
Get-Service postgresql*

# Start PostgreSQL
Start-Service postgresql-x64-14  # Replace with your version
```

### "Database does not exist"
```powershell
# Run setup script again
node database/setup.js
```

### "Password authentication failed"
```powershell
# Check .env file has correct password
# Update pg_hba.conf if needed (change from 'peer' to 'md5')
```

### Reset Database
```powershell
# Connect to postgres database
psql -U admin -d postgres

# Drop and recreate
DROP DATABASE "Scholar";
CREATE DATABASE "Scholar";
\q

# Re-run setup
node database/setup.js
```

---

## 📚 Next Steps

1. ✅ **Test connection:**
   ```javascript
   node -e "require('./database/connection').query('SELECT NOW()')"
   ```

2. ✅ **Build API endpoints:**
   - Start with authentication (register/login)
   - Then user profiles
   - Then communities
   - Then other features

3. ✅ **Connect frontend:**
   - Update frontend to use real API
   - Replace localStorage with API calls
   - Add loading states

4. ✅ **Add real-time features:**
   - WebSocket for chat
   - Socket.io for notifications

---

## 🎉 You're All Set!

Your PostgreSQL database is ready with:
- ✅ 35+ tables
- ✅ All relationships configured
- ✅ Performance indexes
- ✅ Auto-updating triggers
- ✅ Helper functions
- ✅ Sample data (optional)

**Ready to build your API!** 🚀

Need help with specific features? Let me know!
