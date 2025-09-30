import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { CHAT_URL } from "../config";

export default function useChat(userName) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userName) return;

    if (socketRef.current) {
      return;
    }

    socketRef.current = io(CHAT_URL, { query: { userName } });
    const socket = socketRef.current;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user_connected", (users) => {
      setOnlineUsers(users);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userName]);

  const sendMessage = useCallback(
    (content) => {
      if (socketRef.current && isConnected && content.trim()) {
        const message = {
          sender: userName,
          content: content.trim(),
          timestamp: new Date().toLocaleTimeString(),
        };
        socketRef.current.emit("send_message", message);
      }
    },
    [isConnected, userName]
  );

  return { messages, sendMessage, isConnected, onlineUsers };
}