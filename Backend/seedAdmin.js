import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await User.findOne({ email: 'admin@blog.com' });
    if (adminExists) {
      console.log('Super Admin already exists!');
      process.exit();
    }

    await User.create({
      username: 'SuperYoussif',
      email: 'admin@blog.com',
      password: 'Password123',
      role: 'super-admin'
    });

    console.log('✅ Super Admin Created Successfully!');
    console.log('Email: admin@blog.com | Pass: Password123');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createSuperAdmin();