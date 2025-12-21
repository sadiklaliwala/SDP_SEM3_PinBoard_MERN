import express from 'express';
import isAuthenticated from '../middlewares/auth.middleware.js';
import isAdmin from '../middlewares/isAdmin.js';
import {
  createReport,
  getMyReports,
  getAllReports,
  getReportById,
  reviewReport,
  deleteReport,
  getPendingReportsCount,
} from '../controllers/report.controller.js';

const reportRouter = express.Router();

// ==================== USER ROUTES (Logged-in users) ====================

// POST /api/reports/create - Create a new report
reportRouter.post('/create', isAuthenticated, createReport);

// GET /api/reports/my-reports - Get user's own reports
reportRouter.get('/my-reports', isAuthenticated, getMyReports);

// ==================== ADMIN ROUTES ====================

// GET /api/reports/admin/all - Get all reports (with filters)
reportRouter.get('/admin/all', isAdmin, getAllReports);

// GET /api/reports/admin/pending-count - Get pending reports count (for notifications)
reportRouter.get('/admin/pending-count', isAdmin, getPendingReportsCount);

// GET /api/reports/admin/:id - Get report by ID
reportRouter.get('/admin/:id', isAdmin, getReportById);

// PUT /api/reports/admin/:id/review - Review report and take action
reportRouter.put('/admin/:id/review', isAdmin, reviewReport);

// DELETE /api/reports/admin/:id - Delete report
reportRouter.delete('/admin/:id', isAdmin, deleteReport);

export default reportRouter;