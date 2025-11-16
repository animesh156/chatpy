import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const Sidebar = () => {
  const users = useChatStore((state) => state.users);
  const getUsers = useChatStore((state) => state.getUsers);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const isUsersLoading = useChatStore((state) => state.isUsersLoading);

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { theme } = useThemeStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`h-full border-r border-base-300 flex flex-col transition-all duration-300
        ${
          selectedUser
            ? "hidden md:flex md:w-72" // hide sidebar on mobile when chat is open
            : "w-full md:w-72" // full width on mobile when no chat is selected
        }`}
      data-theme={theme}
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium text-base">Contacts</span>
          </div>

          {/* Online filter toggle */}
          <label className="cursor-pointer flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-xs"
            />
            <span>Online</span>
          </label>
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          {onlineUsers.length - 1} online
        </p>
      </div>

      {/* Contact List */}
      <div className="overflow-y-auto flex-1 py-2">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-base-300 transition-all ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100"></span>
              )}
            </div>

            {/* User Info */}
            <div className="flex flex-col text-left min-w-0">
              <span className="font-medium text-base truncate">
                {user.fullName}
              </span>

              {/* MESSAGE PREVIEW */}
              <span className="text-sm text-gray-400 truncate">
                {user.lastMessageImage
                  ? "📷 Photo"
                  : user.lastMessageText
                  ? user.lastMessageText
                  : ""}
              </span>

              {/* Online status */}
              <span
                className={`text-sm ${
                  onlineUsers.includes(user._id)
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {/* {onlineUsers.includes(user._id) ? "Online" : "Offline"} */}
              </span>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
