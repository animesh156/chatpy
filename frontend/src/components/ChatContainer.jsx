import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { CheckCheck } from "lucide-react"; // ✅ For WhatsApp-style ticks

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser, socket } = useAuthStore(); // ✅ socket is important here
  const messageEndRef = useRef(null);

  // 🔹 When user opens a chat: fetch messages + mark them as seen
  useEffect(() => {
    if (!selectedUser?._id) return;

    // Fetch chat messages
    getMessages(selectedUser._id);

    // // Subscribe to socket events (newMessage, messagesSeen)
    // subscribeToMessages();

    // ✅ Emit event to backend → mark unseen messages as seen
    socket.emit("markMessagesSeen", {
      senderId: selectedUser._id, // the person you're chatting with
      receiverId: authUser._id,   // you
    });

    // return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages, socket, authUser._id]);

  // 🔹 Auto-scroll to bottom whenever messages update
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 🔹 Skeleton loading state
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col overflow-auto"
      style={{
        backgroundImage: "url('/chat-bg.jpg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            {/* Avatar */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            {/* Time */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* Message bubble */}
            <div className="chat-bubble flex flex-col relative">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}

              {/* ✅ WhatsApp-style tick icons */}
              {message.senderId === authUser._id && (
                <div className="absolute bottom-1 right-2 flex items-center space-x-0.5">
                  <CheckCheck
                    size={16}
                    className={message.isSeen ? "text-blue-500" : "text-gray-400"}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
