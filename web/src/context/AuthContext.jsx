/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapSupabaseUser = (sbUser) => {
    if (!sbUser) return null;
    return {
      id: sbUser.id,
      email: sbUser.email,
      username:
        sbUser.user_metadata?.full_name ||
        sbUser.user_metadata?.username ||
        sbUser.email?.split("@")[0],
      photo_url: sbUser.user_metadata?.avatar_url || null,
    };
  };

  useEffect(() => {
    // 1. Verificar sesión activa al cargar
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(mapSupabaseUser(session?.user ?? null));
      } catch (error) {
        console.error("Error obteniendo sesión:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 2. Escuchar cambios de sesión (login con Google, logout, expiración)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async (username, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, full_name: username },
      },
    });
    if (error) throw error;
    setUser(mapSupabaseUser(data.user));
    return data.user;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setUser(mapSupabaseUser(data.user));
    return data.user;
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, loginWithGoogle, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}