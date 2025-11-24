import express from 'express';
const userRouter = express.Router();
import passport from 'passport';
import isAuthenticated from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

import {
  followUser,
  getAllUsers,
  getCurrentUser,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
  updateMyProfile,
} from '../controllers/user.controller.js';
import {
  googleAuthSuccess,
  githubAuthSuccess,
  oauthFailure,
  getCurrentUseroAuth,
} from '../controllers/oauthController.js';

userRouter.post('/test', (req, res) => {
  res.json({ msg: "Data is " + req.data });
});

// /api/auth/register
userRouter.post('/register', registerUser);

// /api/auth/login
userRouter.post('/login', loginUser);

// Google OAuth Routes
// /api/auth/login/google
userRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
// /api/auth/login/google/callback
userRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/failure',
    session: true
  }),
  googleAuthSuccess
);

// GitHub OAuth Routes
// /api/auth/login/github
userRouter.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// /api/auth/login/github/callback
userRouter.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/api/auth/failure',
    session: true
  }),
  githubAuthSuccess
);

// OAuth Failure Route
userRouter.get('/failure', oauthFailure);

// /api/auth/logout
userRouter.post('/logout', logoutUser);

// /api/auth/users
userRouter.get('/users', getAllUsers);

// /api/auth/me
userRouter.get('/me', isAuthenticated, getCurrentUser);

// /api/auth/user/:id
userRouter.get('/user/:id', isAuthenticated, getUserById);

userRouter.put(
  '/profile',
  isAuthenticated,
  upload.single('profileImage'),
  updateMyProfile
);

userRouter.put('/follow/:id', isAuthenticated, followUser);
export default userRouter;
