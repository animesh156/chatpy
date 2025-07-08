
# 🔌 MERN Chat App

A real-time chat application built using the **MERN stack (MongoDB, Express.js, React, Node.js)** with **Socket.IO** for live messaging and **Tailwind CSS** for modern styling.

---

## 🚀 Features

- 🔒 User Authentication (Login / Register)
- 🧑‍🤝‍🧑 One-to-one real-time messaging
- 📡 Real-time communication using Socket.IO
- 💬 Chat message persistence with MongoDB
- 🎨 Clean and responsive UI with Tailwind CSS
- 🟢 Online user tracking


---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Axios
- Socket.IO Client

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO Server
- JWT for Auth 

---

## 📂 Project Structure

```
📦mern-chat-app
├── frontend             # React frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.js
│   │   └── ...
├── backend            # Express backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── socket.js
│   └── server.js
└── README.md
```

---

## ⚙️ Getting Started

### 🔧 Prerequisites
- Node.js
- MongoDB
- npm / yarn

### 📦 Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

---

### ▶️ Run the App

#### Start Backend Server
```bash
cd backend
npm run dev
```

#### Start Frontend
```bash
cd backend
npm start
```

Make sure MongoDB is running locally or provide a connection string in `.env`.

---

## 🔐 Environment Variables (`server/.env`)
```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET =
NODE_ENV =
```

---

## ✨ Screenshots

| Chat UI                         
|----------------------------------|-----------------------------------|
| ![Chat Screenshot](https://res.cloudinary.com/dmdlgpurh/image/upload/v1741028959/yqopk4eqff7w6w8vb12a.png) 

---

## 🤝 Contribution

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

- [Socket.IO](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
