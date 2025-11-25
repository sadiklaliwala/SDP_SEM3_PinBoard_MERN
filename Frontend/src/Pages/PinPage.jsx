import React, { useEffect, useState, useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Loading } from '../Components/Loading';
import { UserContext } from '../Context/UserContext';
import { PinContext } from '../Context/PinContext';
import CommentItem from '../Components/CommentItem';

const PinPage = () => {
  const { currentUser, isAuthenticated, navigate, toggleFollowUnfollow } =
    useContext(UserContext);
  const {
    fetchSinglePin,
    deletePin,
    createComment,
    deleteComment,
    togglePinLike,
  } = useContext(PinContext);

  const { pinId } = useParams();

  const [comment, setComment] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [localPin, setLocalPin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPin = async () => {
      setLoading(true);
      const pinData = await fetchSinglePin(pinId, true);
      if (isMounted) {
        setLocalPin(pinData);
        setLoading(false);
      }
    };

    loadPin();

    return () => {
      isMounted = false;
    };
  }, [pinId, fetchSinglePin]);

  if (loading) return <Loading />;

  if (!localPin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] dark:bg-neutral-900">
        <h2 className="text-2xl font-semibold text-red-600">Pin not found</h2>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          The pin you're looking for doesn't exist or was removed.
        </p>
      </div>
    );
  }

  const handleLike = () => togglePinLike(pinId);

  const handleCreateComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    createComment(comment, setComment, pinId);
  };

  const handleDeleteComment = (commentId) => deleteComment(pinId, commentId);
  const handleDeletePin = () => deletePin(pinId);
  const handleUpdatePin = () => {
    setMenuVisible(false);
    navigate(`/edit-pin/${pinId}`);
  };

  const handleFollowUser = () => {
    if (localPin.owner && localPin.owner._id) {
      toggleFollowUnfollow(localPin.owner._id);
    }
  };

  const isOwner =
    currentUser && localPin.owner && currentUser._id === localPin.owner._id;

  const isFollowing = (localPin.owner.followers || [])
    .map((id) => id.toString())
    .includes(currentUser._id.toString());

  return (
    <div className="mx-5 md:mx-8 lg:mx-14 xl:mx-[72px] flex items-center justify-center dark:bg-neutral-900">
      <div className="mt-16 flex flex-col md:flex-row items-stretch bg-white dark:bg-neutral-800 shadow-lg rounded-2xl overflow-hidden w-full md:max-h-[90vh] max-w-6xl border border-gray-400 dark:border-neutral-700">
        
        {/* Left - Image */}
        <div className="w-full md:w-1/2 h-96 md:h-auto min-h-[80vh] bg-white dark:bg-neutral-800">
          <img
            src={localPin.image}
            alt={localPin.title}
            className="w-full h-full object-contain md:object-cover"
            loading="lazy"
          />
        </div>

        {/* Right - Details */}
        <div className="w-full md:w-1/2 flex flex-col bg-amber-50 dark:bg-neutral-900 h-auto max-h-screen relative">
          <div className="py-2 px-3 overflow-y-auto flex-1">

            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between z-10 dark:bg-neutral-900">
              <div className="flex items-center space-x-4">

                {/* Like Button */}
                <button
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={handleLike}
                >
                  <i
                    className={`fa-solid fa-heart text-xl ${
                      localPin.likedBy.includes(currentUser._id)
                        ? 'text-red-600'
                        : 'text-gray-500 dark:text-gray-300'
                    }`}
                  ></i>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {localPin.likes}
                  </p>
                </button>

                {/* Share */}
                <button className="px-2 py-1 bg-gray-200 dark:bg-neutral-700 rounded-full hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors cursor-pointer">
                  <i className="fa-solid fa-share text-lg dark:text-gray-200"></i>
                </button>

                {/* Menu */}
                {isOwner && isAuthenticated && (
                  <div className="relative">
                    <button
                      onClick={() => setMenuVisible(!menuVisible)}
                      className="px-2 py-1 bg-gray-200 dark:bg-neutral-700 rounded-full hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors cursor-pointer"
                    >
                      <i className="fa-solid fa-ellipsis text-lg dark:text-gray-200"></i>
                    </button>

                    {menuVisible && (
                      <div className="absolute left-1 mt-2 w-36 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-md shadow-lg z-10">
                        <ul className="py-2">
                          <li
                            onClick={handleUpdatePin}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer text-gray-800 dark:text-gray-200"
                          >
                            Edit Pin
                          </li>
                          <li
                            onClick={handleDeletePin}
                            className="px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer"
                          >
                            Delete Pin
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors cursor-pointer">
                Save
              </button>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-semibold mt-4 text-gray-800 dark:text-gray-100">
              {localPin.title || 'Untitled Pin'}
            </h1>

            {/* Owner */}
            {localPin.owner && (
              <div className="flex items-center justify-between mt-4">
                <NavLink to={`/user/${localPin.owner._id}`}>
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        localPin.owner.image ||
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s'
                      }
                      alt="Creator"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <p className="text-base font-medium text-gray-800 dark:text-gray-100">
                        {localPin.owner.name}
                      </p>
                      <p className="text-sm text-gray-800 dark:text-gray-300 font-medium flex items-center gap-1">
                        {localPin.owner.followers.length || 0} Followers
                      </p>
                    </div>
                  </div>
                </NavLink>

                {isAuthenticated && currentUser._id !== localPin.owner._id && (
                  <button
                    onClick={handleFollowUser}
                    type="button"
                    className="bg-gray-200 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600 font-medium py-2 px-4 rounded-full cursor-pointer dark:text-gray-200"
                  >
                    {isFollowing ? 'UnFollow' : 'Follow'}
                  </button>
                )}
              </div>
            )}

            {/* Description */}
            <div className="max-h-24 overflow-y-auto">
              <p className="mt-4 text-base break-words w-full text-gray-800 dark:text-gray-300">
                {localPin.description || 'No description provided'}
              </p>
            </div>

            {/* Comments */}
            {localPin.comments?.length > 0 && (
              <div className="my-3">
                <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-100">
                  Comments ({localPin.comments.length || 0})
                </h3>
                <div className="max-h-44 overflow-y-auto">
                  {localPin.comments.map((commentData) => (
                    <CommentItem
                      key={commentData._id}
                      commentData={commentData}
                      onDelete={handleDeleteComment}
                      currentUserId={currentUser._id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comment Input */}
          <form
            onSubmit={handleCreateComment}
            className="sticky bottom-0 bg-amber-50 dark:bg-neutral-900 py-2 px-3 border-t border-gray-300 dark:border-neutral-700 flex items-center gap-2"
          >
            <input
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              type="text"
              placeholder="Add a comment..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring focus:ring-red-600"
            />
            <button
              type="submit"
              disabled={!comment.trim()}
              className="p-2 rounded-full cursor-pointer"
            >
              <i className="fa-solid fa-paper-plane text-xl text-red-500"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PinPage;