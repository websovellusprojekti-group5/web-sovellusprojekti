import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const authContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/auth/me')
        .then(data => setUser(data.user))
        .catch(error => {
            setUser(null)

            if (error.status !== 401) {
                console.error(
                    'Kirjautumistilan tarkistus epäonnistui:',
                    error
                )
            }
        })
        .finally(() => setLoading(false))
}, [])

  async function login(email, password) {
    const data = await api('/auth/login',
       { 
        method: 'POST',
        body: JSON.stringify({ email, password }) 
    });

    setUser(data.user);
  }

  async function logout() {
    await api('/auth/logout', { method: 'POST' });
    setUser(null);
  }

  return (
    <authContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </authContext.Provider>
  );
}

export function useAuth() { 
  return useContext(authContext); 
}
