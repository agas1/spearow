"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "../config"; // 

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        alert("Cadastro realizado com sucesso!");
        router.push("/login");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Erro ao cadastrar. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao fazer o registro:", error);
      alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/fundoHome.jpg')" }}
    >
      <div className="w-full max-w-md">
        {/* Card de Registro com mesmo estilo do login */}
        <div className="relative card-background rounded-2xl p-8 flex flex-col items-center shadow-2xl border-2 border-neonBlue/20 transform hover:scale-[1.02] transition-transform duration-300">
          
          {/* Logo Spearow + Pokébola - MESMA DO LOGIN */}
          <div className="flex flex-col items-center gap-0 mb-8">
            {/* Logo Spearow acima */}
            <Image 
              src="/apearow.png" 
              alt="Spearow Logo" 
              width={140} 
              height={50}
              className="object-contain"
            />
            {/* Pokébola abaixo */}
            <Image 
              src="/pokeball.png" 
              alt="Pokébola" 
              width={40} 
              height={40}
              className="object-contain -mt-3"
            />
            {/* Texto "Crie sua conta" */}
            <p className="text-gray-300 text-lg mt-2">Crie sua conta</p>
          </div>

          <form onSubmit={handleRegister} className="w-full space-y-6">
            {/* Campo Nome */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-neonBlue transition-all duration-200"
              />
            </div>

            {/* Campo Email */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-neonBlue transition-all duration-200"
              />
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-neonBlue transition-all duration-200"
              />
              <p className="text-xs text-gray-400 mt-2">Use pelo menos 6 caracteres</p>
            </div>

            {/* Botão Registrar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded-lg shadow-lg text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  Cadastrando...
                </div>
              ) : (
                "Criar Conta"
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="w-full flex items-center my-6">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-3 text-gray-400 text-sm">ou</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Link para Login */}
          <div className="text-center">
            <p className="text-gray-300 mb-4">
              Já tem uma conta?
            </p>
            <Link 
              href="/login"
              className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] border-2 border-blue-500/30"
            >
              Fazer Login
            </Link>
          </div>

          {/* Decoração Pokémon adicional */}
          <div className="mt-6 opacity-30">
            <Image 
              src="/play.png" 
              alt="Pokébola decorativa" 
              width={32} 
              height={32}
              className="animate-pulse"
            />
          </div>
        </div>

        {/* Mensagem de boas-vindas */}
        <div className="text-center mt-6">
          <p className="text-gray-300 text-sm">
            Junte-se à aventura Pokémon!
          </p>
        </div>
      </div>
    </div>
  );
}