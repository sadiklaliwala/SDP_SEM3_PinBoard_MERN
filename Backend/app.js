import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/user.routes.js';
import pinRouter from './routes/pin.routes.js';
import commentRouter from './routes/comment.routes.js';
import session from 'express-session';
import passport from './config/Passport.js';
import paymentRouter from './routes/paymentRoutes.js';
import adminRouter from './routes/admin.routes.js';
import reportRouter from './routes/report.routes.js';


// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

// CORS configuration with multiple allowed origins
const allowedOrigins = [
  'https://pinterest-clone-phi-vert.vercel.app', // Production frontend
  'http://localhost:5173', // Local development frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.options('*', cors(corsOptions));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// API Endpoints
app.use('/api/reports', reportRouter);
app.use('/api/admin', adminRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/auth', authRouter);
app.use('/api/pins', pinRouter);
app.use('/api/pins/:pinId/comments', commentRouter);

app.get('/', (req, res) => {
  res.send('API is running');
});

// Listener
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
