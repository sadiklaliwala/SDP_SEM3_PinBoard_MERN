// import React, { useEffect, useState, useContext } from 'react';
// import { NavLink, useParams } from 'react-router-dom';
// import { Loading } from '../Components/Loading';
// import { UserContext } from '../Context/UserContext';
// import { PinContext } from '../Context/PinContext';
// import CommentItem from '../Components/CommentItem';

// const reactionsList = ['like', 'love', 'wow', 'sad', 'angry'];
// const reactionIcons = {
//   like: '❤️',
//   love: '😍',
//   wow: '😮',
//   sad: '😢',
//   angry: '😡',
// };

// const PinPage = () => {
//   const { currentUser, isAuthenticated, navigate, toggleFollowUnfollow } =
//     useContext(UserContext);
//   const {
//     fetchSinglePin,
//     deletePin,
//     createComment,
//     deleteComment,
//     reactToPin,
//   } = useContext(PinContext);

//   const { pinId } = useParams();

//   const [comment, setComment] = useState('');
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [localPin, setLocalPin] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showReactionPicker, setShowReactionPicker] = useState(false);

//   useEffect(() => {
//     let isMounted = true;

//     const loadPin = async () => {
//       setLoading(true);
//       const pinData = await fetchSinglePin(pinId, true);
//       if (isMounted) {
//         setLocalPin(pinData);
//         setLoading(false);
//       }
//     };

//     loadPin();

//     return () => {
//       isMounted = false;
//     };
//   }, [pinId, fetchSinglePin]);

//   if (loading) return <Loading />;

//   if (!localPin) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] dark:bg-neutral-900">
//         <h2 className="text-2xl font-semibold text-red-600">Pin not found</h2>
//         <p className="mt-4 text-gray-700 dark:text-gray-300">
//           The pin you're looking for doesn't exist or was removed.
//         </p>
//       </div>
//     );
//   }

//   // Handle reaction
//   const handleReaction = async (reactionType) => {
//     if (!isAuthenticated) return;
    
//     await reactToPin(pinId, reactionType);
    
//     // Refresh pin data
//     const updatedPin = await fetchSinglePin(pinId, true);
//     setLocalPin(updatedPin);
//     setShowReactionPicker(false);
//   };

//   const handleCreateComment = (e) => {
//     e.preventDefault();
//     if (!comment.trim()) return;
//     createComment(comment, setComment, pinId);
//   };

//   const handleDeleteComment = (commentId) => deleteComment(pinId, commentId);
//   const handleDeletePin = () => deletePin(pinId);
//   const handleUpdatePin = () => {
//     setMenuVisible(false);
//     navigate(`/edit-pin/${pinId}`);
//   };

//   const handleFollowUser = () => {
//     if (localPin.owner && localPin.owner._id) {
//       toggleFollowUnfollow(localPin.owner._id);
//     }
//   };

//   const isOwner =
//     currentUser && localPin.owner && currentUser._id === localPin.owner._id;

//   const isFollowing = (localPin.owner.followers || [])
//     .map((id) => id.toString())
//     .includes(currentUser._id.toString());

//   // Get user's current reaction
//   const userReaction = currentUser && localPin.reactions
//     ? localPin.reactions.find((r) => r.user.toString() === currentUser._id.toString())?.reaction
//     : null;

//   // Get total reactions
//   const totalReactions = Object.values(localPin.reactionCounts || {}).reduce((a, b) => a + b, 0);

//   return (
//     <div className="mx-5 md:mx-8 lg:mx-14 xl:mx-[72px] flex items-center justify-center dark:bg-neutral-900">
//       <div className="mt-16 flex flex-col md:flex-row items-stretch bg-white dark:bg-neutral-800 shadow-lg rounded-2xl overflow-hidden w-full md:max-h-[90vh] max-w-6xl border border-gray-400 dark:border-neutral-700">
        
//         {/* Left - Image */}
//         <div className="w-full md:w-1/2 h-96 md:h-auto min-h-[80vh] bg-white dark:bg-neutral-800">
//           <img
//             src={localPin.image}
//             alt={localPin.title}
//             className="w-full h-full object-contain md:object-cover"
//             loading="lazy"
//           />
//         </div>

//         {/* Right - Details */}
//         <div className="w-full md:w-1/2 flex flex-col bg-amber-50 dark:bg-neutral-900 h-auto max-h-screen relative">
//           <div className="py-2 px-3 overflow-y-auto flex-1">

//             {/* Header */}
//             <div className="sticky top-0 flex items-center justify-between z-10 bg-amber-50 dark:bg-neutral-900 pb-2">
//               <div className="flex items-center space-x-3">

//                 {/* Facebook-style Like Button with Reaction Picker */}
//                 <div 
//                   className="relative"
//                   onMouseEnter={() => setShowReactionPicker(true)}
//                   onMouseLeave={() => setShowReactionPicker(false)}
//                 >
//                   {/* Main Like Button */}
//                   <button
//                     onClick={() => handleReaction(userReaction || 'like')}
//                     disabled={!isAuthenticated}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
//                       userReaction
//                         ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
//                         : 'bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
//                     } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
//                   >
//                     <span className="text-xl">
//                       {userReaction ? reactionIcons[userReaction] : '👍'}
//                     </span>
//                     <span className="font-medium text-sm">
//                       {userReaction ? userReaction.charAt(0).toUpperCase() + userReaction.slice(1) : 'Like'}
//                     </span>
//                     {totalReactions > 0 && (
//                       <span className="text-xs bg-white dark:bg-neutral-800 px-2 py-0.5 rounded-full">
//                         {totalReactions}
//                       </span>
//                     )}
//                   </button>

//                   {/* Reaction Picker - Appears on Hover */}
//                   {showReactionPicker && isAuthenticated && (
//                     <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-neutral-800 shadow-2xl rounded-full px-3 py-2 flex gap-2 border border-gray-200 dark:border-neutral-700 animate-[slideUp_0.2s_ease-out]">
//                       {reactionsList.map((reaction) => (
//                         <button
//                           key={reaction}
//                           onClick={() => handleReaction(reaction)}
//                           className="relative group"
//                           title={reaction}
//                         >
//                           <div className="flex flex-col items-center hover:scale-125 transition-transform duration-200">
//                             <span className="text-3xl">{reactionIcons[reaction]}</span>
//                           </div>
//                           {/* Tooltip */}
//                           <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                             {reaction.charAt(0).toUpperCase() + reaction.slice(1)}
//                           </div>
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Share */}
//                 <button className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 rounded-full hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors cursor-pointer flex items-center gap-2">
//                   <i className="fa-solid fa-share text-lg dark:text-gray-200"></i>
//                   <span className="font-medium text-sm text-gray-600 dark:text-gray-300">Share</span>
//                 </button>

//                 {/* Menu */}
//                 {isOwner && isAuthenticated && (
//                   <div className="relative">
//                     <button
//                       onClick={() => setMenuVisible(!menuVisible)}
//                       className="px-2 py-1 bg-gray-200 dark:bg-neutral-700 rounded-full hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors cursor-pointer"
//                     >
//                       <i className="fa-solid fa-ellipsis text-lg dark:text-gray-200"></i>
//                     </button>

//                     {menuVisible && (
//                       <div className="absolute left-1 mt-2 w-36 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-md shadow-lg z-10">
//                         <ul className="py-2">
//                           <li
//                             onClick={handleUpdatePin}
//                             className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer text-gray-800 dark:text-gray-200"
//                           >
//                             Edit Pin
//                           </li>
//                           <li
//                             onClick={handleDeletePin}
//                             className="px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer"
//                           >
//                             Delete Pin
//                           </li>
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors cursor-pointer">
//                 Save
//               </button>
//             </div>

//             {/* Reaction Summary (show who reacted) */}
//             {totalReactions > 0 && (
//               <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//                 <div className="flex -space-x-1">
//                   {Object.entries(localPin.reactionCounts || {})
//                     .filter(([_, count]) => count > 0)
//                     .slice(0, 3)
//                     .map(([type, _]) => (
//                       <span
//                         key={type}
//                         className="inline-flex items-center justify-center w-6 h-6 bg-white dark:bg-neutral-800 rounded-full border border-gray-200 dark:border-neutral-700"
//                       >
//                         {reactionIcons[type]}
//                       </span>
//                     ))}
//                 </div>
//                 <span>{totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}</span>
//               </div>
//             )}

//             {/* Title */}
//             <h1 className="text-3xl font-semibold mt-4 text-gray-800 dark:text-gray-100">
//               {localPin.title || 'Untitled Pin'}
//             </h1>

//             {/* Owner */}
//             {localPin.owner && (
//               <div className="flex items-center justify-between mt-4">
//                 <NavLink to={`/user/${localPin.owner._id}`}>
//                   <div className="flex items-center gap-2">
//                     <img
//                       src={
//                         localPin.owner.image ||
//                         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s'
//                       }
//                       alt="Creator"
//                       className="w-8 h-8 rounded-full object-cover"
//                     />
//                     <div className="flex flex-col">
//                       <p className="text-base font-medium text-gray-800 dark:text-gray-100">
//                         {localPin.owner.name}
//                       </p>
//                       <p className="text-sm text-gray-800 dark:text-gray-300 font-medium flex items-center gap-1">
//                         {localPin.owner.followers.length || 0} Followers
//                       </p>
//                     </div>
//                   </div>
//                 </NavLink>

//                 {isAuthenticated && currentUser._id !== localPin.owner._id && (
//                   <button
//                     onClick={handleFollowUser}
//                     type="button"
//                     className="bg-gray-200 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600 font-medium py-2 px-4 rounded-full cursor-pointer dark:text-gray-200"
//                   >
//                     {isFollowing ? 'UnFollow' : 'Follow'}
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* Description */}
//             <div className="max-h-24 overflow-y-auto">
//               <p className="mt-4 text-base break-words w-full text-gray-800 dark:text-gray-300">
//                 {localPin.description || 'No description provided'}
//               </p>
//             </div>

//             {/* Comments */}
//             {localPin.comments?.length > 0 && (
//               <div className="my-3">
//                 <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-100">
//                   Comments ({localPin.comments.length || 0})
//                 </h3>
//                 <div className="max-h-44 overflow-y-auto">
//                   {localPin.comments.map((commentData) => (
//                     <CommentItem
//                       key={commentData._id}
//                       commentData={commentData}
//                       onDelete={handleDeleteComment}
//                       currentUserId={currentUser._id}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Comment Input */}
//           <form
//             onSubmit={handleCreateComment}
//             className="sticky bottom-0 bg-amber-50 dark:bg-neutral-900 py-2 px-3 border-t border-gray-300 dark:border-neutral-700 flex items-center gap-2"
//           >
//             <input
//               onChange={(e) => setComment(e.target.value)}
//               value={comment}
//               type="text"
//               placeholder="Add a comment..."
//               className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring focus:ring-red-600"
//             />
//             <button
//               type="submit"
//               disabled={!comment.trim()}
//               className="p-2 rounded-full cursor-pointer"
//             >
//               <i className="fa-solid fa-paper-plane text-xl text-red-500"></i>
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PinPage;

import React, { useEffect, useState, useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Loading } from '../Components/Loading';
import { UserContext } from '../Context/UserContext';
import { PinContext } from '../Context/PinContext';
import CommentItem from '../Components/CommentItem';
import ReportModal from '../Components/ReportModal';

const reactionsList = ['like', 'love', 'wow', 'sad', 'angry'];
const reactionIcons = {
  like: '❤️',
  love: '😍',
  wow: '😮',
  sad: '😢',
  angry: '😡',
};

const PinPage = () => {
  const { currentUser, isAuthenticated, navigate, toggleFollowUnfollow } =
    useContext(UserContext);
  const {
    fetchSinglePin,
    deletePin,
    createComment,
    deleteComment,
    reactToPin,
  } = useContext(PinContext);

  const { pinId } = useParams();

  const [comment, setComment] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [localPin, setLocalPin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

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

  const handleReaction = async (reactionType) => {
    if (!isAuthenticated) return;
    
    await reactToPin(pinId, reactionType);
    
    const updatedPin = await fetchSinglePin(pinId, true);
    setLocalPin(updatedPin);
    setShowReactionPicker(false);
  };

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

  const userReaction = currentUser && localPin.reactions
    ? localPin.reactions.find((r) => r.user.toString() === currentUser._id.toString())?.reaction
    : null;

  const totalReactions = Object.values(localPin.reactionCounts || {}).reduce((a, b) => a + b, 0);

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
            <div className="sticky top-0 flex items-center justify-between z-10 bg-amber-50 dark:bg-neutral-900 pb-2">
              <div className="flex items-center space-x-3">

                {/* Facebook-style Like Button with Reaction Picker */}
                <div 
                  className="relative"
                  onMouseEnter={() => setShowReactionPicker(true)}
                  onMouseLeave={() => setShowReactionPicker(false)}
                >
                  <button
                    onClick={() => handleReaction(userReaction || 'like')}
                    disabled={!isAuthenticated}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                      userReaction
                        ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                        : 'bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
                    } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="text-xl">
                      {userReaction ? reactionIcons[userReaction] : '👍'}
                    </span>
                    <span className="font-medium text-sm">
                      {userReaction ? userReaction.charAt(0).toUpperCase() + userReaction.slice(1) : 'Like'}
                    </span>
                    {totalReactions > 0 && (
                      <span className="text-xs bg-white dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                        {totalReactions}
                      </span>
                    )}
                  </button>

                  {showReactionPicker && isAuthenticated && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-neutral-800 shadow-2xl rounded-full px-3 py-2 flex gap-2 border border-gray-200 dark:border-neutral-700 animate-[slideUp_0.2s_ease-out]">
                      {reactionsList.map((reaction) => (
                        <button
                          key={reaction}
                          onClick={() => handleReaction(reaction)}
                          className="relative group"
                          title={reaction}
                        >
                          <div className="flex flex-col items-center hover:scale-125 transition-transform duration-200">
                            <span className="text-3xl">{reactionIcons[reaction]}</span>
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {reaction.charAt(0).toUpperCase() + reaction.slice(1)}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Share */}
                <button className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 rounded-full hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors cursor-pointer flex items-center gap-2">
                  <i className="fa-solid fa-share text-lg dark:text-gray-200"></i>
                  <span className="font-medium text-sm text-gray-600 dark:text-gray-300">Share</span>
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

                {/* Report Button - Only show if not owner */}
                {!isOwner && isAuthenticated && (
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="px-2 py-1 bg-gray-200 dark:bg-neutral-700 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors cursor-pointer"
                    title="Report Pin"
                  >
                    <i className="fa-solid fa-flag text-lg text-red-600 dark:text-red-400"></i>
                  </button>
                )}
              </div>

              <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors cursor-pointer">
                Save
              </button>
            </div>

            {/* Reaction Summary */}
            {totalReactions > 0 && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex -space-x-1">
                  {Object.entries(localPin.reactionCounts || {})
                    .filter(([_, count]) => count > 0)
                    .slice(0, 3)
                    .map(([type, _]) => (
                      <span
                        key={type}
                        className="inline-flex items-center justify-center w-6 h-6 bg-white dark:bg-neutral-800 rounded-full border border-gray-200 dark:border-neutral-700"
                      >
                        {reactionIcons[type]}
                      </span>
                    ))}
                </div>
                <span>{totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}</span>
              </div>
            )}

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

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportType="pin"
        itemId={pinId}
        itemDetails={localPin.title}
      />
    </div>
  );
};

export default PinPage;