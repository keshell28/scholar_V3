// ============================================================================
// DATABASE SEED SCRIPT
// Populate database with sample data for testing
// Usage: node database/seed.js
// ============================================================================

import { query, pool } from './connection.js';
import bcrypt from 'bcrypt';

// Sample data
const sampleUsers = [
  {
    email: 'tafadzwa@example.com',
    name: 'Tafadzwa Moyo',
    university: 'University of Cape Town',
    fieldOfStudy: 'Computer Science',
    country: 'South Africa',
    city: 'Cape Town',
    bio: 'CS student passionate about AI and machine learning'
  },
  {
    email: 'nyasha@example.com',
    name: 'Nyasha Chikwamba',
    university: 'University of Witwatersrand',
    fieldOfStudy: 'Medicine',
    country: 'South Africa',
    city: 'Johannesburg',
    bio: 'Future doctor, love helping fellow Zimbabweans'
  },
  {
    email: 'rumbidzai@example.com',
    name: 'Rumbidzai Ndlovu',
    university: 'Harvard University',
    fieldOfStudy: 'Business Administration',
    country: 'United States',
    city: 'Cambridge',
    bio: 'MBA student, entrepreneur at heart'
  },
  {
    email: 'tinashe@example.com',
    name: 'Tinashe Mukasa',
    university: 'Oxford University',
    fieldOfStudy: 'Economics',
    country: 'United Kingdom',
    city: 'Oxford',
    bio: 'Economics undergrad, love playing chess'
  }
];

const sampleCommunities = [
  {
    name: 'Zimbabweans in South Africa',
    description: 'Connect with fellow Zimbabwean students studying in South Africa',
    category: 'country',
    image: 'https://images.unsplash.com/photo-1484318571209-661cf29a69c3'
  },
  {
    name: 'UZ Alumni Network',
    description: 'University of Zimbabwe graduates worldwide',
    category: 'university',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1'
  },
  {
    name: 'Tech & Innovation',
    description: 'For students in technology and innovation fields',
    category: 'field',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
  },
  {
    name: 'Zimbabwean Culture',
    description: 'Sharing our rich culture, food, music, and traditions',
    category: 'culture',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3'
  }
];

const sampleScholarships = [
  {
    title: 'Chevening Scholarships',
    description: 'UK government\'s global scholarship programme for future leaders',
    organization: 'UK Government',
    country: 'United Kingdom',
    fieldOfStudy: ['All fields'],
    deadline: new Date('2026-11-03'),
    amount: 'Full tuition + living costs',
    link: 'https://chevening.org',
    isVerified: true,
    isPremium: true,
    type: 'full',
    level: 'postgraduate',
    competitiveness: 'high'
  },
  {
    title: 'Mastercard Foundation Scholars Program',
    description: 'Comprehensive scholarship for African students',
    organization: 'Mastercard Foundation',
    country: 'Multiple',
    fieldOfStudy: ['All fields'],
    deadline: new Date('2026-09-30'),
    amount: '$50,000 per year',
    link: 'https://mastercardfdn.org',
    isVerified: true,
    isPremium: true,
    type: 'full',
    level: 'undergraduate',
    competitiveness: 'high'
  },
  {
    title: 'Commonwealth Scholarship',
    description: 'For students from Commonwealth countries',
    organization: 'Commonwealth Scholarship Commission',
    country: 'United Kingdom',
    fieldOfStudy: ['Engineering', 'Medicine', 'Agriculture'],
    deadline: new Date('2026-12-15'),
    amount: 'Full funding',
    link: 'https://cscuk.fcdo.gov.uk',
    isVerified: true,
    isPremium: false,
    type: 'full',
    level: 'postgraduate',
    competitiveness: 'medium'
  }
];

const sampleRecipes = [
  {
    title: 'Traditional Sadza',
    description: 'Zimbabwe\'s staple food made from maize meal',
    ingredients: ['2 cups maize meal', '4 cups water', '1/4 tsp salt'],
    instructions: [
      'Boil water in a pot',
      'Add salt to the boiling water',
      'Gradually add maize meal while stirring',
      'Cook on low heat for 15-20 minutes',
      'Stir continuously to avoid lumps',
      'Sadza is ready when thick and pulling away from the pot'
    ],
    prepTime: 5,
    cookTime: 20,
    servings: 4,
    category: 'Main Course',
    tips: ['Use wooden spoon for best results', 'Serve hot with relish'],
    whereToFindIngredients: 'African stores, some supermarkets carry maize meal in international aisles'
  },
  {
    title: 'Muriwo (Vegetable Relish)',
    description: 'Traditional greens cooked with tomatoes and onions',
    ingredients: [
      '2 bunches spinach or rape',
      '2 tomatoes',
      '1 onion',
      '2 tbsp cooking oil',
      'Salt to taste',
      '1/4 cup peanut butter (optional)'
    ],
    instructions: [
      'Wash and chop the vegetables',
      'Fry onions until golden',
      'Add tomatoes and cook until soft',
      'Add chopped greens',
      'Season with salt',
      'Add peanut butter if desired',
      'Cook for 10-15 minutes'
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    category: 'Side Dish',
    tips: ['Fresh is best', 'Don\'t overcook the greens'],
    whereToFindIngredients: 'Any supermarket or farmers market'
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');
  
  try {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 1. Create sample users
      console.log('👥 Creating sample users...');
      const defaultPassword = await bcrypt.hash('Password123!', 10);
      const userIds = [];
      
      for (const user of sampleUsers) {
        const result = await client.query(`
          INSERT INTO users (email, password_hash, name, university, field_of_study, country, city, bio, is_email_verified)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
          RETURNING id
        `, [user.email, defaultPassword, user.name, user.university, user.fieldOfStudy, user.country, user.city, user.bio]);
        
        userIds.push(result.rows[0].id);
        console.log(`   ✓ Created user: ${user.name}`);
      }
      
      // 2. Create sample communities
      console.log('\n🏘️  Creating sample communities...');
      const communityIds = [];
      
      for (const community of sampleCommunities) {
        const adminId = userIds[Math.floor(Math.random() * userIds.length)];
        const result = await client.query(`
          INSERT INTO communities (name, description, category, image, admin_id)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id
        `, [community.name, community.description, community.category, community.image, adminId]);
        
        communityIds.push(result.rows[0].id);
        console.log(`   ✓ Created community: ${community.name}`);
        
        // Add some members to each community
        const memberCount = Math.floor(Math.random() * userIds.length) + 1;
        for (let i = 0; i < memberCount; i++) {
          await client.query(`
            INSERT INTO community_members (community_id, user_id)
            VALUES ($1, $2)
            ON CONFLICT (community_id, user_id) DO NOTHING
          `, [result.rows[0].id, userIds[i]]);
        }
      }
      
      // 3. Create sample posts
      console.log('\n📝 Creating sample posts...');
      for (let i = 0; i < 10; i++) {
        const authorId = userIds[Math.floor(Math.random() * userIds.length)];
        const communityId = communityIds[Math.floor(Math.random() * communityIds.length)];
        const postTypes = ['announcement', 'question', 'share', 'event'];
        const postType = postTypes[Math.floor(Math.random() * postTypes.length)];
        
        await client.query(`
          INSERT INTO posts (author_id, community_id, content, type)
          VALUES ($1, $2, $3, $4)
        `, [
          authorId,
          communityId,
          `This is a sample ${postType} post #${i + 1}. Connect with fellow Zimbabwean students!`,
          postType
        ]);
      }
      console.log('   ✓ Created 10 sample posts');
      
      // 4. Create sample scholarships
      console.log('\n🎓 Creating sample scholarships...');
      for (const scholarship of sampleScholarships) {
        await client.query(`
          INSERT INTO scholarships (
            title, description, organization, country, field_of_study,
            deadline, amount, link, is_verified, is_premium, type, level, competitiveness
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
          scholarship.title,
          scholarship.description,
          scholarship.organization,
          scholarship.country,
          JSON.stringify(scholarship.fieldOfStudy),
          scholarship.deadline,
          scholarship.amount,
          scholarship.link,
          scholarship.isVerified,
          scholarship.isPremium,
          scholarship.type,
          scholarship.level,
          scholarship.competitiveness
        ]);
        console.log(`   ✓ Created scholarship: ${scholarship.title}`);
      }
      
      // 5. Create sample recipes
      console.log('\n🍲 Creating sample recipes...');
      for (const recipe of sampleRecipes) {
        const authorId = userIds[Math.floor(Math.random() * userIds.length)];
        await client.query(`
          INSERT INTO recipes (
            author_id, title, description, ingredients, instructions,
            prep_time, cook_time, servings, category, tips, where_to_find_ingredients
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          authorId,
          recipe.title,
          recipe.description,
          JSON.stringify(recipe.ingredients),
          JSON.stringify(recipe.instructions),
          recipe.prepTime,
          recipe.cookTime,
          recipe.servings,
          recipe.category,
          JSON.stringify(recipe.tips),
          recipe.whereToFindIngredients
        ]);
        console.log(`   ✓ Created recipe: ${recipe.title}`);
      }
      
      // 6. Create sample connections (matches)
      console.log('\n🤝 Creating sample connections...');
      for (let i = 0; i < userIds.length - 1; i++) {
        await client.query(`
          INSERT INTO connections (user_id, target_user_id, status)
          VALUES ($1, $2, 'matched')
        `, [userIds[i], userIds[i + 1]]);
        
        await client.query(`
          INSERT INTO connections (user_id, target_user_id, status)
          VALUES ($1, $2, 'matched')
        `, [userIds[i + 1], userIds[i]]);
      }
      console.log('   ✓ Created mutual connections');
      
      // 7. Create sample messages
      console.log('\n💬 Creating sample messages...');
      await client.query(`
        INSERT INTO messages (sender_id, receiver_id, content)
        VALUES 
          ($1, $2, 'Hey! How are you settling in?'),
          ($2, $1, 'Good! Thanks for reaching out. How about you?'),
          ($1, $2, 'Great! Let me know if you need any help with accommodation')
      `, [userIds[0], userIds[1]]);
      console.log('   ✓ Created sample conversation');
      
      // 8. Create a sample event
      console.log('\n📅 Creating sample event...');
      await client.query(`
        INSERT INTO events (
          title, description, category, date, time, location,
          is_online, organizer_id, tags
        )
        VALUES (
          'Zimbabwean Students Meetup',
          'Come connect with fellow Zimbabwean students in Cape Town!',
          'meetup',
          CURRENT_DATE + INTERVAL '14 days',
          '18:00:00',
          'Gardens, Cape Town',
          FALSE,
          $1,
          '["networking", "social", "zimbabwean"]'
        )
      `, [userIds[0]]);
      console.log('   ✓ Created sample event');
      
      await client.query('COMMIT');
      
      console.log('\n' + '='.repeat(60));
      console.log('✅ DATABASE SEEDING COMPLETE!');
      console.log('='.repeat(60));
      console.log('\n📊 Summary:');
      console.log(`   • ${sampleUsers.length} users created`);
      console.log(`   • ${sampleCommunities.length} communities created`);
      console.log(`   • 10 posts created`);
      console.log(`   • ${sampleScholarships.length} scholarships created`);
      console.log(`   • ${sampleRecipes.length} recipes created`);
      console.log(`   • Sample connections created`);
      console.log(`   • Sample messages created`);
      console.log(`   • 1 event created`);
      
      console.log('\n🔑 Sample User Credentials:');
      console.log('   Email: tafadzwa@example.com');
      console.log('   Password: Password123!');
      console.log('\n   (All sample users have the same password)\n');
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run seeding
seedDatabase();
