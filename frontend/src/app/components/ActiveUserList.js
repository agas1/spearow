"use client";
import { User } from 'lucide-react';
import useChat from '../hooks/useSocketChat';

export default function ActiveUserList() {
    // Obtém lista de usuários ativos e status da conexão
    const { activeUsers, isConnected } = useChat(); 

    // Remove usuários duplicados da lista
    const uniqueUsers = activeUsers.reduce((acc, current) => {
        if (!acc.some(user => user.name === current.name)) {
            acc.push(current);
        }
        return acc;
    }, []);

    // Mostra mensagem quando não há usuários online
    if (!isConnected || uniqueUsers.length === 0) {
        return (
            <div className="text-sm text-center text-gray-500 p-2">
                Ninguém online no momento.
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-bold text-green-600 border-b pb-2 mb-3">
                <span className="capitalize">{uniqueUsers.length}</span> Treinador(es) Online
            </h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
                {uniqueUsers.map(user => (
                    <li key={user.id} className="flex items-center space-x-2 text-gray-700">
                        <span className="text-green-500 animate-pulse">●</span>
                        <span className="capitalize font-medium">{user.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}