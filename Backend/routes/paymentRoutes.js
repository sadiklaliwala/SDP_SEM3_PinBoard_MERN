import express from 'express';
import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  handlePaymentFailure,
} from '../controllers/paymentController.js';
import isAuthenticated from '../middlewares/auth.middleware.js';

const paymentRouter = express.Router();

// All payment routes require authentication
paymentRouter.post('/create-order', isAuthenticated, createOrder);
paymentRouter.post('/verify', isAuthenticated, verifyPayment);
paymentRouter.post('/failure', isAuthenticated, handlePaymentFailure);
paymentRouter.get('/history', isAuthenticated, getPaymentHistory);

export default paymentRouter;