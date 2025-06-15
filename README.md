
# 🐝 DevBumble

🌐 **Live Site**: [https://devbumble.space](https://devbumble.space)

**DevBumble** is a real-time developer networking platform where developers can **connect, chat, and collaborate**. Built using the **MERN stack (MongoDB, Express, React, Node.js)**, it also integrates **Razorpay** for premium feature access and **Socket.IO** for real-time messaging.

---

## 📁 Project Structure

```
devbumble/
├── client/         # Frontend (React)
├── server/         # Backend (Node.js + Express)
```

---

## 🖥️ Frontend - `client/`

### 🔧 Tech Stack
- **React.js**
- **React Router**
- **Tailwind CSS** (assumed from design standards)
- **Axios** for API requests
- **Socket.IO-client** for real-time messaging
- **Razorpay Integration** for premium features

### 📁 Notable Components
- `Chat.jsx` - Real-time chat UI using Socket.IO
- `Feed.jsx` - Main developer feed
- `Login.jsx` / `Profile.jsx` / `EditProfile.jsx` - Auth and profile management
- `Premium.jsx` - Razorpay integration for premium purchases
- `Navbar.jsx` / `Footer.jsx` - UI layout components
- `Requests.jsx`, `Connections.jsx` - Developer networking features
- `UserCard.jsx` - Reusable profile display

### ▶️ Getting Started

```bash
cd client
npm install
npm start
```

### ⚙️ Environment Variables

Create a `.env` file in `/client`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY=your_razorpay_key
```

---

## 🌐 Backend - `server/`

### 🔧 Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **Socket.IO** for real-time communication
- **Razorpay Node SDK**
- **JWT** for user authentication

### 📁 Folder Structure

- `Middlewares/` - Auth and error-handling middleware
- `config/` - DB and environment config
- `model/` - Mongoose schemas (User, Chat, Message, etc.)
- `router/` - API route handlers (auth, chat, payment)
- `utils/` - Utility functions (e.g. Razorpay integration)
- `app.js` - Express app bootstrap

### ▶️ Getting Started

```bash
cd server
npm install
npm run dev
```

### ⚙️ Environment Variables

Create a `.env` file in `/server`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## 🔑 Features

- 👤 **User Auth** (Register/Login)
- 🧑‍💻 **Developer Connections**
- 💬 **Real-Time Chat** via Socket.IO
- 💎 **Premium Memberships** with Razorpay
- 📄 **Profile Editing**
- 🔐 **Protected Routes** with JWT

---

## 🚀 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/devbumble.git
   ```

2. Start the backend:
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. Start the frontend:
   ```bash
   cd client
   npm install
   npm start
   ```

4. Visit: [http://localhost:3000](http://localhost:3000)

---

## 📦 Future Enhancements

- Notifications system
- Video call integration
- Better user discovery algorithm
- Dark/light mode toggle

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!  
Feel free to fork and submit a pull request.

---
