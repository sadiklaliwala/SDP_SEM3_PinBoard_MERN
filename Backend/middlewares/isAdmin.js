import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    // Check for token in cookies
    let token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated, please log in as admin',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id
    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed, please log in again',
    });
  }
};

export default isAdmin;