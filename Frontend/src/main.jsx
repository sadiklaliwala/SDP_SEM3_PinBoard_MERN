// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import App from './App.jsx';
// import { BrowserRouter } from 'react-router-dom';
// import UserContextProvider from './Context/UserContext.jsx';
// import PinContextProvider from './Context/PinContext.jsx';

// createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//     <UserContextProvider>
//       <PinContextProvider>
//         <App />
//       </PinContextProvider>
//     </UserContextProvider>
//   </BrowserRouter>
// );
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import UserContextProvider from './Context/UserContext.jsx';
import PinContextProvider from './Context/PinContext.jsx';
import { ThemeProvider } from './Context/ThemeToggleContext.jsx'; // ← import
import PaymentContextProvider from './Context/PaymentContext.jsx'; // ✅ Import PaymentContext
import AdminContexProvider from './Context/AdminContext.jsx'; // Import Admin Panel


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserContextProvider>
      <PinContextProvider>
        <ThemeProvider> {/* ← wrap App here */}
          <PaymentContextProvider> {/* ✅ Wrap with PaymentContext */}
            <AdminContexProvider>
              <App /> {/*Wrap with AdminProvider */}
            </AdminContexProvider>
          </PaymentContextProvider>
        </ThemeProvider>
      </PinContextProvider>
    </UserContextProvider>
  </BrowserRouter>
);