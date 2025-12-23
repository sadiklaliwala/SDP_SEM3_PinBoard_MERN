import React, { useContext, useEffect, useState } from 'react';
import { ReportContext } from '../Context/ReportContext';

const AdminReports = () => {
  const { getAllReports, getReportById, deleteReport, loading } = useContext(ReportContext);
  
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusCounts, setStatusCounts] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    reportType: '',
    reason: '',
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [currentPage, filters]);

  const fetchReports = async () => {
    const result = await getAllReports(currentPage, filters);
    if (result) {
      setReports(result.reports);
      setTotalPages(result.totalPages);
      setStatusCounts(result.statusCounts);
    }
  };

  const handleViewDetails = async (reportId) => {
    const result = await getReportById(reportId);
    if (result) {
      setSelectedReport(result.report);
      setShowReviewModal(true);
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      const result = await deleteReport(reportId);
      if (result.success) {
        fetchReports();
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return styles[status] || styles.pending;
  };

  const getStatusCount = (status) => {
    const found = statusCounts.find(s => s._id === status);
    return found ? found.count : 0;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Reports Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and manage user reports
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {['pending', 'reviewed', 'resolved', 'rejected'].map((status) => (
          <div key={status} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{status}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {getStatusCount(status)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusBadge(status)}`}>
                <i className="fa-solid fa-flag text-xl"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Report Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Type
            </label>
            <select
              value={filters.reportType}
              onChange={(e) => {
                setFilters({ ...filters, reportType: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Types</option>
              <option value="user">User</option>
              <option value="pin">Pin</option>
              <option value="comment">Comment</option>
            </select>
          </div>

          {/* Reason Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason
            </label>
            <select
              value={filters.reason}
              onChange={(e) => {
                setFilters({ ...filters, reason: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Reasons</option>
              <option value="spam">Spam</option>
              <option value="harassment">Harassment</option>
              <option value="hate_speech">Hate Speech</option>
              <option value="violence">Violence</option>
              <option value="nudity">Nudity</option>
              <option value="false_information">False Information</option>
              <option value="copyright">Copyright</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      {loading ? (
        <div className="text-center py-12">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-purple-600"></i>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
          <i className="fa-solid fa-inbox text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">No reports found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {report.reportedBy?.profileImage ? (
                            <img
                              src={report.reportedBy.profileImage}
                              alt={report.reportedBy.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                              {report.reportedBy?.name?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {report.reportedBy?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            @{report.reportedBy?.username || 'unknown'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {report.reportType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {report.reason.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(report._id)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View Details"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(report._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-purple-600 text-white rounded-lg">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedReport && (
        <ReviewReportModal
          report={selectedReport}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedReport(null);
          }}
          onSuccess={() => {
            fetchReports();
            setShowReviewModal(false);
            setSelectedReport(null);
          }}
        />
      )}
    </div>
  );
};

// Review Report Modal Component
const ReviewReportModal = ({ report, onClose, onSuccess }) => {
  const { reviewReport, loading } = useContext(ReportContext);
  
  const [formData, setFormData] = useState({
    status: report.status,
    actionTaken: report.actionTaken || 'none',
    adminNotes: report.adminNotes || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await reviewReport(report._id, formData);
    if (result.success) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Review Report
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>

        {/* Report Details */}
        <div className="space-y-4 mb-6">
          {/* Reporter Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Reporter</h3>
            <div className="flex items-center gap-3">
              {report.reportedBy?.profileImage ? (
                <img
                  src={report.reportedBy.profileImage}
                  alt={report.reportedBy.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                  {report.reportedBy?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{report.reportedBy?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{report.reportedBy?.email}</p>
              </div>
            </div>
          </div>

          {/* Reported Item Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Reported {report.reportType.charAt(0).toUpperCase() + report.reportType.slice(1)}
            </h3>
            {report.reportType === 'user' && report.reportedUser && (
              <div className="flex items-center gap-3">
                <img
                  src={report.reportedUser.profileImage || '/default-avatar.png'}
                  alt={report.reportedUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{report.reportedUser.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">@{report.reportedUser.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{report.reportedUser.email}</p>
                </div>
              </div>
            )}
            {report.reportType === 'pin' && report.reportedPin && (
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{report.reportedPin.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{report.reportedPin.description}</p>
              </div>
            )}
            {report.reportType === 'comment' && report.reportedComment && (
              <p className="text-gray-900 dark:text-white">{report.reportedComment.comment}</p>
            )}
          </div>

          {/* Report Details */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Report Details</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Reason:</span>{' '}
                <span className="text-gray-900 dark:text-white">{report.reason.replace('_', ' ')}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Description:</span>{' '}
                <span className="text-gray-900 dark:text-white">{report.description}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Submitted:</span>{' '}
                <span className="text-gray-900 dark:text-white">{new Date(report.createdAt).toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Action Taken */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Action Taken
              </label>
              <select
                value={formData.actionTaken}
                onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="none">No Action</option>
                <option value="warning">Warning Issued</option>
                <option value="content_removed">Content Removed</option>
                <option value="user_blocked">User Blocked</option>
                <option value="false_report">False Report</option>
              </select>
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Admin Notes
            </label>
            <textarea
              value={formData.adminNotes}
              onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
              placeholder="Add any notes about your decision..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminReports;