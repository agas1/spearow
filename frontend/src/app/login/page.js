"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", data.user.email);

        router.push("/");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Email ou senha incorretos");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao conectar com o servidor.");
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
        <div className="relative card-background rounded-2xl p-8 flex flex-col items-center shadow-2xl border-2 border-neonBlue/20 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex flex-col items-center gap-0 mb-8">
            <Image
              src="/apearow.png"
              alt="Spearow Logo"
              width={140}
              height={50}
              className="object-contain"
            />
            <Image
              src="/pokeball.png"
              alt="Pokébola"
              width={40}
              height={40}
              className="object-contain -mt-3"
            />
            <p className="text-gray-300 text-lg mt-2">Entre na sua conta</p>
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-neonBlue transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Senha
              </label>
              <input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neonBlue focus:border-neonBlue transition-all duration-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow-lg text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  Entrando...
                </div>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <div className="w-full flex items-center my-6">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-3 text-gray-400 text-sm">ou</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-300 mb-4">Não tem uma conta?</p>
            <Link
              href="/register"
              className="inline-block py-3 px-6 bg-green-600 hover:bg-green-700 rounded-lg shadow-lg text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] border-2 border-green-500/30"
            >
              Criar Cadastro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
