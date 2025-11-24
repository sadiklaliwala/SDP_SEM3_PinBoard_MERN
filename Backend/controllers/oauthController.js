import CreateTokenandSetCookies from '../Utils/JWTUtils.js';

// Google OAuth Success Handler
export const googleAuthSuccess = async (req, res) => {
  try {
    // User is available in req.user from passport
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}`);
    }

    // Create token and set cookies (reusing your existing function)
    CreateTokenandSetCookies(res, user);

    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}`);
  } catch (error) {
    console.error('Google auth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}`);
  }
};

// GitHub OAuth Success Handler
export const githubAuthSuccess = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}`);
    }
    
    CreateTokenandSetCookies(res, user);

    res.redirect(`${process.env.FRONTEND_URL}`);
  } catch (error) {
    console.error('GitHub auth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}`);
  }
};

// OAuth Failure Handler
export const oauthFailure = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}`);
};

// Get Current User (useful for checking auth status)
export const getCurrentUseroAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        username: req.user.username,
        profileImage: req.user.profileImage,
        bio: req.user.bio,
        followersCount: req.user.followersCount,
        followingCount: req.user.followingCount,
        authProvider: req.user.authProvider,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};