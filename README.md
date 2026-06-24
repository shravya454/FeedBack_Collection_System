# Feedback Collection System

A lightweight feedback collection web app with user and admin workflows.

Users can register, submit feedback to a chosen admin, view their submitted feedback, and receive admin replies. Admins can log in, review feedback assigned to them, reply to items, and see user history.

---

## ✨ Features

### User-facing
- User registration with email OTP verification
- Login / logout
- Forgot password and password reset via OTP
- Feedback submission with category, rating, and admin selection
- View submitted feedback and admin replies
- Simple profile/sidebar user info

### Admin-facing
- Admin login
- View feedback assigned to the admin
- Reply to feedback messages
- See feedback history and reply threads
- Email notifications for admin replies 

### General
- JWT-based login response handling
- Password hashing with `bcryptjs`
- MongoDB backend via Mongoose
- Local-first configuration with environment fallback

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- bcryptjs
- jsonwebtoken
- nodemailer
- dotenv

### Frontend
- Plain HTML, CSS and JavaScript
- Static pages in `frontend/`
- Client-side fetch requests to backend API routes

---

## 📁 Project Structure

```text
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── feedbackController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Feedback.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   └── feedbackRoutes.js
├── utils/
│   └── sendMail.js
└── server.js

frontend/
├── css/
│   └── style.css
├── js/
│   ├── adminLogin.js
│   ├── app.js
│   ├── config.js
│   ├── feedback.js
│   ├── forgotPassword.js
│   ├── home.js
│   ├── login.js
│   ├── otp.js
│   ├── register.js
│   └── userFeedback.js
├── adminLogin.html
├── dashboard.html
├── feedback.html
├── forgotPassword.html
├── home.html
├── index.html
├── login.html
├── loginChoice.html
├── otp.html
├── register.html
└── userFeedback.html

scripts/
└── checkUser.js

.env
package.json
README.md
```

---

## 🚀 Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the project root with:

```env
MONGO_URI=mongodb://127.0.0.1:27017/feedbackDB
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

3. Start the backend server

```bash
npm run dev
```

4. Open the frontend pages in your browser after the server starts:
- `frontend/index.html` — landing page
- `frontend/login.html` — user login
- `frontend/register.html` — user registration
- `frontend/userFeedback.html` — user feedback history page
- `frontend/dashboard.html` — admin dashboard

> The Express backend also serves the frontend static files from `frontend/` by default.

---

## 🔧 Notes

- `.gitignore` already excludes `node_modules/` and `.env`
- The backend uses `dotenv` to load environment variables
- If `process.env.MONGO_URI` is not set, it falls back to local MongoDB

---

## 📝 API Endpoints

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/verify-otp`
- `POST /auth/resend-otp`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### Feedback
- `POST /feedback/submit`
- `GET /feedback/all`
- `GET /feedback/user/:email`
- `GET /feedback/admin/:email`
- `PUT /feedback/reply/:id`
- `PUT /feedback/edit/:id`
- `PUT /feedback/reply-edit/:id/:replyIndex`
- `DELETE /feedback/:id`

---

## ✅ Recommended Workflow

1. Run MongoDB locally
2. Start backend with `npm run dev`
3. Use frontend pages to register, login, submit feedback, and review replies

---

## 📦 Scripts

```json
"scripts": {
  "start": "node backend/server.js",
  "dev": "nodemon backend/server.js"
}
```
