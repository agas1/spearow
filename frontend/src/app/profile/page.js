"use client";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");

    if (userEmail) {
      const fetchUserData = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users?email=${userEmail}`
          );

          if (!res.ok) {
            throw new Error("Erro ao carregar dados do usuário.");
          }

          const data = await res.json();
          setUser(data); // Backend retorna objeto, não array
        } catch (error) {
          console.error("Erro ao buscar dados do perfil:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
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
