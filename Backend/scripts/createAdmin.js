import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import UserModel from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    const dbURL = process.env.ATLASDB_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/mern_pintrest";
    await mongoose.connect(dbURL);
    
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const admin = new UserModel({
      name: 'Admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      username: 'admin',
      role: 'admin',
      isPremium: true,
    });
    
    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@admin.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdminUser();