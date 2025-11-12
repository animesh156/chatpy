import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, isTyping } = useChatStore(); // ✅ Added isTyping
  const { onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-2.5 border-b border-base-300" data-theme={theme}>
      <div className="flex items-center justify-between">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
              {/* Online indicator dot */}
              {isOnline && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-base-100"></span>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {/* ✅ Show typing indicator first */}
              {isTyping
                ? "Typing..."
                : isOnline
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        {/* Right: Close Button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="hover:text-error transition"
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
