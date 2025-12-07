import React, { useContext, useEffect } from 'react';
import { PaymentContext } from '../Context/PaymentContext';
import { Loading } from '../Components/Loading';

const PaymentHistory = () => {
  const { paymentHistory, fetchPaymentHistory, loading } = useContext(PaymentContext);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return 'fa-circle-check';
      case 'failed':
        return 'fa-circle-xmark';
      case 'pending':
        return 'fa-clock';
      default:
        return 'fa-circle';
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-neutral-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Payment History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View all your payment transactions
          </p>
        </div>

        {/* Payment History List */}
        {paymentHistory.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-12 text-center">
            <i className="fa-solid fa-receipt text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              No Payment History
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You haven't made any payments yet. Purchase premium to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div
                key={payment._id}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Payment Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-indian-rupee-sign text-red-600 dark:text-red-400 text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {payment.description || 'Premium Subscription'}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>
                            <i className="fa-solid fa-calendar mr-1"></i>
                            {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span>
                            <i className="fa-solid fa-clock mr-1"></i>
                            {new Date(payment.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {payment.paymentId && (
                            <span className="font-mono text-xs">
                              ID: {payment.paymentId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Status */}
                  <div className="flex items-center gap-4 md:flex-col md:items-end">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        ₹{payment.amount}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {payment.currency}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      <i className={`fa-solid ${getStatusIcon(payment.status)}`}></i>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Additional Details (Collapsible) */}
                {payment.paymentMethod && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Payment Method:</span> {payment.paymentMethod}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {paymentHistory.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-receipt text-blue-600 dark:text-blue-400"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {paymentHistory.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-indian-rupee-sign text-green-600 dark:text-green-400"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ₹
                    {paymentHistory
                      .filter((p) => p.status === 'success')
                      .reduce((sum, p) => sum + p.amount, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-circle-check text-green-600 dark:text-green-400"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Successful</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {paymentHistory.filter((p) => p.status === 'success').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;