"use client";
import { useState, useEffect } from 'react';
import useChat from '../hooks/useSocketChat';
import Link from 'next/link';

export default function ChatPage() {
    const [userName, setUserName] = useState(null);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        const name = localStorage.getItem("userName") || localStorage.getItem("userEmail")?.split('@')[0];
        if (name) {
            setUserName(name.charAt(0).toUpperCase() + name.slice(1));
        }
    }, []);

    const { messages, sendMessage, isConnected, onlineUsers } = useChat(userName);

    const handleSend = (e) => {
        e.preventDefault();
        if (messageInput.trim()) {
            sendMessage(messageInput);
            setMessageInput('');
        }
    };

    const Message = ({ sender, content, timestamp, isMine }) => (
        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`max-w-xs px-4 py-3 rounded-2xl shadow-lg ${
                isMine 
                    ? 'bg-blue-600 text-white rounded-br-none border-2 border-blue-400/30' 
                    : 'card-background text-gray-100 rounded-tl-none border-2 border-neonBlue/20'
            }`}>
                <div className="font-semibold text-sm opacity-90">{sender}</div>
                <div className="my-1">{content}</div>
                <div className="text-right text-xs opacity-70">{timestamp}</div>
            </div>
        </div>
    );

    if (!userName) {
        return (
            <div 
                className="flex justify-center items-center min-h-screen bg-cover bg-center bg-fixed"
                style={{ backgroundImage: "url('/fundoHome.jpg')" }}
            >
                <div className="text-white">Carregando usuário...</div>
            </div>
        );
    }

    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-fixed py-8"
            style={{ backgroundImage: "url('/fundoHome.jpg')" }}
        >
            <div className="container mx-auto px-4">
                {/* Header com botão voltar */}
                <div className="flex justify-between items-center mb-6">
                    <Link 
                        href="/"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                        ← Voltar para Home
                    </Link>
                    <div className="text-right">
                        <h1 className="text-3xl font-bold text-white">Chat Global Pokémon</h1>
                        <span className={`text-sm font-semibold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                            {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
                        </span>
                    </div>
                </div>

                {/* Container principal do chat */}
                <div className="max-w-4xl mx-auto">
                    {/* Card do chat */}
                    <div className="card-background rounded-2xl shadow-2xl border-2 border-neonBlue/20 overflow-hidden">
                        
                        {/* Lista de usuários online */}
                        <div className="p-4 bg-black/40 border-b border-gray-700/50">
                            <div className="flex items-center gap-2 text-white">
                                <span className="font-semibold">👥 Online ({onlineUsers?.length || 0}):</span>
                                <div className="flex gap-2 overflow-x-auto flex-1">
                                    {onlineUsers && onlineUsers.length > 0 ? (
                                        onlineUsers.map((u, idx) => (
                                            <span 
                                                key={idx} 
                                                className="px-3 py-1 bg-blue-600/80 text-white rounded-full text-sm whitespace-nowrap border border-blue-400/30"
                                            >
                                                {u.userName}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 text-sm">Nenhum usuário online</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Container de Mensagens */}
                        <div className="h-96 overflow-y-auto p-6 bg-black/20">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-400 py-12">
                                    <div className="text-lg mb-2">Nenhuma mensagem ainda</div>
                                    <div className="text-sm">Seja o primeiro a conversar!</div>
                                </div>
                            ) : (
                                messages.map((msg, index) => (
                                    <Message 
                                        key={index} 
                                        sender={msg.sender}
                                        content={msg.content}
                                        timestamp={msg.timestamp}
                                        isMine={msg.sender === userName}
                                    />
                                ))
                            )}
                        </div>

                        {/* Input de Mensagem */}
                        <div className="p-4 bg-black/40 border-t border-gray-700/50">
                            <form onSubmit={handleSend} className="flex space-x-3">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder={isConnected ? "Digite sua mensagem..." : "Conectando ao servidor..."}
                                    disabled={!isConnected}
                                    className="flex-1 p-3 bg-black/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-neonBlue transition-all duration-200"
                                />
                                <button
                                    type="submit"
                                    disabled={!isConnected || !messageInput.trim()}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                                        isConnected && messageInput.trim() 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-500/30' 
                                            : 'bg-gray-600 text-gray-400 cursor-not-allowed border-2 border-gray-500/30'
                                    }`}
                                >
                                    Enviar
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Informações adicionais */}
                    <div className="text-center mt-6">
                        <p className="text-gray-300 text-sm">
                            Converse com outros treinadores Pokémon em tempo real!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}