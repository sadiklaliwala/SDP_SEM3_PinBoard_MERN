import { useContext, useState } from 'react';
import { UserContext } from '../Context/UserContext';
import { Loading, LoadingAnimation } from '../Components/Loading';
import { PinContext } from '../Context/PinContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { userLogin, btnloading, setBTnLoading } = useContext(UserContext);
  const { fetchAllPins } = useContext(PinContext);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setBTnLoading(true);
    await fetchAllPins();
    userLogin(email, password);
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-amber-100 dark:bg-gray-900 overflow-auto py-8'>
      <div className='relative w-full max-w-96 flex flex-col gap-4 py-8 px-10 bg-white dark:bg-gray-800 rounded-2xl shadow-md mx-4'>
        
        {/* Header */}
        <div className='flex flex-col items-center gap-3'>
          <i className='fa-brands fa-pinterest text-red-600 text-5xl'></i>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-200 text-center'>
            Welcome to Pinterest
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4 mt-6'>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type='email'
            placeholder='Email'
            required
            className='py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-base text-gray-800 dark:text-gray-200 focus:outline-none ring-2 ring-gray-300 dark:ring-gray-600 focus:ring-blue-300'
          />

          <div className='relative'>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              required
              className='py-2 px-4 w-full rounded-lg bg-gray-100 dark:bg-gray-700 text-base text-gray-800 dark:text-gray-200 focus:outline-none ring-2 ring-gray-300 dark:ring-gray-600 focus:ring-blue-300'
            />
            <i
              className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} absolute right-4 top-4 cursor-pointer text-gray-600 dark:text-gray-300`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <button
            type='submit'
            className='py-2 rounded-full bg-red-600 text-white text-lg font-semibold hover:bg-red-700 transition-all cursor-pointer'
            disabled={btnloading}
          >
            {btnloading ? <LoadingAnimation /> : 'Log in'}
          </button>
        </form>

        <p className='text-center text-gray-600 dark:text-gray-400 text-xs mt-4'>
          By continuing, you agree to Pinterest's{' '}
          <span className='text-gray-800 dark:text-gray-200 text-sm font-medium'>
            Terms of Service
          </span>{' '}
          and acknowledge you've read our Privacy Policy.
        </p>

        <div className='mt-2'>
          <p className='text-center text-gray-600 dark:text-gray-400 text-sm font-semibold'>
            Not on Pinterest yet?{' '}
            <button
              onClick={() => navigate('/signup')}
              className='text-blue-600 dark:text-blue-400 cursor-pointer'
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

// import { useContext, useState } from 'react';
// import { UserContext } from '../Context/UserContext';
// import { Loading, LoadingAnimation } from '../Components/Loading';
// import { PinContext } from '../Context/PinContext';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const { userLogin, btnloading, setBTnLoading } = useContext(UserContext);
//   const { fetchAllPins } = useContext(PinContext);

//   const navigate = useNavigate();

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     setBTnLoading(true);
//     await fetchAllPins();
//     userLogin(email, password);
//   };

//   return (
//     <div className='flex items-center justify-center min-h-screen bg-amber-100 overflow-auto py-8'>
//       <div className='relative w-full max-w-96 flex flex-col gap-4 py-8 px-10 bg-white rounded-2xl shadow-md mx-4'>
//         {/* Header */}
//         <div className='flex flex-col items-center gap-3'>
//           <i className='fa-brands fa-pinterest text-red-600 text-5xl'></i>
//           <h1 className='text-3xl font-bold text-gray-800 text-center'>
//             Welcome to Pinterest
//           </h1>
//         </div>

//         {/* Login Form */}
//         <form onSubmit={onSubmitHandler} className='flex flex-col gap-4 mt-6'>
//           <input
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//             type='email'
//             placeholder='Email'
//             required
//             className='py-2 px-4 rounded-lg bg-gray-100 text-base focus:outline-none ring-2 ring-gray-300 focus:ring-blue-300'
//           />
//           <div className='relative'>
//             <input
//               onChange={(e) => setPassword(e.target.value)}
//               value={password}
//               type={showPassword ? 'text' : 'password'}
//               placeholder='Password'
//               required
//               className='py-2 px-4 w-full rounded-lg bg-gray-100 text-base focus:outline-none ring-2 ring-gray-300 focus:ring-blue-300'
//             />
//             <i
//               className={`fa ${
//                 showPassword ? 'fa-eye-slash' : 'fa-eye'
//               } absolute right-4 top-4 cursor-pointer text-gray-600`}
//               onClick={() => setShowPassword(!showPassword)}
//             ></i>
//           </div>
//           <button
//             type='submit'
//             className='py-2 rounded-full bg-red-600 text-white text-lg font-semibold hover:bg-red-700 transition-all cursor-pointer'
//             disabled={btnloading}
//           >
//             {btnloading ? <LoadingAnimation /> : 'Log in'}
//           </button>
//         </form>

//         <p className='text-center text-gray-600 text-xs mt-4'>
//           By continuing, you agree to Pinterest's{' '}
//           <span className='text-gray-800 text-sm font-medium'>
//             Terms of Service
//           </span>{' '}
//           and acknowledge you've read our Privacy Policy. Notice at collection.
//         </p>

//         <div className='mt-2'>
//           <p className='text-center text-gray-600 text-sm font-semibold'>
//             Not on Pinterest yet?{' '}
//             <button
//               onClick={() => navigate('/signup')}
//               className='text-blue-600 cursor-pointer'
//             >
//               Sign up
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
