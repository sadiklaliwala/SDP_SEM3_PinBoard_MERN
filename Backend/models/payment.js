import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: { type: String, required: true },
    paymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "pending", "success", "failed"],
      default: "created",
    },
    paymentMethod: String,
    description: String,
    isPremium: { type: Boolean, default: false },
    premiumExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

const PaymentModel =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default PaymentModel;
