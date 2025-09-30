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
    setNewPassword("");
  };

  const handleModalSubmit = async (e) => {
    await handleUpdate(e);
    if (e.defaultPrevented) return;
    setShowEditModal(false);
  };

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-700 shadow-lg relative z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex flex-col items-center gap-0">
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
              </div>
            </div>

            {/* Links de navegação */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <NavLink href="/favorites" currentPath={pathname}>
                  ⭐ Favoritos
                </NavLink>
                <NavLink href="/chat" currentPath={pathname}>
                  💬 Chat
                </NavLink>
                {!user && (
                  <NavLink href="/register" currentPath={pathname}>
                    📝 Cadastrar
                  </NavLink>
                )}
              </div>

              {/* Dropdown do usuário */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-600"
                  >
                    <div className="w-10 h-10 flex items-center justify-center">
                      <Image 
                        src="/image.png"
                        alt="Ícone Pokémon" 
                        width={28} 
                        height={28}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-white font-medium hidden md:block">{user.name}</span>
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-xl border border-gray-600 z-50">
                      <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 flex items-center justify-center">
                            <Image 
                              src="/image.png"
                              alt="Ícone Pokémon" 
                              width={32} 
                              height={32}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{user.name}</p>
                            <p className="text-sm text-gray-300">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={handleEditClick}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Editar Perfil</span>
                        </button>

                        <button
                          onClick={() => {
                            handleLogout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200 mt-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <NavLink href="/login" currentPath={pathname}>
                  🔐 Login
                </NavLink>
              )}
            </div>

            {/* Menu mobile */}
            <div className="md:hidden">
              <MobileMenu pathname={pathname} user={user} handleLogout={handleLogout} onEditClick={handleEditClick} />
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de Edição */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleModalClose}
          ></div>
          
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative z-[70] border border-gray-600 transform transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Editar Perfil</h3>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleModalSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Nome</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Nova Senha</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Deixe em branco para manter a senha atual"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-400 mt-2">Mínimo 6 caracteres (opcional)</p>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-semibold border border-blue-500"
                  >
                    Salvar Alterações
                  </button>
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-semibold border border-gray-500"
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

// Componente para links de navegação
function NavLink({ href, currentPath, children }) {
  const isActive = currentPath === href;

  return (
    <Link 
      href={href}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
        isActive 
          ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20' 
          : 'text-gray-300 hover:text-white hover:bg-gray-800 border-transparent hover:border-gray-600'
      }`}
    >
      {children}
    </Link>
  );
}

// Componente para menu mobile
function MobileMenu({ pathname, user, handleLogout, onEditClick }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-white hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-600"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-20 left-0 right-0 bg-gray-800 border-b border-gray-600 shadow-xl z-50">
          <div className="px-4 py-4 space-y-2">
            <MobileNavLink href="/favorites" currentPath={pathname} onClick={() => setIsOpen(false)}>
              ⭐ Favoritos
            </MobileNavLink>
            <MobileNavLink href="/chat" currentPath={pathname} onClick={() => setIsOpen(false)}>
              💬 Chat
            </MobileNavLink>
            <MobileNavLink href="/register" currentPath={pathname} onClick={() => setIsOpen(false)}>
              📝 Cadastrar
            </MobileNavLink>
            
            {user ? (
              <>
                <div className="px-3 py-3 text-white border-t border-gray-700 mt-2 pt-3">
                  <div className="text-sm text-gray-300">Logado como:</div>
                  <div className="font-semibold">{user.name}</div>
                </div>
                <button
                  onClick={() => {
                    onEditClick();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-3 rounded-lg text-white hover:bg-gray-700 transition-all duration-200"
                >
                  ✏️ Editar Perfil
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-all duration-200"
                >
                  🚪 Sair
                </button>
              </>
            ) : (
              <MobileNavLink href="/login" currentPath={pathname} onClick={() => setIsOpen(false)}>
                🔐 Login
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
      className={`block px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
          : 'text-gray-300 hover:text-white hover:bg-gray-700'
      }`}
    >
      {children}
    </Link>
  );
}