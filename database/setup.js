// ============================================================================
// DATABASE SETUP SCRIPT
// Run this script to create the database and all tables
// Usage: node database/setup.js
// ============================================================================

import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// First, connect without specifying a database to create it
const adminPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'postgres' // Connect to default postgres database
});

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');
  
  try {
    // Step 1: Create database if it doesn't exist
    console.log('📦 Creating database if not exists...');
    await adminPool.query(`
      SELECT 'CREATE DATABASE "Scholar"'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'Scholar')
    `).then(async (res) => {
      if (res.rows.length > 0) {
        await adminPool.query('CREATE DATABASE "Scholar"');
        console.log('✅ Database "Scholar" created successfully!\n');
      } else {
        console.log('ℹ️  Database "Scholar" already exists\n');
      }
    });
    
    await adminPool.end();
    
    // Step 2: Connect to the Scholar database and run schema
    const scholarPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: 'Scholar'
    });
    
    console.log('📋 Reading schema file...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🔨 Creating tables and indexes...\n');
    await scholarPool.query(schema);
    
    console.log('✅ All tables created successfully!');
    console.log('✅ All indexes created successfully!');
    console.log('✅ All triggers created successfully!');
    console.log('✅ All functions created successfully!\n');
    
    // Step 3: Verify tables were created
    console.log('🔍 Verifying tables...');
    const tablesResult = await scholarPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log(`\n📊 Created ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });
    
    // Step 4: Show admin credentials
    console.log('\n' + '='.repeat(60));
    console.log('🎉 DATABASE SETUP COMPLETE!');
    console.log('='.repeat(60));
    console.log('\n📝 Default Admin Account:');
    console.log('   Email: admin@scholarapp.com');
    console.log('   Password: Admin123!');
    console.log('\n⚠️  IMPORTANT: Change the admin password in production!\n');
    
    console.log('🔗 Connection Details:');
    console.log('   Host: localhost');
    console.log('   Port: 5432');
    console.log('   Database: Scholar');
    console.log('   User: admin');
    console.log('\n📚 Next Steps:');
    console.log('   1. Update .env file with your database credentials');
    console.log('   2. Run: npm install pg dotenv');
    console.log('   3. Start building your API!');
    console.log('   4. (Optional) Run: node database/seed.js for sample data\n');
    
    await scholarPool.end();
    
  } catch (error) {
    console.error('❌ Error during setup:', error);
    process.exit(1);
  }
}

// Run setup
setupDatabase();
