import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Explore from "./Pages/Explore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./Pages/LandingPage";
import { useContext } from "react";
import { UserContext } from "./Context/UserContext";
import { Loading } from "./Components/Loading";
import PinPage from "./Pages/PinPage";
import CreatePin from "./Pages/CreatePin";
import EditPinPage from "./Pages/EditPinPage";
import MyProfile from "./Pages/MyProfile";
import EditMyProfile from "./Pages/EditMyProfile";
import CategoryPage from "./Pages/CategoryPage";
import UserProfile from "./Pages/UserProfile";
import PremiumPage from "./Pages/PremiumPage";
import PaymentHistory from "./Pages/PaymentHistory";
import AdminLogin from "./Pages/AdminLogin";
import AdminLayout from "./Pages/AdminLayout";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminUsers from "./Pages/AdminUsers";
import AdminPins from "./Pages/AdminPins";
import AdminComments from "./Pages/AdminComments";
import AdminPayment from "./Pages/AdminPayment";

function App() {
  const { currentUser, isAuthenticated, loading } = useContext(UserContext);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Regular Routes with Navbar & Footer */}
          <Routes>
            {/* Admin Routes - NO Navbar/Footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route
                path="pins"
                element={
                  //<div className="p-6">
                    //<h1 className="text-2xl font-bold">Pins Management</h1>
                    //<p className="text-gray-600 dark:text-gray-400 mt-2">
                     // Coming soon...
                    //</p>
                  //</div>
                  <AdminPins />
                }
              />
              <Route
                path="comments"
                element={
                  // <div className="p-6">
                  //   <h1 className="text-2xl font-bold">Comments Management</h1>
                  //   <p className="text-gray-600 dark:text-gray-400 mt-2">
                  //     Coming soon...
                  //   </p>
                  // </div>
                  <AdminComments />
                }
              />
              <Route
                path="payments"
                element={
                  // <div className="p-6">
                  //   <h1 className="text-2xl font-bold">Payments Management</h1>
                  //   <p className="text-gray-600 dark:text-gray-400 mt-2">
                  //     Coming soon...
                  //   </p>
                  // </div>
                  <AdminPayment />
                }
              />
            </Route>

            {/* Regular App Routes */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  <ToastContainer />
                  <Navbar user={currentUser} />
                  <Routes>
                    <Route
                      path="/"
                      element={isAuthenticated ? <Home /> : <LandingPage />}
                    />
                    <Route
                      path="/explore"
                      element={
                        !isAuthenticated ? <Explore /> : <Navigate to="/" />
                      }
                    />
                    <Route path="create-pin" element={<CreatePin />} />
                    <Route path="/pin/:pinId" element={<PinPage />} />
                    <Route path="/edit-pin/:pinId" element={<EditPinPage />} />
                    <Route
                      path="/category/:categoryName"
                      element={<CategoryPage />}
                    />
                    <Route
                      path="/login"
                      element={
                        isAuthenticated ? <Navigate to="/" /> : <Login />
                      }
                    />
                    <Route
                      path="/signup"
                      element={
                        isAuthenticated ? <Navigate to="/" /> : <SignUp />
                      }
                    />
                    <Route
                      path="/myprofile"
                      element={
                        isAuthenticated ? (
                          <MyProfile />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/edit-myprofile"
                      element={
                        isAuthenticated ? (
                          <EditMyProfile />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route
                      path="/user/:userId"
                      element={
                        isAuthenticated ? (
                          <UserProfile />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                    <Route path="/premium" element={<PremiumPage />} />
                    <Route
                      path="/payment-history"
                      element={
                        isAuthenticated ? (
                          <PaymentHistory />
                        ) : (
                          <Navigate to="/login" />
                        )
                      }
                    />
                  </Routes>
                  <Footer />
                </div>
              }
            />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
