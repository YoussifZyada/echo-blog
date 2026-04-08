import User from './models/User.js';
import Post from './models/Post.js';

// Export the function so server.js can use it
export const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    
    // Only seed if the database is empty
    if (userCount === 0) {
      console.log('📭 Database empty. Seeding dummy data...');
      
      const user1 = await User.create({ 
        username: 'AhmedZyada', 
        email: 'ahmed@blog.com', 
        password: 'password123' 
      });
      const user2 = await User.create({ 
        username: 'ZyadZyada', 
        email: 'zyad@blog.com', 
        password: 'password123' 
      });

      user1.following.push(user2._id);
      user2.followers.push(user1._id);
      await user1.save();
      await user2.save();

      await Post.create([
        { title: 'First Post', content: 'Global post from Ahmed', author: user1._id, images: ['https://placehold.co/600x400'] },
        { title: 'Zyad\'s Thoughts', content: 'Hello from Zyad!', author: user2._id, images: ['https://placehold.co/600x400'] }
      ]);
      
      console.log('✅ Dummy data seeded!');
    } else {
      console.log('✅ Database already has data. Skipping seed.');
    }
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  }
};