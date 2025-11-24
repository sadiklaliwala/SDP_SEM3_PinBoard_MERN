// import mongoose from 'mongoose';

// const userSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     bio: { type: String, default: '' },
//     username: { type: String, required: true },
//     profileImage: { type: String, default: '' },
//     followers: [
//       { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
//     ],
//     following: [
//       { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
//     ],
//     followersCount: { type: Number, default: 0 },
//     followingCount: { type: Number, default: 0 },
//     // Add these new fields
//     googleId: { type: String },
//     githubId: { type: String },
//     avatar: { type: String },
//     authProvider: {
//       type: String,
//       enum: ['local', 'google', 'github'],
//       default: 'local'
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const UserModel = mongoose.model.User || mongoose.model('User', userSchema);

// export default UserModel;
import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Changed to optional for OAuth users
    bio: { type: String, default: '' },
    username: { type: String, required: true },
    profileImage: { type: String, default: '' },
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
    ],
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },

    // Add these new fields for OAuth
    googleId: { type: String, sparse: true, unique: true },
    githubId: { type: String, sparse: true, unique: true },
    facebookId: { type: String, sparse: true, unique: true },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local'
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;