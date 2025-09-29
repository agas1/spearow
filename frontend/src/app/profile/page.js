"use client";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Obter o email do usuário logado do localStorage
    const userEmail = localStorage.getItem("userEmail");

    if (userEmail) {
      // 2. Fazer a requisição para buscar os dados do usuário no seu backend
      const fetchUserData = async () => {
        try {
          // Ajuste o endpoint da sua API para buscar o usuário por email
          const res = await fetch(`http://localhost:4000/users?email=${userEmail}`);
          if (!res.ok) {
            throw new Error("Erro ao carregar dados do usuário.");
          }
          const data = await res.json();
          // Supondo que a API retorna um array com um único objeto de usuário
          setUser(data[0]); 
        } catch (error) {
          console.error("Erro ao buscar dados do perfil:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      // Se não houver email no localStorage, o usuário não está logado
      // Redirecione-o ou exiba uma mensagem
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Carregando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-red-500">
          Você não está logado. Por favor, faça login.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Meu Perfil
        </h1>
        <div className="space-y-4">
          <p className="text-lg">
            <strong className="font-semibold">Nome:</strong> {user.name}
          </p>
          <p className="text-lg">
            <strong className="font-semibold">Email:</strong> {user.email}
          </p>
        </div>
      </div>
    </div>
  );
}