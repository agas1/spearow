import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { CHAT_URL } from "../config";

let socket;

export default function useChat(userName) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!userName) return; // Não conecta se não houver nome
    if (socket) return;

    socket = io(CHAT_URL, { query: { userName } });

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
      if (socket) {
        socket.off();
        socket.close();
        socket = null;
      }
    };
  }, [userName]);

  const sendMessage = useCallback(
    (content) => {
      if (socket && isConnected && content.trim()) {
        const message = {
          sender: userName,
          content,
          timestamp: new Date().toLocaleTimeString(),
        };
        socket.emit("send_message", message);
        setMessages((prev) => [...prev, message]);
      }
    },
    [isConnected, userName]
  );

  return { messages, sendMessage, isConnected, onlineUsers };
}
