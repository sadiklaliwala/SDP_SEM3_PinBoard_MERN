import UserModel from '../models/userModel.js';
import PinModel from '../models/pinModel.js';
import CommentModel from '../models/comment.model.js';
import PaymentModel from '../models/payment.js';
import ReportModel from '../models/reportModel.js.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// ==================== ADMIN AUTH ====================

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// ==================== DASHBOARD ====================

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalPins = await PinModel.countDocuments();
    const totalComments = await CommentModel.countDocuments();
    const totalPayments = await PaymentModel.countDocuments();
    const pendingReports = await ReportModel.countDocuments({ status: 'pending' });
    const premiumUsers = await UserModel.countDocuments({ isPremium: true });
    
    const totalRevenue = await PaymentModel.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const recentUsers = await UserModel.find()
      .select('name email createdAt isPremium')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPins = await PinModel.find()
      .populate('owner', 'name username')
      .select('title image createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalPins,
        totalComments,
        totalPayments,
        pendingReports,
        premiumUsers,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      recentUsers,
      recentPins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message,
    });
  }
};

// ==================== USERS MANAGEMENT ====================

export const getAllUsersAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { username: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const users = await UserModel.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await UserModel.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

export const getUserByIdAdmin = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name username profileImage')
      .populate('following', 'name username profileImage');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userPins = await PinModel.find({ owner: user._id }).countDocuments();
    const userComments = await CommentModel.find({ owner: user._id }).countDocuments();

    res.status(200).json({
      success: true,
      user,
      statistics: {
        totalPins: userPins,
        totalComments: userComments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

export const updateUserAdmin = async (req, res) => {
  try {
    const { name, email, username, bio, isPremium, role, isBlocked } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { name, email, username, bio, isPremium, role, isBlocked },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

export const deleteUserAdmin = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete all user's pins
    await PinModel.deleteMany({ owner: req.params.id });
    
    // Delete all user's comments
    await CommentModel.deleteMany({ owner: req.params.id });

    res.status(200).json({
      success: true,
      message: 'User and associated data deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

export const blockUserAdmin = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User blocked successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error blocking user',
      error: error.message,
    });
  }
};

export const unblockUserAdmin = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User unblocked successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unblocking user',
      error: error.message,
    });
  }
};

// ==================== PINS MANAGEMENT ====================

export const getAllPinsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const pins = await PinModel.find(query)
      .populate('owner', 'name username email profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await PinModel.countDocuments(query);

    res.status(200).json({
      success: true,
      pins,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalPins: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pins',
      error: error.message,
    });
  }
};

export const getPinByIdAdmin = async (req, res) => {
  try {
    const pin = await PinModel.findById(req.params.id)
      .populate('owner', 'name username email profileImage')
      .populate({
        path: 'comments',
        populate: { path: 'owner', select: 'name username profileImage' }
      });

    if (!pin) {
      return res.status(404).json({
        success: false,
        message: 'Pin not found',
      });
    }

    res.status(200).json({
      success: true,
      pin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pin',
      error: error.message,
    });
  }
};

export const updatePinAdmin = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const pin = await PinModel.findByIdAndUpdate(
      req.params.id,
      { title, description, category },
      { new: true, runValidators: true }
    ).populate('owner', 'name username email');

    if (!pin) {
      return res.status(404).json({
        success: false,
        message: 'Pin not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pin updated successfully',
      pin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating pin',
      error: error.message,
    });
  }
};

export const deletePinAdmin = async (req, res) => {
  try {
    const pin = await PinModel.findByIdAndDelete(req.params.id);

    if (!pin) {
      return res.status(404).json({
        success: false,
        message: 'Pin not found',
      });
    }

    // Delete all comments associated with this pin
    await CommentModel.deleteMany({ pin: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Pin and associated comments deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting pin',
      error: error.message,
    });
  }
};

// ==================== COMMENTS MANAGEMENT ====================

export const getAllCommentsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, pinId } = req.query;
    
    const query = pinId ? { pin: pinId } : {};

    const comments = await CommentModel.find(query)
      .populate('owner', 'name username email profileImage')
      .populate('pin', 'title image')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await CommentModel.countDocuments(query);

    res.status(200).json({
      success: true,
      comments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalComments: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message,
    });
  }
};

export const deleteCommentAdmin = async (req, res) => {
  try {
    const comment = await CommentModel.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Remove comment reference from pin
    await PinModel.findByIdAndUpdate(comment.pin, {
      $pull: { comments: comment._id }
    });

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message,
    });
  }
};

// ==================== PAYMENTS MANAGEMENT ====================

export const getAllPaymentsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = status ? { status } : {};

    const payments = await PaymentModel.find(query)
      .populate('userId', 'name username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await PaymentModel.countDocuments(query);

    res.status(200).json({
      success: true,
      payments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalPayments: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message,
    });
  }
};

export const getPaymentByIdAdmin = async (req, res) => {
  try {
    const payment = await PaymentModel.findById(req.params.id)
      .populate('userId', 'name username email profileImage isPremium');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error.message,
    });
  }
};