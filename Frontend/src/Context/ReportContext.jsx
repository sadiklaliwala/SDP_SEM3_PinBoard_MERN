import { createContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ReportContext = createContext();

const ReportContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

  // Create a report (User side)
  const createReport = async (reportData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${serverURL}/api/reports/create`,
        reportData,
        { withCredentials: true }
      );
      
      if (data.success) {
        toast.success(data.message);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit report');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Get user's own reports
  const getMyReports = async (page = 1, status = '') => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${serverURL}/api/reports/my-reports?page=${page}&limit=10${status ? `&status=${status}` : ''}`,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch reports');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Get all reports
  const getAllReports = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        ...(filters.status && { status: filters.status }),
        ...(filters.reportType && { reportType: filters.reportType }),
        ...(filters.reason && { reason: filters.reason }),
      });

      const { data } = await axios.get(
        `${serverURL}/api/reports/admin/all?${queryParams}`,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch reports');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Get report by ID
  const getReportById = async (reportId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${serverURL}/api/reports/admin/${reportId}`,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch report');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Review report
  const reviewReport = async (reportId, reviewData) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${serverURL}/api/reports/admin/${reportId}/review`,
        reviewData,
        { withCredentials: true }
      );
      
      if (data.success) {
        toast.success(data.message);
        return { success: true, data };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to review report');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Admin: Delete report
  const deleteReport = async (reportId) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `${serverURL}/api/reports/admin/${reportId}`,
        { withCredentials: true }
      );
      
      if (data.success) {
        toast.success(data.message);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete report');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Admin: Get pending reports count
  const getPendingReportsCount = async () => {
    try {
      const { data } = await axios.get(
        `${serverURL}/api/reports/admin/pending-count`,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return null;
    }
  };

  return (
    <ReportContext.Provider
      value={{
        loading,
        createReport,
        getMyReports,
        getAllReports,
        getReportById,
        reviewReport,
        deleteReport,
        getPendingReportsCount,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export default ReportContextProvider;