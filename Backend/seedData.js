import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Post from './models/Post.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // 1. Create Users
  const user1 = await User.create({ username: 'AhmedZyada', email: 'ahmed@blog.com', password: 'password123' });
  const user2 = await User.create({ username: 'ZyadZyada', email: 'zyad@blog.com', password: 'password123' });

  // 2. Add Followers
  // ahmed follows zyad
  user1.following.push(user2._id);
  user2.followers.push(user1._id);

  await user1.save();
  await user2.save();

  // 3. Create Posts
  await Post.create([
    {
      title: 'First Post',
      content: 'This is a global post from ahmed',
      author: user1._id,
      images: ['https://placehold.co/600x400']
    },
    {
      title: 'zyad\'s Thoughts',
      content: 'Hello world from zyad!',
      author: user2._id,
      images: ['https://placehold.co/600x400']
    }
  ]);

  console.log('✅ Dummy data seeded!');
  process.exit();
};

seed();