import { supabase } from "./supabaseClient";

// LOGIN
export const loginRequest = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || "Error en login");
  }

  return data.user;
};

// LOGIN DEMO
export const loginDemoRequest = async () => {
  const email = import.meta.env.VITE_DEMO_EMAIL || "demo@pethealth.app";
  const password = import.meta.env.VITE_DEMO_PASSWORD || "DemoPetHealth2026!";

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`No se pudo iniciar la demo: ${error.message}`);
  }

  return data.user;
};

// LOGOUT
export const logoutRequest = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message || "Error al cerrar sesión");
  }
};

// GET CURRENT USER
export const getCurrentUserRequest = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) return null;

  return session.user;
};

// REGISTER
export const registerRequest = async (username, email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: username,
      },
    },
  });

  if (error) {
    throw new Error(error.message || "Error al registrar");
  }

  return data.user;
};