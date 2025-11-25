import React from 'react';
import { Link } from 'react-router-dom';

const PinCard = ({ pin }) => {
  return (
    <Link to={`/pin/${pin._id}`}>
      <div className='mt-5 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg dark:shadow-gray-900 cursor-pointer hover:scale-105 transition'>
        <img
          src={pin.image}
          alt={pin.title}
          className='w-full object-cover'
        />
        <p className='text-center font-semibold mt-2 pb-2 text-gray-900 dark:text-gray-100'>
          {pin.title}
        </p>
      </div>
    </Link>
  );
};

export default PinCard;