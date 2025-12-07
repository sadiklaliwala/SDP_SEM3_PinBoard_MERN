import crypto from 'crypto';
import { razorpayInstance } from '../config/razorpay.js';
import PaymentModel from '../models/payment.js';
import UserModel from '../models/userModel.js';

// Create Order
export const createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', description = 'Payment' } = req.body;
        const userId = req.user._id; // From auth middleware

        // Validate amount
        if (!amount || amount < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount',
            });
        }

        // Create Razorpay order
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: currency,
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: userId.toString(),
                description: description,
            },
        };

        const order = await razorpayInstance.orders.create(options);

        // Save order in database
        const payment = new PaymentModel({
            userId: userId,
            orderId: order.id,
            amount: amount,
            currency: currency,
            status: 'created',
            description: description,
        });

        await payment.save();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: {
                orderId: order.id,
                amount: amount,
                currency: currency,
                keyId: process.env.RAZORPAY_KEY_ID, // Send to frontend
            },
        });
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment details',
            });
        }

        // Verify signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature',
            });
        }

        // Update payment in database
        const payment = await PaymentModel.findOne({ orderId: razorpay_order_id });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        payment.paymentId = razorpay_payment_id;
        payment.razorpaySignature = razorpay_signature;
        payment.status = 'success';
        await payment.save();

        // Update user (e.g., make premium)
        const user = await UserModel.findById(payment.userId);
        user.isPremium = true;
        user.premiumExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            payment: {
                orderId: payment.orderId,
                paymentId: payment.paymentId,
                amount: payment.amount,
                status: payment.status,
            },
        });
    } catch (error) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Payment History
export const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        const payments = await PaymentModel.find({ userId })
            .sort({ createdAt: -1 })
            .select('-razorpaySignature');

        res.status(200).json({
            success: true,
            payments: payments,
        });
    } catch (error) {
        console.error('Get Payment History Error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Handle Payment Failure
export const handlePaymentFailure = async (req, res) => {
    try {
        const { orderId, error } = req.body;

        const payment = await PaymentModel.findOne({ orderId });

        if (payment) {
            payment.status = 'failed';
            await payment.save();
        }

        res.status(200).json({
            success: false,
            message: 'Payment failed',
            error: error,
        });
    } catch (error) {
        console.error('Handle Payment Failure Error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
