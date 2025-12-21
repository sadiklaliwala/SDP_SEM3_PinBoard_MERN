import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../Context/AdminContext';
import { Loading } from '../Components/Loading';

const AdminPins = () => {
  const { fetchAllPins, deletePin, pins, loading } = useContext(AdminContext);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPin, setSelectedPin] = useState(null);

  useEffect(() => {
    loadPins();
  }, [currentPage, search]);

  const loadPins = async () => {
    const data = await fetchAllPins(currentPage, search);
    if (data) {
      setTotalPages(data.totalPages);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (pinId, pinTitle) => {
    if (window.confirm(`Are you sure you want to delete pin "${pinTitle}"? This will also delete all comments on this pin.`)) {
      await deletePin(pinId);
    }
  };

  if (loading && pins.length === 0) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Pins Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all pins posted by users
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fa-solid fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by title, description, or category..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Pins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pins.length > 0 ? (
          pins.map((pin) => (
            <div
              key={pin._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            >
              {/* Pin Image */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                <img
                  src={pin.image}
                  alt={pin.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => setSelectedPin(pin)}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg"
                    title="View Details"
                  >
                    <i className="fa-solid fa-eye text-sm"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(pin._id, pin.title)}
                    className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg"
                    title="Delete Pin"
                  >
                    <i className="fa-solid fa-trash text-sm"></i>
                  </button>
                </div>
              </div>

              {/* Pin Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  {pin.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {pin.description}
                </p>

                {/* Category */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                    {pin.category}
                  </span>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span title="Reactions">
                      <i className="fa-solid fa-heart text-red-500 mr-1"></i>
                      {Object.values(pin.reactionCounts || {}).reduce((a, b) => a + b, 0)}
                    </span>
                    <span title="Comments">
                      <i className="fa-solid fa-comment mr-1"></i>
                      {pin.comments?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Owner */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    {pin.owner?.profileImage ? (
                      <img
                        src={pin.owner.profileImage}
                        alt={pin.owner.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <i className="fa-solid fa-user text-xs text-gray-600 dark:text-gray-300"></i>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {pin.owner?.name || 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Posted: {new Date(pin.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <i className="fa-solid fa-thumbtack text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <p className="text-gray-500 dark:text-gray-400 text-lg">No pins found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pin Details Modal */}
      {selectedPin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Pin Details
              </h2>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image */}
              <div>
                <img
                  src={selectedPin.image}
                  alt={selectedPin.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Title</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                    {selectedPin.title}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedPin.description}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <span className="inline-block mt-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full">
                    {selectedPin.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Reactions</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {Object.values(selectedPin.reactionCounts || {}).reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Comments</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {selectedPin.comments?.length || 0}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Posted By</p>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      {selectedPin.owner?.profileImage ? (
                        <img
                          src={selectedPin.owner.profileImage}
                          alt={selectedPin.owner.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <i className="fa-solid fa-user text-gray-600 dark:text-gray-300"></i>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedPin.owner?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedPin.owner?.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Posted Date</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(selectedPin.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPins;