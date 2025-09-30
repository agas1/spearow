"use client";

import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

// URL da API para buscar usuários
const USERS_API_URL = "http://localhost:4000/users";

export default function UserList({ currentUserEmail, onSelectUser }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Busca lista de usuários ao carregar o componente
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(USERS_API_URL);
                if (!res.ok) {
                    throw new Error("Falha ao carregar lista de usuários.");
                }
                const data = await res.json();
                
                // Remove usuário atual da lista
                setUsers(data.filter(u => u.email !== currentUserEmail));
            } catch (error) {
                console.error("Erro ao carregar lista de usuários:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [currentUserEmail]);

    if (loading) {
        return <div className="p-4 text-center text-gray-500">Carregando comunidade...</div>;
    }
    
    if (users.length === 0) {
        return <div className="p-4 text-center text-gray-500">Nenhum outro usuário registrado.</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Comunidade Pokémon</h2>
            <ul className="space-y-3 max-h-64 overflow-y-auto">
                {users.map(user => (
                    <li 
                        key={user.id || user.email}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <span className="font-medium capitalize">{user.name}</span>
                        <button
                            onClick={() => onSelectUser(user)}
                            className="px-3 py-1 text-sm text-white bg-indigo-500 rounded-md hover:bg-indigo-600 flex items-center space-x-1"
                            title={`Iniciar chat com ${user.name}`}
                        >
                            <MessageSquare size={16} />
                            <span>Chat</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}