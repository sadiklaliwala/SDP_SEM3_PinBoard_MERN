import React, { useContext, useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AdminContext } from '../Context/AdminContext';
import { ReportContext } from '../Context/ReportContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminLogout } = useContext(AdminContext);
  const { getPendingReportsCount } = useContext(ReportContext);
  const [pendingReports, setPendingReports] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingReports();
    const interval = setInterval(fetchPendingReports, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchPendingReports = async () => {
    const result = await getPendingReportsCount();
    if (result) {
      setPendingReports(result.pendingReports);
    }
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: 'fa-chart-line',
      label: 'Dashboard',
    },
    {
      path: '/admin/users',
      icon: 'fa-users',
      label: 'Users',
    },
    {
      path: '/admin/pins',
      icon: 'fa-thumbtack',
      label: 'Pins',
    },
    {
      path: '/admin/comments',
      icon: 'fa-comments',
      label: 'Comments',
    },
    {
      path: '/admin/reports',
      icon: 'fa-flag',
      label: 'Reports',
      badge: pendingReports,
    },
    {
      path: '/admin/payments',
      icon: 'fa-credit-card',
      label: 'Payments',
    },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      adminLogout(navigate);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg fixed top-0 left-0 right-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <i className="fa-solid fa-bars text-xl"></i>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-shield-halved text-white"></i>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Admin Panel
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <i className={`fa-solid ${item.icon} text-lg w-5`}></i>
              <span className="font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-user-shield text-white"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="pt-16 lg:ml-64 min-h-screen">
        <div className="p-0 md:p-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;