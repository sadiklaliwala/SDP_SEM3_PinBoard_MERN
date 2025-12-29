import axios from "axios";
import { createContext, useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";

export const PaymentContext = createContext();

const PaymentContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const { fetchMyProfile } = useContext(UserContext);

  const api = useMemo(() => {
    const backendUrl = process.env.BACKEND_URI || "http://localhost:5000";
    return axios.create({
      baseURL: backendUrl,
      withCredentials: true,
    });
  }, []);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Create order and initiate payment
  const initiatePayment = async (
    amount,
    description = "Premium Subscription"
  ) => {
    setLoading(true);
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error(
          "Failed to load Razorpay SDK. Please check your internet connection."
        );
        setLoading(false);
        return;
      }

      // Create order on backend
      const { data } = await api.post("/api/payment/create-order", {
        amount,
        description,
      });

      if (!data.success) {
        toast.error(data.message);
        setLoading(false);
        return;
      }

      // Configure Razorpay options
      const options = {
        key: data.order.keyId, // Razorpay key from backend
        amount: data.order.amount * 100, // Amount in paise
        currency: data.order.currency,
        name: "Pinterest Clone",
        description: description,
        order_id: data.order.orderId,
        handler: async (response) => {
          // Payment successful - verify on backend
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: "", // Will be filled from user context if needed
          email: "",
          contact: "",
        },
        theme: {
          color: "#DC2626", // Red color matching your app theme
        },
        modal: {
          ondismiss: async () => {
            // Payment cancelled
            await handlePaymentFailure(
              data.order.orderId,
              "Payment cancelled by user"
            );
            toast.info("Payment cancelled");
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      setLoading(false);
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error(
        error.response?.data?.message || "Failed to initiate payment"
      );
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      const { data } = await api.post("/api/payment/verify", paymentData);

      if (data.success) {
        // Show success message FIRST
        toast.success("Payment successful! You are now a premium member 🎉", {
          autoClose: 4000,
        });

        // Refetch user profile to update premium status (no reload needed)
        await fetchMyProfile();

        return true;
      } else {
        toast.error("Payment verification failed");
        return false;
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error(
        error.response?.data?.message || "Payment verification failed"
      );
      return false;
    }
  };

  // Verify payment on backend
  // const verifyPayment = async (paymentData) => {
  //   try {
  //     const { data } = await api.post("/api/payment/verify", paymentData);

  //     if (data.success) {
  //       window.location.reload();
  //       toast.success("Payment successful! You are now a premium member 🎉");
  //       // Reload user data or update context
  //       return true;
  //     } else {
  //       toast.error("Payment verification failed");
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error("Payment verification error:", error);
  //     toast.error(
  //       error.response?.data?.message || "Payment verification failed"
  //     );
  //     return false;
  //   }
  // };

  // Handle payment failure
  const handlePaymentFailure = async (orderId, errorMessage) => {
    try {
      await api.post("/api/payment/failure", {
        orderId,
        error: errorMessage,
      });
    } catch (error) {
      console.error("Error handling payment failure:", error);
    }
  };

  // Get payment history
  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/payment/history");
      if (data.success) {
        setPaymentHistory(data.payments);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const values = {
    loading,
    paymentHistory,
    initiatePayment,
    fetchPaymentHistory,
  };

  return (
    <PaymentContext.Provider value={values}>{children}</PaymentContext.Provider>
  );
};

export default PaymentContextProvider;
