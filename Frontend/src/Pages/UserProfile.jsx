// import React, { useContext, useEffect } from 'react';
// import { UserContext } from '../Context/UserContext';
// import { PinContext } from '../Context/PinContext';
// import { NavLink, useParams } from 'react-router-dom';
// import ProfileHeader from '../Components/ProfileHeader';
// import PinCard from '../Components/PinCard';
// import { Loading } from '../Components/Loading';

// const UserProfile = () => {
//   const { loading, fetchUser, user } = useContext(UserContext);
//   const { pins } = useContext(PinContext);

//   const { userId } = useParams();

//   // Fetch user profile when component mounts or userId changes
//   useEffect(() => {
//     let isMounted = true;

//     const loadUser = async () => {
//       if (isMounted) {
//         await fetchUser(userId);
//       }
//     };

//     loadUser();

//     return () => {
//       isMounted = false;
//     };
//   }, [userId]);

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
//         <Loading />
//       </div>
//     );

//   // filter pins based on user ID
//   const userPins = pins.filter((pin) => pin.owner._id === user._id);

//   return (
//     <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-900">
//       <ProfileHeader user={user} />

//       <hr className="border-gray-600 dark:border-gray-400 w-full mt-5" />

//       {userPins.length === 0 && (
//         <div className="flex flex-col items-center gap-3 justify-center min-h-[40vh] text-gray-800 dark:text-gray-100">
//           <p className="mt-4">
//             Nothing to show...yet! Pins you create will live here.
//           </p>
//           <NavLink to="/create-pin">
//             <button className="py-2 px-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer">
//               Create Pin
//             </button>
//           </NavLink>
//         </div>
//       )}

//       {/* pin details */}
//       {userPins.length > 0 && (
//         <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
//           <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 mt-4">
//             {userPins.map((pin) => (
//               <PinCard pin={pin} key={pin._id} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserProfile;
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Context/UserContext';
import { PinContext } from '../Context/PinContext';
import { NavLink, useParams } from 'react-router-dom';
import ProfileHeader from '../Components/ProfileHeader';
import PinCard from '../Components/PinCard';
import { Loading } from '../Components/Loading';
import ReportModal from '../Components/ReportModal';

const UserProfile = () => {
  const { loading, fetchUser, user, currentUser, isAuthenticated } = useContext(UserContext);
  const { pins } = useContext(PinContext);
  const { userId } = useParams();
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      if (isMounted) {
        await fetchUser(userId);
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <Loading />
      </div>
    );

  const userPins = pins.filter((pin) => pin.owner._id === user._id);
  const isOwnProfile = currentUser && currentUser._id === user._id;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-900">
      {/* Profile Header with Report Button */}
      <div className="relative">
        <ProfileHeader user={user} />
        
        {/* Report Button - Only show if not own profile and user is authenticated */}
        {!isOwnProfile && isAuthenticated && (
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-md"
            >
              <i className="fa-solid fa-flag"></i>
              <span className="font-medium">Report User</span>
            </button>
          </div>
        )}
      </div>

      <hr className="border-gray-600 dark:border-gray-400 w-full mt-5" />

      {userPins.length === 0 && (
        <div className="flex flex-col items-center gap-3 justify-center min-h-[40vh] text-gray-800 dark:text-gray-100">
          <p className="mt-4">
            Nothing to show...yet! Pins you create will live here.
          </p>
          {isOwnProfile && (
            <NavLink to="/create-pin">
              <button className="py-2 px-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer">
                Create Pin
              </button>
            </NavLink>
          )}
        </div>
      )}

      {userPins.length > 0 && (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 mt-4">
            {userPins.map((pin) => (
              <PinCard pin={pin} key={pin._id} />
            ))}
          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportType="user"
        itemId={userId}
        itemDetails={`${user.name} (@${user.username})`}
      />
    </div>
  );
};

export default UserProfile;