import { useState, useEffect, useCallback } from 'react';

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage
  useEffect(() => {
    const loadUser = () => {
      const email = localStorage.getItem('userEmail');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (isLoggedIn && email) {
        // Buscar dados do usuário no localStorage
        const userData = localStorage.getItem(`user_${email}`);
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          // Criar novo usuário se não existir
          const newUser = {
            id: Date.now(),
            name: email.split('@')[0], // Nome baseado no email
            email: email,
            favorites: []
          };
          localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
          setUser(newUser);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Atualizar usuário
  const updateUser = useCallback(async (userData) => {
    if (userData.email) {
      localStorage.setItem(`user_${userData.email}`, JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  }, []);

  // Fazer logout
  const logout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setUser(null);
  }, []);

  return {
    user,
    loading,
    updateUser,
    logout
  };
}