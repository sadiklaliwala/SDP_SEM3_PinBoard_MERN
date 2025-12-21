import express from 'express';
import isAdmin from '../middlewares/isAdmin.js';
import {
  adminLogin,
  getDashboardStats,
  getAllUsersAdmin,
  getUserByIdAdmin,
  updateUserAdmin,
  deleteUserAdmin,
  blockUserAdmin,
  unblockUserAdmin,
  getAllPinsAdmin,
  getPinByIdAdmin,
  updatePinAdmin,
  deletePinAdmin,
  getAllCommentsAdmin,
  deleteCommentAdmin,
  getAllPaymentsAdmin,
  getPaymentByIdAdmin,
} from '../controllers/admin.controller.js';

const adminRouter = express.Router();

// ==================== AUTH ====================
// POST /api/admin/login
adminRouter.post('/login', adminLogin);

// ==================== DASHBOARD ====================
// GET /api/admin/dashboard
adminRouter.get('/dashboard', isAdmin, getDashboardStats);

// ==================== USERS MANAGEMENT ====================
// GET /api/admin/users (with pagination & search)
adminRouter.get('/users', isAdmin, getAllUsersAdmin);

// GET /api/admin/users/:id
adminRouter.get('/users/:id', isAdmin, getUserByIdAdmin);

// PUT /api/admin/users/:id
adminRouter.put('/users/:id', isAdmin, updateUserAdmin);

// DELETE /api/admin/users/:id
adminRouter.delete('/users/:id', isAdmin, deleteUserAdmin);

// PUT /api/admin/users/:id/block
adminRouter.put('/users/:id/block', isAdmin, blockUserAdmin);

// PUT /api/admin/users/:id/unblock
adminRouter.put('/users/:id/unblock', isAdmin, unblockUserAdmin);

// ==================== PINS MANAGEMENT ====================
// GET /api/admin/pins (with pagination & search)
adminRouter.get('/pins', isAdmin, getAllPinsAdmin);

// GET /api/admin/pins/:id
adminRouter.get('/pins/:id', isAdmin, getPinByIdAdmin);

// PUT /api/admin/pins/:id
adminRouter.put('/pins/:id', isAdmin, updatePinAdmin);

// DELETE /api/admin/pins/:id
adminRouter.delete('/pins/:id', isAdmin, deletePinAdmin);

// ==================== COMMENTS MANAGEMENT ====================
// GET /api/admin/comments (with pagination)
adminRouter.get('/comments', isAdmin, getAllCommentsAdmin);

// DELETE /api/admin/comments/:id
adminRouter.delete('/comments/:id', isAdmin, deleteCommentAdmin);

// ==================== PAYMENTS MANAGEMENT ====================
// GET /api/admin/payments (with pagination & filter by status)
adminRouter.get('/payments', isAdmin, getAllPaymentsAdmin);

// GET /api/admin/payments/:id
adminRouter.get('/payments/:id', isAdmin, getPaymentByIdAdmin);

export default adminRouter;