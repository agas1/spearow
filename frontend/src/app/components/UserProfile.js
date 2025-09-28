import { useState } from "react";

export default function UserProfile({ user, handleUpdate, handleLogout, isEditing, setIsEditing, setNewName, newName, newPassword, setNewPassword }) {
  
  if (!user) return null;

  // Função auxiliar para reverter as alterações de nome/senha
  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewName(user.name);
    setNewPassword("");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl mb-8 mt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Bem-vindo, <span className="capitalize">{user.name}</span>!
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200"
        >
          Logout
        </button>
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          <p className="text-lg">
            <strong className="font-semibold">Email:</strong> {user.email}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Editar Perfil
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Novo Nome:</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Novo Nome"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha (opcional):</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nova Senha (deixe vazio para manter)"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors duration-200"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 px-4 py-2 text-sm text-gray-800 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors duration-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}