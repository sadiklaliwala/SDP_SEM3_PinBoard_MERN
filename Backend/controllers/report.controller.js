import UserModel from '../models/userModel.js';
import PinModel from '../models/pinModel.js';
// import CommentModel from '../models/commentModel.js';
import ReportModel from '../models/reportModel.js.js';
import CommentModel from '../models/comment.model.js';

// ==================== USER REPORTS (Logged-in users) ====================

// Create a new report
export const createReport = async (req, res) => {
  try {
    const { reportType, reportedUserId, reportedPinId, reportedCommentId, reason, description } = req.body;

    // Validation
    if (!reportType || !reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'Report type, reason, and description are required',
      });
    }

    // Check if user is reporting themselves
    if (reportType === 'user' && reportedUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot report yourself',
      });
    }

    // Verify the reported item exists
    if (reportType === 'user') {
      if (!reportedUserId) {
        return res.status(400).json({
          success: false,
          message: 'Reported user ID is required',
        });
      }
      const userExists = await UserModel.findById(reportedUserId);
      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'Reported user not found',
        });
      }
    }

    if (reportType === 'pin') {
      if (!reportedPinId) {
        return res.status(400).json({
          success: false,
          message: 'Reported pin ID is required',
        });
      }
      const pinExists = await PinModel.findById(reportedPinId);
      if (!pinExists) {
        return res.status(404).json({
          success: false,
          message: 'Reported pin not found',
        });
      }
    }

    if (reportType === 'comment') {
      if (!reportedCommentId) {
        return res.status(400).json({
          success: false,
          message: 'Reported comment ID is required',
        });
      }
      const commentExists = await CommentModel.findById(reportedCommentId);
      if (!commentExists) {
        return res.status(404).json({
          success: false,
          message: 'Reported comment not found',
        });
      }
    }

    // Check if user already reported this item
    const existingReport = await ReportModel.findOne({
      reportedBy: req.user._id,
      reportType,
      ...(reportType === 'user' && { reportedUser: reportedUserId }),
      ...(reportType === 'pin' && { reportedPin: reportedPinId }),
      ...(reportType === 'comment' && { reportedComment: reportedCommentId }),
      status: 'pending',
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this item',
      });
    }

    // Create report
    const report = await ReportModel.create({
      reportedBy: req.user._id,
      reportType,
      ...(reportType === 'user' && { reportedUser: reportedUserId }),
      ...(reportType === 'pin' && { reportedPin: reportedPinId }),
      ...(reportType === 'comment' && { reportedComment: reportedCommentId }),
      reason,
      description,
    });

    await report.populate('reportedBy', 'name username email');

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Admin will review it soon.',
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating report',
      error: error.message,
    });
  }
};

// Get user's own reports
export const getMyReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {
      reportedBy: req.user._id,
      ...(status && { status }),
    };

    const reports = await ReportModel.find(query)
      .populate('reportedUser', 'name username profileImage')
      .populate('reportedPin', 'title image')
      .populate('reportedComment', 'comment')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await ReportModel.countDocuments(query);

    res.status(200).json({
      success: true,
      reports,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalReports: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message,
    });
  }
};

// ==================== ADMIN REPORTS MANAGEMENT ====================

// Get all reports (Admin only)
export const getAllReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, reportType, reason } = req.query;

    const query = {
      ...(status && { status }),
      ...(reportType && { reportType }),
      ...(reason && { reason }),
    };

    const reports = await ReportModel.find(query)
      .populate('reportedBy', 'name username email profileImage')
      .populate('reportedUser', 'name username email profileImage')
      .populate('reportedPin', 'title image description')
      .populate('reportedComment', 'comment')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await ReportModel.countDocuments(query);

    // Get counts by status
    const statusCounts = await ReportModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      reports,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalReports: count,
      statusCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message,
    });
  }
};

// Get report by ID (Admin only)
export const getReportById = async (req, res) => {
  try {
    const report = await ReportModel.findById(req.params.id)
      .populate('reportedBy', 'name username email profileImage')
      .populate('reportedUser', 'name username email profileImage isBlocked')
      .populate({
        path: 'reportedPin',
        populate: { path: 'owner', select: 'name username email' }
      })
      .populate({
        path: 'reportedComment',
        populate: { path: 'owner', select: 'name username email' }
      })
      .populate('reviewedBy', 'name email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: error.message,
    });
  }
};

// Review report and take action (Admin only)
export const reviewReport = async (req, res) => {
  try {
    const { status, actionTaken, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const report = await ReportModel.findById(req.params.id)
      .populate('reportedUser')
      .populate('reportedPin')
      .populate('reportedComment');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Update report
    report.status = status;
    report.actionTaken = actionTaken || 'none';
    report.adminNotes = adminNotes || '';
    report.reviewedBy = req.user._id;
    report.reviewedAt = new Date();

    await report.save();

    // Take action based on actionTaken
    if (actionTaken === 'user_blocked' && report.reportedUser) {
      await UserModel.findByIdAndUpdate(report.reportedUser._id, { isBlocked: true });
    }

    if (actionTaken === 'content_removed') {
      if (report.reportType === 'pin' && report.reportedPin) {
        await PinModel.findByIdAndDelete(report.reportedPin._id);
        // Delete associated comments
        await CommentModel.deleteMany({ pin: report.reportedPin._id });
      }
      
      if (report.reportType === 'comment' && report.reportedComment) {
        await CommentModel.findByIdAndDelete(report.reportedComment._id);
        // Remove comment reference from pin
        await PinModel.findByIdAndUpdate(report.reportedComment.pin, {
          $pull: { comments: report.reportedComment._id }
        });
      }
    }

    await report.populate('reviewedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Report reviewed successfully',
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reviewing report',
      error: error.message,
    });
  }
};

// Delete report (Admin only)
export const deleteReport = async (req, res) => {
  try {
    const report = await ReportModel.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting report',
      error: error.message,
    });
  }
};

// Get pending reports count (for notifications)
export const getPendingReportsCount = async (req, res) => {
  try {
    const count = await ReportModel.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      pendingReports: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending reports count',
      error: error.message,
    });
  }
};