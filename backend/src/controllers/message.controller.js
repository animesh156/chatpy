import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// export const getUsersForSidebar = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;

//     const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
//       "-password"
//     );

//     const usersWithLastMessage = await Promise.all(
//       users.map(async (u) => {
//         const lastMsg = await Message.findOne({
//           $or: [
//             { senderId: u._id, receiverId: loggedInUserId },
//             { senderId: loggedInUserId, receiverId: u._id },
//           ],
//         }).sort({ createdAt: -1 });

//         return {
//           ...u._doc,
//           lastMessageAt: lastMsg?.createdAt || 0,
//         };
//       })
//     );

//     // sort most recent chat on top
//     usersWithLastMessage.sort(
//       (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
//     );

//     res.status(200).json(usersWithLastMessage);
//   } catch (error) {
//     console.error("Error in getUsersForSidebar:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    const usersWithLastMessage = await Promise.all(
      users.map(async (u) => {
        const lastMsg = await Message.findOne({
          $or: [
            { senderId: u._id, receiverId: loggedInUserId },
            { senderId: loggedInUserId, receiverId: u._id },
          ],
        }).sort({ createdAt: -1 });

        return {
          ...u._doc,
          lastMessageAt: lastMsg?.createdAt || 0,
          lastMessageText: lastMsg?.text || "",
          lastMessageImage: lastMsg?.image || null,
        };
      })
    );

    // Sort based on latest message time
    usersWithLastMessage.sort(
      (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
    );

    res.status(200).json(usersWithLastMessage);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// for getting msg
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    //fetch all messages between two users
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// for sending msg
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let placeholderImage = null;

    // 1️⃣ TEMPORARY image placeholder (non-blocking)
    if (image) {
      placeholderImage = "uploading";
    }

    // 2️⃣ Create message IMMEDIATELY (no waiting for Cloudinary)
    const message = await Message.create({
      senderId,
      receiverId,
      text,
      image: placeholderImage,
    });

    // 3️⃣ Emit message instantly to both sender & receiver
    [receiverId, senderId].forEach((id) => {
      const socketId = getReceiverSocketId(id);
      if (socketId) io.to(socketId).emit("newMessage", message);
    });

    // 4️⃣ Respond immediately (SUPER FAST API)
    res.status(201).json(message);

    // 5️⃣ NOW upload image in background (non-blocking)
    if (image) {
      cloudinary.uploader.upload(image).then(async (uploadResponse) => {
        const finalURL = uploadResponse.secure_url;

        // Update message with final image URL
        await Message.findByIdAndUpdate(message._id, { image: finalURL });

        // Notify both users image is ready
        [receiverId, senderId].forEach((id) => {
          const socketId = getReceiverSocketId(id);
          if (socketId) {
            io.to(socketId).emit("imageUploaded", {
              messageId: message._id,
              image: finalURL,
            });
          }
        });
      });
    }
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
