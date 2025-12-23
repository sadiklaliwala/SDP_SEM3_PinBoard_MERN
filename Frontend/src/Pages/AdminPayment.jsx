import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../Context/AdminContext';
import { Loading } from '../Components/Loading';

const AdminPayment = () => {
  const { fetchAllPayments, payments, loading } = useContext(AdminContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    loadPayments();
  }, [currentPage, statusFilter]);

  const loadPayments = async () => {
    const data = await fetchAllPayments(currentPage, statusFilter);
    if (data) setTotalPages(data.totalPages);
  };

  if (loading && payments.length === 0) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Payments Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">All Razorpay transactions</p>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
        >
          <option value="">All Status</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Payment ID</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((pay) => (
                <tr key={pay._id} className="border-t">
                  <td className="p-4 text-sm">{pay.orderId || pay.razorpay_order_id || pay.razorpayOrderId || '—'}</td>
                  <td className="p-4 text-sm">{pay.paymentId || pay.razorpay_payment_id || pay.razorpayPaymentId || '—'}</td>
                  <td className="p-4">
                    <p className="font-medium">{pay.userId?.name || pay.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{pay.userId?.email || pay.user?.email || '—'}</p>
                  </td>
                  <td className="p-4 font-semibold">₹{pay.amount}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      pay.status === 'success'
                        ? 'bg-green-100 text-green-700'
                        : pay.status === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {pay.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{new Date(pay.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedPayment(pay)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">No payments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
          <p className="text-sm">Page {currentPage} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-xl w-full">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Payment Details</h2>
              <button onClick={() => setSelectedPayment(null)}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <p><strong>Order ID:</strong> {selectedPayment.orderId || selectedPayment.razorpay_order_id || selectedPayment.razorpayOrderId || '—'}</p>
              <p><strong>Payment ID:</strong> {selectedPayment.paymentId || selectedPayment.razorpay_payment_id || selectedPayment.razorpayPaymentId || '—'}</p>
              <p><strong>User:</strong> {selectedPayment.userId?.name || selectedPayment.user?.name || 'Unknown'}</p>
              <p><strong>Email:</strong> {selectedPayment.userId?.email || selectedPayment.user?.email || '—'}</p>
              <p><strong>Amount:</strong> ₹{selectedPayment.amount}</p>
              <p><strong>Status:</strong> {selectedPayment.status}</p>
              <p><strong>Date:</strong> {new Date(selectedPayment.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayment;