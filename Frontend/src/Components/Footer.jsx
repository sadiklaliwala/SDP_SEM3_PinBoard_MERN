import React from 'react';

const Footer = () => {
  return (
    <div>
      <div className='py-2 px-2 mt-4 bg-white dark:bg-gray-800 shadow-md'>
        <p className='text-base text-gray-800 dark:text-gray-200 text-center'>
          © 2025 Pinterest Clone by{' '}
          <a
            className='text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium'
            href='https://github.com/sadiklaliwala'
          >
            Sadik, Rahim and Fozan
          </a>
          . All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;