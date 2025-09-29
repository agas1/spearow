"use client";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import useChat from "../hooks/useSocketChat";

const Message = ({ sender, content, timestamp, isMine }) => (
  <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
    <div
      className={`max-w-[80%] px-3 py-2 text-sm rounded-lg shadow-md ${
        isMine
          ? "bg-blue-600 text-white rounded-br-none"
          : "bg-gray-200 text-gray-800 rounded-tl-none"
      }`}
    >
      {!isMine && (
        <div className="font-semibold text-xs opacity-90 mb-1 capitalize">
          {sender}
        </div>
      )}
      <div>{content}</div>
      <div className="text-right text-xs mt-1 opacity-70">{timestamp}</div>
    </div>
  </div>
);

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  // Busca nome do usuário
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const storedName = localStorage.getItem("userName");

    let name = storedName;
    if (!name && userEmail) {
      name = userEmail.split("@")[0];
    }

    if (name) {
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    }
  }, []);

  // Sempre chama o hook, mantendo a ordem dos hooks
  const { messages, sendMessage, isConnected, onlineUsers } = useChat(userName);

  // Scroll automático para última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendMessage(messageInput);
    setMessageInput("");
  };

  if (!userName) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
          aria-label="Abrir chat"
          title="Abrir Chat"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="w-80 h-96 bg-white border border-gray-300 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center p-3 bg-blue-600 text-white shadow-md">
            <h3 className="font-bold text-lg">Chat Pokémon</h3>
            <div className="flex items-center space-x-3">
              <span
                className={`text-xs font-semibold ${
                  isConnected ? "text-green-300" : "text-red-300"
                }`}
              >
                {isConnected ? "Online" : "Offline"}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:opacity-80 transition"
                aria-label="Fechar chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Corpo das mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
            {messages.map((msg, index) => (
              <Message
                key={index}
                sender={msg.sender}
                content={msg.content}
                timestamp={msg.timestamp}
                isMine={msg.sender === userName}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de mensagem */}
          <footer className="p-3 border-t border-gray-200">
            <form onSubmit={handleSend} className="flex space-x-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={
                  isConnected
                    ? "Digite sua mensagem..."
                    : "Aguardando conexão..."
                }
                disabled={!isConnected}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="submit"
                disabled={!isConnected || !messageInput.trim()}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isConnected
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
              >
                <Send size={20} />
              </button>
            </form>
          </footer>
        </div>
      )}
    </div>
  );
}
