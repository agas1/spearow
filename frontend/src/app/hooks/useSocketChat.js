import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

// O servidor do chat DEVE estar rodando em uma porta diferente do Next.js (ex: 5000)
const SOCKET_SERVER_URL = "http://localhost:5000"; 

// A instância do socket será armazenada fora do componente para evitar recriação
let socket; 

export default function useChat(userName) {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Se já existe uma conexão, não faz nada
        if (socket) return; 

        // 1. Inicializa a conexão
        socket = io(SOCKET_SERVER_URL, {
            query: { userName } // Passa o nome do usuário para o servidor
        });

        // 2. Evento de Conexão
        socket.on('connect', () => {
            setIsConnected(true);
            console.log("Conectado ao servidor de chat!");
        });

        // 3. Evento de Recebimento de Mensagem
        socket.on('receive_message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // 4. Evento de Desconexão
        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log("Desconectado do servidor de chat.");
        });

        // 5. Limpeza ao desmontar o componente
        return () => {
            if (socket) {
                // Remove todos os listeners e fecha o socket
                socket.off('connect');
                socket.off('receive_message');
                socket.off('disconnect');
                socket.close();
                socket = null; // Limpa a referência
            }
        };
    }, [userName]); // Depende do nome do usuário para a query inicial

    // Função para enviar uma mensagem
    const sendMessage = useCallback((messageContent) => {
        if (socket && isConnected && messageContent.trim()) {
            const message = {
                sender: userName,
                content: messageContent,
                timestamp: new Date().toLocaleTimeString(),
            };
            // Envia a mensagem para o servidor
            socket.emit('send_message', message);
            // Adiciona a mensagem localmente para feedback instantâneo (otimismo)
            setMessages((prevMessages) => [...prevMessages, message]);
        }
    }, [isConnected, userName]);

    return { messages, sendMessage, isConnected };
}