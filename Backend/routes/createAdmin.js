import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import UserModel from '../models/userModel.js';
import dotenv from 'dotenv';


dotenv.config();

const createAdmin = async () => {
  try {
    console.log(process.env.ATLASDB_URI )
    console.log(process.env.MONGODB_URI)
    const dbURL = process.env.ATLASDB_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/mern_pintrest";

    if (!dbURL) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env<dev/prod>.local'
      );
    }
    await mongoose.connect(dbURL);

    console.log(`Connected to mongodb database`);

    const hashedPassword = await bcrypt.hash('123456', 10);

    const admin = await UserModel.create({
      name: 'zaid Laliwala',
      email: 'zaid@gmail.com',
      password: hashedPassword,
      username: 'zaid',
      role: 'admin',
      authProvider: 'local'
    });

    console.log('Admin user created successfully:', admin);
    process.exit(0);
  } catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();