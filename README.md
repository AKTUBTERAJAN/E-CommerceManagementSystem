# 🛒 Bigmall – AI-Powered E-Commerce Platform

**Bigmall** is a modern, full-stack E-Commerce platform designed to provide a seamless, secure, and user-friendly online shopping experience. It enables customers to explore products, manage their shopping carts, place orders, and enjoy a smooth shopping journey.

The project is built using the MERN stack, with plans to integrate AI-powered shopping assistance, intelligent product search, and personalized recommendations.

## 🚀 Features

### 🛍️ E-Commerce Features
- User Registration and Login
- Secure Authentication
- Browse and Explore Products
- Product Details
- Search and Filter Products
- Shopping Cart Management
- Wishlist Management
- Secure Checkout
- Order Placement and Tracking
- Responsive User Interface

### 🤖 AI-Powered Features
- AI Shopping Assistant
- Intelligent Product Search
- AI-Based Product Recommendations
- Personalized Shopping Experience
- AI Customer Support

*AI features are being introduced progressively.*

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB
- Mongoose

### AI Integration
- OpenAI API
- OpenAI Node.js SDK

### Deployment
- Render

## 📁 Project Structure

```text
Bigmall/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── assets/
│       └── App.jsx
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
```

*The structure may vary depending on the current implementation.*

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| PORT | Backend server port |
| MONGO_URI | MongoDB connection string |
| OPENAI_API_KEY | OpenAI API key (backend only) |
| VITE_API_URL | Backend API base URL |

**Security:** Never commit `.env` files, API keys, or database credentials to GitHub.

## 🌐 Live Demo

**Backend:** https://bigmall-backend.onrender.com

**Frontend:** Add your deployed frontend URL here.

## 🎯 Project Goals

- Build a scalable E-Commerce platform.
- Deliver a seamless shopping experience.
- Integrate AI into online shopping.
- Improve product discovery through intelligent search.
- Provide personalized product recommendations.
- Build a modular and maintainable full-stack application.

## 🔮 Future Enhancements

- Advanced AI Shopping Assistant
- Voice-Based Product Search
- Smart Recommendation Engine
- AI-Powered Customer Support
- Advanced Analytics Dashboard
- Enhanced Performance and Security

## 👨‍💻 Developer

**Developed with ❤️ by Rajan Kushwaha**

## 📄 License

This project is licensed under the MIT License.
