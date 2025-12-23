import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../Context/AdminContext';
import { Loading } from '../Components/Loading';

const AdminComments = () => {
  const { fetchAllComments, deleteComment, comments, loading } = useContext(AdminContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadComments();
  }, [currentPage]);

  const loadComments = async () => {
    const data = await fetchAllComments(currentPage);
    if (data) {
      setTotalPages(data.totalPages);
    }
  };

  const handleDelete = async (commentId, commentText) => {
    const preview = commentText.length > 50 ? commentText.substring(0, 50) + '...' : commentText;
    if (window.confirm(`Are you sure you want to delete this comment?\n\n"${preview}"`)) {
      await deleteComment(commentId);
    }
  };

  if (loading && comments.length === 0) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Comments Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Moderate all comments posted by users
          </p>
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex gap-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      {comment.owner?.profileImage ? (
                        <img
                          src={comment.owner.profileImage}
                          alt={comment.owner.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <i className="fa-solid fa-user text-gray-600 dark:text-gray-300"></i>
                      )}
                    </div>
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {comment.owner?.name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {comment.owner?.email || 'N/A'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(comment._id, comment.comment)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete Comment"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>

                    <p className="text-gray-900 dark:text-gray-100 mb-3 whitespace-pre-wrap">
                      {comment.comment}
                    </p>

                    {/* Pin Info */}
                    {comment.pin && (
                      <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        {comment.pin.image && (
                          <img
                            src={comment.pin.image}
                            alt={comment.pin.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            On: {comment.pin.title || 'Unknown Pin'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Date */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                      Posted: {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <i className="fa-solid fa-comments text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
              <p className="text-gray-500 dark:text-gray-400 text-lg">No comments found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComments;