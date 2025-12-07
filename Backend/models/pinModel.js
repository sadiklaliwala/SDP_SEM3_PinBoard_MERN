import mongoose from "mongoose";

const pinSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reaction: {
          type: String,
          enum: ["like", "love", "wow", "sad", "angry"],
        },
      },
    ],

    reactionCounts: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      wow: { type: Number, default: 0 },
      sad: { type: Number, default: 0 },
      angry: { type: Number, default: 0 }
    },

    category: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const PinModel = mongoose.models.Pin || mongoose.model("Pin", pinSchema);

export default PinModel;