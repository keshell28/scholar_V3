// ============================================================================
// CHAT MIGRATION - Add conversations table and update messages
// Run this to update the database for chat functionality
// ============================================================================

import { query, getClient } from './connection.js';

async function runMigration() {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    console.log('🔄 Starting chat migration...');
    
    // Drop existing tables if they exist
    console.log('📝 Dropping old tables...');
    await client.query('DROP TABLE IF EXISTS messages CASCADE');
    await client.query('DROP TABLE IF EXISTS conversations CASCADE');
    
    // Create conversations table
    console.log('📝 Creating conversations table...');
    await client.query(`
      CREATE TABLE conversations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        last_message_id UUID,
        updated_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        
        CONSTRAINT no_self_conversation CHECK (user1_id != user2_id),
        CONSTRAINT unique_conversation UNIQUE(user1_id, user2_id)
      )
    `);
    
    await client.query('CREATE INDEX idx_conversations_user1 ON conversations(user1_id)');
    await client.query('CREATE INDEX idx_conversations_user2 ON conversations(user2_id)');
    await client.query('CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC)');
    
    // Create messages table
    console.log('📝 Creating messages table...');
    await client.query(`
      CREATE TABLE messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
        created_at TIMESTAMP DEFAULT NOW(),
        
        CONSTRAINT no_self_message CHECK (sender_id != receiver_id)
      )
    `);
    
    await client.query('CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC)');
    await client.query('CREATE INDEX idx_messages_sender ON messages(sender_id)');
    await client.query('CREATE INDEX idx_messages_receiver ON messages(receiver_id)');
    await client.query('CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read) WHERE is_read = FALSE');
    await client.query('CREATE INDEX idx_messages_created ON messages(created_at DESC)');
    
    await client.query('COMMIT');
    
    console.log('✅ Chat migration completed successfully!');
    console.log('✅ Tables created: conversations, messages');
    console.log('✅ Indexes created for optimal performance');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migration
runMigration()
  .then(() => {
    console.log('\n🎉 Migration complete! Chat system is ready.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration error:', error.message);
    process.exit(1);
  });
