import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../Context/AdminContext';
import { Loading } from '../Components/Loading';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { fetchDashboardStats, dashboardStats, loading } = useContext(AdminContext);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading && !dashboardStats) return <Loading />;

  const stats = dashboardStats?.stats || {};
  const recentUsers = dashboardStats?.recentUsers || [];
  const recentPins = dashboardStats?.recentPins || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome to the admin panel
          </p>
        </div>
        <button
          onClick={fetchDashboardStats}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <i className="fa-solid fa-refresh"></i>
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold mt-2">{stats.totalUsers || 0}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-users text-2xl"></i>
            </div>
          </div>
          <Link
            to="/admin/users"
            className="mt-4 text-sm text-blue-100 hover:text-white inline-flex items-center gap-1"
          >
            View all users <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Total Pins */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Pins</p>
              <p className="text-3xl font-bold mt-2">{stats.totalPins || 0}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-thumbtack text-2xl"></i>
            </div>
          </div>
          <Link
            to="/admin/pins"
            className="mt-4 text-sm text-purple-100 hover:text-white inline-flex items-center gap-1"
          >
            View all pins <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Total Comments */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Comments</p>
              <p className="text-3xl font-bold mt-2">{stats.totalComments || 0}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-comments text-2xl"></i>
            </div>
          </div>
          <Link
            to="/admin/comments"
            className="mt-4 text-sm text-green-100 hover:text-white inline-flex items-center gap-1"
          >
            View all comments <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Premium Users */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Premium Users</p>
              <p className="text-3xl font-bold mt-2">{stats.premiumUsers || 0}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-crown text-2xl"></i>
            </div>
          </div>
          <Link
            to="/admin/payments"
            className="mt-4 text-sm text-yellow-100 hover:text-white inline-flex items-center gap-1"
          >
            View payments <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Revenue Overview
            </h2>
            <i className="fa-solid fa-indian-rupee-sign text-green-600 text-2xl"></i>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                ₹{stats.totalRevenue || 0}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Payments</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalPayments || 0}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">Avg. Payment</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{stats.totalPayments ? Math.round(stats.totalRevenue / stats.totalPayments) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/admin/users"
              className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-center"
            >
              <i className="fa-solid fa-users text-2xl text-blue-600 dark:text-blue-400 mb-2"></i>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Manage Users</p>
            </Link>
            <Link
              to="/admin/pins"
              className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors text-center"
            >
              <i className="fa-solid fa-thumbtack text-2xl text-purple-600 dark:text-purple-400 mb-2"></i>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Manage Pins</p>
            </Link>
            <Link
              to="/admin/comments"
              className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors text-center"
            >
              <i className="fa-solid fa-comments text-2xl text-green-600 dark:text-green-400 mb-2"></i>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Manage Comments</p>
            </Link>
            <Link
              to="/admin/payments"
              className="p-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors text-center"
            >
              <i className="fa-solid fa-credit-card text-2xl text-yellow-600 dark:text-yellow-400 mb-2"></i>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">View Payments</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recent Users
            </h2>
            <Link to="/admin/users" className="text-sm text-red-600 hover:text-red-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-user text-gray-600 dark:text-gray-300"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  {user.isPremium && (
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                      Premium
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">No users yet</p>
            )}
          </div>
        </div>

        {/* Recent Pins */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recent Pins
            </h2>
            <Link to="/admin/pins" className="text-sm text-red-600 hover:text-red-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentPins.length > 0 ? (
              recentPins.map((pin) => (
                <div key={pin._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <img
                    src={pin.image}
                    alt={pin.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{pin.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      by {pin.owner?.name || 'Unknown'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">No pins yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;