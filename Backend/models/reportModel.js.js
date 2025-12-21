import mongoose from 'mongoose';

const reportSchema = mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    reportType: {
      type: String,
      enum: ['user', 'pin', 'comment'],
      required: true,
    },
    
    // Reference to the reported item
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reportedPin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pin',
    },
    reportedComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    
    reason: {
      type: String,
      enum: [
        'spam',
        'harassment',
        'hate_speech',
        'violence',
        'nudity',
        'false_information',
        'copyright',
        'other'
      ],
      required: true,
    },
    
    description: {
      type: String,
      required: true,
      trim: true,
    },
    
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'rejected'],
      default: 'pending',
    },
    
    // Admin who reviewed the report
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    
    reviewedAt: {
      type: Date,
    },
    
    adminNotes: {
      type: String,
      trim: true,
    },
    
    // Action taken by admin
    actionTaken: {
      type: String,
      enum: ['none', 'warning', 'content_removed', 'user_blocked', 'false_report'],
      default: 'none',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ reportedBy: 1 });
reportSchema.index({ reportType: 1 });

const ReportModel = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default ReportModel;