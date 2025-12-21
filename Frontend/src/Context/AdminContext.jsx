import axios from 'axios';
import { createContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pins, setPins] = useState([]);
  const [comments, setComments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const api = useMemo(() => {
    const backendUrl = "http://localhost:5000";
    return axios.create({
      baseURL: backendUrl,
      withCredentials: true,
    });
  }, []);

  // ==================== ADMIN AUTH ====================

  const adminLogin = async (email, password, navigate) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/admin/login', { email, password });
      if (data.success) {
        setIsAdminAuthenticated(true);
        toast.success('Admin logged in successfully');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const adminLogout = (navigate) => {
    setIsAdminAuthenticated(false);
    toast.success('Admin logged out successfully');
    navigate('/admin/login');
  };

  // ==================== DASHBOARD ====================

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/dashboard');
      if (data.success) {
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  // ==================== USERS ====================

  const fetchAllUsers = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/admin/users?page=${page}&limit=10&search=${search}`);
      if (data.success) {
        setUsers(data.users);
        return data;
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const { data } = await api.delete(`/api/admin/users/${userId}`);
      if (data.success) {
        toast.success('User deleted successfully');
        await fetchAllUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const blockUser = async (userId) => {
    try {
      const { data } = await api.put(`/api/admin/users/${userId}/block`);
      if (data.success) {
        toast.success('User blocked successfully');
        await fetchAllUsers();
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Failed to block user');
    }
  };

  const unblockUser = async (userId) => {
    try {
      const { data } = await api.put(`/api/admin/users/${userId}/unblock`);
      if (data.success) {
        toast.success('User unblocked successfully');
        await fetchAllUsers();
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error('Failed to unblock user');
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const { data } = await api.put(`/api/admin/users/${userId}`, userData);
      if (data.success) {
        toast.success('User updated successfully');
        await fetchAllUsers();
        return data.user;
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  // ==================== PINS ====================

  const fetchAllPins = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/admin/pins?page=${page}&limit=10&search=${search}`);
      if (data.success) {
        setPins(data.pins);
        return data;
      }
    } catch (error) {
      console.error('Error fetching pins:', error);
      toast.error('Failed to load pins');
    } finally {
      setLoading(false);
    }
  };

  const deletePin = async (pinId) => {
    try {
      const { data } = await api.delete(`/api/admin/pins/${pinId}`);
      if (data.success) {
        toast.success('Pin deleted successfully');
        await fetchAllPins();
      }
    } catch (error) {
      console.error('Error deleting pin:', error);
      toast.error('Failed to delete pin');
    }
  };

  const updatePin = async (pinId, pinData) => {
    try {
      const { data } = await api.put(`/api/admin/pins/${pinId}`, pinData);
      if (data.success) {
        toast.success('Pin updated successfully');
        await fetchAllPins();
        return data.pin;
      }
    } catch (error) {
      console.error('Error updating pin:', error);
      toast.error('Failed to update pin');
    }
  };

  // ==================== COMMENTS ====================

  const fetchAllComments = async (page = 1, pinId = '') => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/admin/comments?page=${page}&limit=10&pinId=${pinId}`);
      if (data.success) {
        setComments(data.comments);
        return data;
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const { data } = await api.delete(`/api/admin/comments/${commentId}`);
      if (data.success) {
        toast.success('Comment deleted successfully');
        await fetchAllComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  // ==================== PAYMENTS ====================

  const fetchAllPayments = async (page = 1, status = '') => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/admin/payments?page=${page}&limit=10&status=${status}`);
      if (data.success) {
        setPayments(data.payments);
        return data;
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const values = {
    loading,
    isAdminAuthenticated,
    dashboardStats,
    users,
    pins,
    comments,
    payments,
    adminLogin,
    adminLogout,
    fetchDashboardStats,
    fetchAllUsers,
    deleteUser,
    blockUser,
    unblockUser,
    updateUser,
    fetchAllPins,
    deletePin,
    updatePin,
    fetchAllComments,
    deleteComment,
    fetchAllPayments,
  };

  return <AdminContext.Provider value={values}>{children}</AdminContext.Provider>;
};

export default AdminContextProvider;