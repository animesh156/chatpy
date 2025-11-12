import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  isTyping: false,
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // 🔹 Fetch all chat users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // 🔹 Fetch messages between logged-in user & selected user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // 🔹 Send a message
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // 🔹 Subscribe to real-time updates via Socket.IO
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
      const authUser = useAuthStore.getState().authUser;

    // ✅ New message event
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages } = get();

      const isRelevant =
        newMessage.senderId === selectedUser?._id ||
        newMessage.receiverId === selectedUser?._id;

      if (!isRelevant) return;

      set({ messages: [...messages, newMessage] });

    //  If I'm chatting with this sender, mark their message as seen instantly
    if (newMessage.senderId === selectedUser?._id) {
      socket.emit("markMessagesSeen", {
        senderId: selectedUser._id,
        receiverId: authUser._id,
      });
    }


    });

    // ✅ Seen event — turns gray ticks → blue in real-time
    socket.on("messagesSeen", ({ receiverId }) => {
      const { messages } = get();

       // Only mark messages sent by me to that receiver as seen
    const updated = messages.map((msg) =>
      msg.senderId === authUser._id && msg.receiverId === receiverId
        ? { ...msg, isSeen: true }
        : msg
    );

      set({ messages: updated });
    });

    // handle typing events
    socket.on("userTyping", ({ senderId }) => {
      const { selectedUser } = get();
      if(selectedUser?._id === senderId) {
        set({ isTyping : true });
      }
    });
    

    socket.on("userStoppedTyping", ({ senderId }) => {
      const {selectedUser} = get();
      if(selectedUser?._id === senderId) {
        set({ isTyping: false});
      }
    })
   
  },

  // 🔹 Unsubscribe when switching chats
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messagesSeen"); // important cleanup
  },

  // 🔹 Select a user to chat with
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
