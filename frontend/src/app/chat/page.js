"use client";
import { useState, useEffect } from 'react';
import useChat from '../hooks/useSocketChat';

export default function ChatPage() {
    const [userName, setUserName] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    
    // 1. Busca o nome do usuário do localStorage para o chat
    useEffect(() => {
        const name = localStorage.getItem("userName") || localStorage.getItem("userEmail")?.split('@')[0];
        if (name) {
            setUserName(name.charAt(0).toUpperCase() + name.slice(1));
        } else {
            // Redirecionamento de login básico (opcional)
            // router.push('/login'); 
        }
    }, []);

    // 2. Inicializa o hook de chat apenas quando o nome do usuário estiver disponível
    const { messages, sendMessage, isConnected } = useChat(userName);

    const handleSend = (e) => {
        e.preventDefault();
        sendMessage(messageInput);
        setMessageInput('');
    };
    
    // Simples componente de mensagem para melhor visualização
    const Message = ({ sender, content, timestamp, isMine }) => (
        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow ${
                isMine ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-tl-none'
            }`}>
                <div className="font-semibold text-xs opacity-80">{sender}</div>
                <div>{content}</div>
                <div className="text-right text-xs mt-1 opacity-60">{timestamp}</div>
            </div>
        </div>
    );

    if (!userName) {
        return <div className="p-8 text-center">Carregando usuário...</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <header className="p-4 bg-white shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Chat Global Pokémon</h1>
                <span className={`text-sm font-semibold ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                    Status: {isConnected ? 'Online' : 'Offline'}
                </span>
            </header>

            {/* Container de Mensagens */}
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
            </div>

            {/* Input de Mensagem */}
            <footer className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSend} className="flex space-x-3">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder={isConnected ? "Digite sua mensagem..." : "Conectando ao chat..."}
                        disabled={!isConnected}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!isConnected || !messageInput.trim()}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                            isConnected ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        }`}
                    >
                        Enviar
                    </button>
                </form>
            </footer>
        </div>
    );
}