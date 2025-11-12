# 🔌 MERN Chat App

A real-time chat application built using the **MERN stack (MongoDB, Express.js, React, Node.js)** with **Socket.IO** for **live messaging**, **blue tick seen status**, and **typing indicators**. Styled with **Tailwind CSS** for a clean, modern interface.

---

## 🚀 Features

- 🔒 **User Authentication** (Register / Login with JWT)
- 💬 **One-to-One Real-Time Messaging**
- ⚡ **Live Communication** using Socket.IO
- 💾 **Persistent Chat History** (MongoDB)
- 🟢 **Online / Offline Status Tracking**
- 👀 **Real-Time Message Seen Status (Blue Tick)**
- ⌨️ **Typing Indicator** (shows “Typing...” in real time)
- 🖼️ **Image Sharing Support**
- 😀 **Emoji Picker for Messages**
- 🎨 **Modern Responsive UI** built with Tailwind CSS
- 🌙 **Dark/Light Mode** (Theme switch support)

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (with Zustand for state management)
- Tailwind CSS
- Axios
- Socket.IO Client
- Emoji Picker Component

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO Server
- JWT Authentication
- Cloudinary (for image uploads)

---

## 📂 Project Structure

```
📦mern-chat-app
├── frontend
│   ├── src
│   │   ├── components        # Chat UI components (ChatHeader, MessageInput, etc.)
│   │   ├── store             # Zustand stores (auth, chat, theme)
│   │   ├── pages             # Login, Register, Chat pages
│   │   ├── App.js
│   │   └── ...
├── backend
│   ├── controllers           # Message and user controllers
│   ├── models                # Mongoose models (User, Message)
│   ├── routes                # Auth and message routes
│   ├── socket.js             # Real-time Socket.IO event handling
│   └── server.js             # Express app entry point
└── README.md
```

---

## ⚙️ Getting Started

### 🔧 Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

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
cd frontend
npm start
```

> ⚠️ Make sure MongoDB is running locally or provide a valid connection string in your `.env` file.

---

## 🔐 Environment Variables (`backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

---

## ✨ Screenshots

| Chat Interface | Seen + Typing Features |
|----------------|------------------------|
| ![Chat UI](https://res.cloudinary.com/dmdlgpurh/image/upload/v1741028959/yqopk4eqff7w6w8vb12a.png) |

---

## 🧠 Real-Time Features

### ✅ Message Seen (Blue Tick)
- Shows a **double gray tick (✅✅)** when message is delivered.  
- Turns **blue (💙💙)** when the receiver reads the message in real time.  
- Fully synchronized using Socket.IO and MongoDB.

### 💬 Typing Indicator
- Displays “Typing...” live in the chat header when the user is typing.  
- Automatically disappears when user stops typing or sends the message.

### 🟢 Online Status
- Displays real-time **Online / Offline** indicator next to each user.  
- Updated dynamically using active socket connections.

---

## 🤝 Contribution

Pull requests are welcome!  
For major changes, please open an issue first to discuss what you’d like to modify.

### 🔀 Example Commit
If you’re contributing new real-time chat features:
```bash
git commit -m "feat(chat): add real-time typing indicator and blue tick seen status"
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙌 Acknowledgements

- [Socket.IO](https://socket.io/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Zustand](https://github.com/pmndrs/zustand)

---

## 🧑‍💻 Author

**Animesh Rathore**  
Frontend Developer | MERN Stack Engineer  
💼 [GitHub](https://github.com/animesh156)
