// app/components/Navbar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Navbar({ user, handleUpdate, handleLogout, isEditing, setIsEditing, newName, setNewName, newPassword, setNewPassword }) {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    setShowEditModal(true);
    setIsUserMenuOpen(false);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setIsEditing(false);
    setNewPassword(""); // Limpa a senha ao fechar
  };

  const handleModalSubmit = async (e) => {
    await handleUpdate(e);
    if (e.defaultPrevented) return; // Se o handleUpdate preveniu o default (sucesso)
    setShowEditModal(false);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo e título */}
            <div className="flex items-center space-x-8">
              <div className="flex flex-col items-center gap-0">
                {/* Logo Apearow acima */}
                <Image 
                  src="/apearow.png" 
                  alt="Apearow Logo" 
                  width={120} 
                  height={40}
                  className="object-contain"
                />
                {/* Pokébola abaixo */}
                <Image 
                  src="/pokeball.png" 
                  alt="Pokébola" 
                  width={32} 
                  height={32}
                  className="object-contain -mt-3"
                />
              </div>
            </div>

            {/* Links de usuário com dropdown */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                <Link href="/favorites" className="hover:text-gray-900 transition-colors">
                  Favoritos
                </Link>
                <Link href="/chat" className="hover:text-gray-900 transition-colors">
                  Chat
                </Link>
                <Link href="register" className="hover:text-gray-900 transition-colors">
                  Cadastrar novo Usuario
                </Link>
              </div>

              {/* Dropdown do usuário */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    {/* Ícone de Pokémon - usando image.png */}
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Image 
                        src="/image.png" // Nome do arquivo em public
                        alt="Ícone Pokémon" 
                        width={24} 
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm text-gray-700 hidden md:block">{user.name}</span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          {/* Ícone maior no dropdown */}
                          <div className="w-10 h-10 flex items-center justify-center">
                            <Image 
                              src="/image.png" // Nome do arquivo em public
                              alt="Ícone Pokémon" 
                              width={28} 
                              height={28}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        {/* Editar Perfil - Abre modal */}
                        <button
                          onClick={handleEditClick}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Editar Perfil</span>
                        </button>

                        {/* Logout */}
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors mt-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Sair</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!user && (
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Login
                </Link>
              )}
            </div>

            {/* Menu mobile */}
            <div className="md:hidden">
              <MobileMenu pathname={pathname} user={user} handleLogout={handleLogout} onEditClick={handleEditClick} />
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de Edição com blur no fundo */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Overlay com blur */}
          <div 
            className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"
            onClick={handleModalClose}
          ></div>
          
          {/* Conteúdo da modal */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative z-10 border border-gray-200 transform transition-transform duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Editar Perfil</h3>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleModalSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Deixe em branco para manter a senha atual"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-2">Mínimo 6 caracteres (opcional)</p>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium shadow-sm"
                  >
                    Salvar Alterações
                  </button>
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Componente para menu mobile atualizado
function MobileMenu({ pathname, user, handleLogout, onEditClick }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-20">
          <div className="px-4 py-3 space-y-1">
            <MobileNavLink href="/favorites" currentPath={pathname} onClick={() => setIsOpen(false)}>
              Favoritos
            </MobileNavLink>
            <MobileNavLink href="/chat" currentPath={pathname} onClick={() => setIsOpen(false)}>
              Chat
            </MobileNavLink>
             <MobileNavLink href="/register"Path={pathname} onClick={() => setIsOpen(false)}>
              Cdastrar novo usuario
            </MobileNavLink>
            
            {user ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-500 border-t border-gray-200 mt-2 pt-2">
                  Logado como: {user.name}
                </div>
                <button
                  onClick={() => {
                    onEditClick();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Editar Perfil
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <MobileNavLink href="/login" currentPath={pathname} onClick={() => setIsOpen(false)}>
                Login
              </MobileNavLink>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Componente para links mobile
function MobileNavLink({ href, currentPath, children, onClick }) {
  const isActive = currentPath === href;

  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
        isActive 
          ? 'bg-red-50 text-red-700' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
}