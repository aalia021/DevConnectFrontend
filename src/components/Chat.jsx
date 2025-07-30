import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import SHA256 from "crypto-js/sha256";

// 🔐 Generate secret room ID just like backend
const getSecretRoomId = (id1, id2) => {
  return SHA256([id1, id2].sort().join("$")).toString();
};

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const roomId = getSecretRoomId(userId, targetUserId);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const fetchChatMessages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });

      const chatMessages = res?.data?.messages.map((msg) => ({
        firstName: msg.senderId?.firstName,
        lastName: msg.senderId?.lastName,
        photoUrl: msg.senderId?.photoUrl || "/default-avatar.png",
        text: msg.text,
        createdAt: msg.createdAt || new Date().toISOString(),
      }));

      setMessages(chatMessages);
    } catch (err) {
      console.error("Failed to fetch chat", err);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text, photoUrl }) => {
      setMessages((prev) => [
        ...prev,
        {
          firstName,
          lastName,
          photoUrl: photoUrl || "/default-avatar.png",
          text,
          createdAt: new Date().toISOString(),
        },
      ]);
    });

    socket.on("userTyping", () => setIsTyping(true));
    socket.on("userStoppedTyping", () => setIsTyping(false));

    return () => socket.disconnect();
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
      photoUrl: user.photoUrl,
    });

    setNewMessage("");
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socketRef.current) return;

    socketRef.current.emit("typing", { roomId });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stopTyping", { roomId });
    }, 2000);
  };

  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji.native);
  };

  return (
    <div className="w-full max-w-3xl mx-auto border border-gray-600 my-10 rounded-lg overflow-hidden flex flex-col h-[75vh] bg-base-200">
      <div className="bg-base-300 px-5 py-3 border-b border-gray-700 text-lg font-bold">
        Chat
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg, index) => {
          const isOwn = user.firstName === msg.firstName;
          return (
            <div
              key={index}
              className={`chat ${isOwn ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-header text-sm text-gray-400 mb-1">
                {msg.firstName} {msg.lastName}
                <time className="ml-2 text-xs opacity-60">
                  {formatTime(msg.createdAt)}
                </time>
              </div>
              <div className="chat-bubble max-w-xs text-white bg-primary break-words">
                {msg.text}
              </div>
              {index === messages.length - 1 && isOwn && (
                <div className="chat-footer text-xs opacity-50">Seen</div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="text-sm italic text-gray-400 px-5">
            User is typing...
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div className="relative border-t border-gray-700 p-4 flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-2xl"
          >
            😊
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-full z-[1000] mb-2 max-w-[320px] max-h-[400px] overflow-auto">
              <Picker
                data={data}
                onEmojiSelect={addEmoji}
                theme="dark"
                perLine={7}
                emojiSize={24}
              />
            </div>
          )}
        </div>

        <input
          value={newMessage}
          onChange={handleTyping}
          className="input input-bordered flex-1 text-white"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="btn btn-secondary"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
