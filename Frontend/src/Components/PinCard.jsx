import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { PinContext } from '../Context/PinContext';
import { UserContext } from '../Context/UserContext';

const reactionIcons = {
  like: '❤️',
  love: '😍',
  wow: '😮',
  sad: '😢',
  angry: '😡',
};

const PinCard = ({ pin }) => {
  const { reactToPin, fetchAllPins } = useContext(PinContext);
  const { currentUser, isAuthenticated } = useContext(UserContext);
  const [showReactions, setShowReactions] = useState(false);

  const handleReaction = async (e, reactionType) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) return;
    
    await reactToPin(pin._id, reactionType);
    await fetchAllPins();
    setShowReactions(false);
  };

  // Get user's current reaction
  const userReaction = currentUser && pin.reactions
    ? pin.reactions.find((r) => r.user.toString() === currentUser._id.toString())?.reaction
    : null;

  // Get total reaction count
  const totalReactions = Object.values(pin.reactionCounts || {}).reduce((a, b) => a + b, 0);

  return (
    <Link to={`/pin/${pin._id}`}>
      <div className='mt-5 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg dark:shadow-gray-900 cursor-pointer hover:scale-105 transition relative group'>
        <img
          src={pin.image}
          alt={pin.title}
          className='w-full object-cover'
        />
        
        <div className="p-3 flex flex-col">
          <p className='text-center font-semibold text-gray-900 dark:text-gray-100 mb-2'>
            {pin.title}
          </p>
          
          {/* Facebook-style Like Button */}
          <div className="flex items-center justify-between">
            {/* Reaction Button */}
            <div
              className="relative flex-1"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
              onClick={(e) => e.preventDefault()}
            >
              <button
                onClick={(e) => handleReaction(e, userReaction || 'like')}
                disabled={!isAuthenticated}
                className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                  userReaction
                    ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                    : 'bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
                } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-lg">
                  {userReaction ? reactionIcons[userReaction] : '👍'}
                </span>
                <span className="font-medium text-xs">
                  {userReaction ? userReaction.charAt(0).toUpperCase() + userReaction.slice(1) : 'Like'}
                </span>
              </button>

              {/* Reaction Picker - Appears on Hover */}
              {showReactions && isAuthenticated && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-neutral-800 shadow-2xl rounded-full px-2 py-2 flex gap-1 border border-gray-200 dark:border-neutral-700 z-20 animate-[slideUp_0.2s_ease-out]">
                  {Object.entries(reactionIcons).map(([type, icon]) => (
                    <button
                      key={type}
                      onClick={(e) => handleReaction(e, type)}
                      className="relative group/tooltip hover:scale-125 transition-transform duration-200 p-1"
                      title={type}
                    >
                      <span className="text-2xl">{icon}</span>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reaction Count Display */}
            {totalReactions > 0 && (
              <div className="flex items-center gap-1 ml-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex -space-x-1">
                  {Object.entries(pin.reactionCounts || {})
                    .filter(([_, count]) => count > 0)
                    .slice(0, 3)
                    .map(([type, _]) => (
                      <span
                        key={type}
                        className="inline-flex items-center justify-center w-5 h-5 bg-white dark:bg-neutral-700 rounded-full border border-gray-200 dark:border-neutral-600 text-xs"
                      >
                        {reactionIcons[type]}
                      </span>
                    ))}
                </div>
                <span className="font-medium">{totalReactions}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PinCard;