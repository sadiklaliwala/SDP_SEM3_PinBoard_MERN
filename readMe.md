# 📌 - A Pinterest Clone by Sadik Laliwala

A fully-featured Pinterest clone built with the MERN stack (MongoDB, Express, React, Node.js), featuring user authentication, image uploads, interactive pins, comments, like/unlike, follow/unfollow and user profiles.

## ✨ Features

### 🔐 Authentication & Authorization

- Secure user registration and login system
- Password encryption with bcryptJS
- JWT token-based authentication
- Protected routes for authenticated users

### 📱 User Interface

- Responsive design that works on all devices
- Complete Pinterest-style landing page for non-authenticated users
- Complete Explore page where users can view all pins and also based on different categories
- Intuitive navigation with dynamic navbar based on user authentication status
- Masonry layout for pins display

### 📌 Pin Management

- Create pins with image uploads (via Cloudinary)
- View all pins on the home feed
- Search functionality to find specific pins
- Detailed individual pin pages
- Edit and delete pins (for pin owners)
- Like and unline pins

### 💬 Social Features

- Comment on pins
- Delete your own comments
- Follow/unfollow other users
- View user profiles

## 🛠️ Technologies Used

### Frontend

- React.js
- React Router for navigation
- Context API for state management
- Axios for API requests
- Tailwind CSS for styling

### Backend

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- bcryptJS for password hashing

### Storage

- Cloudinary for image uploads and storage

## 📝 Future Improvements

- Implement notifications system
- Add pin collections/boards
- Add save and unsave pin
- Add social sharing options
- Implement infinite scrolling for pins

## 📋 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User

- `GET /api/auth/me` - Get user profile
- `GET /api/auth/user/:id` - Get user profile by id
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/follow/:id` - Follow or Unfollow a user by ID

### Pins

- `GET /api/pins` - Get all pins
- `GET /api/pins/:id` - Get a specific pin
- `POST /api/pins/create` - Create a new pin
- `PUT /api/pins/:id` - Update a pin
- `DELETE /api/pins/:id` - Delete a pin
- `PUT /api/pins/:id/toggleLike` - Like and Unlike a pin

### Comments

- `GET  /api/pins/:pinId/comments` - Get All comments
- `GET  /api/pins/:pinId/comments/:id` - Get a single comment
- `POST /api/pins/:pinId/comments/create` - Add/Create a comment
- `PUT  /api/pins/:pinId/comments/:id` - Update a comment
- `DELETE /api/pins/:pinId/comments/:id` - Delete a comment

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
---

⭐ If you find this project helpful, please give it a star on GitHub! ⭐
