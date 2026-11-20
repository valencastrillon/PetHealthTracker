import { supabase } from "./supabaseClient";

// Obtener el ID del usuario autenticado en Supabase
const getCurrentUserId = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw new Error(error.message);
  const userId = session?.user?.id;
  if (!userId) throw new Error("No hay una sesión activa en Supabase");
  return userId;
};

// Obtener IDs de mascotas del usuario actual para filtrar recordatorios
const getUserPetIds = async () => {
  const ownerId = await getCurrentUserId();
  const { data: pets, error } = await supabase
    .from("pets")
    .select("id")
    .eq("owner_id", ownerId);

  if (error) throw new Error(error.message);
  return (pets ?? []).map((pet) => pet.id);
};

// Crear un recordatorio
export const createReminderRequest = async (data) => {
  const payload = {
    pet_id: data.pet_id,
    title: data.title,
    type: data.type, // 'VACUNA' | 'ALIMENTACION' | 'VISITA' | 'TRATAMIENTO' | 'OTRO'
    date: data.date || null,
    is_completed: Boolean(data.is_completed),
    is_urgent: Boolean(data.is_urgent),
    is_routine: Boolean(data.is_routine),
    times: Array.isArray(data.times) ? data.times : [],
    updated_at: new Date().toISOString(),
  };

  const { data: created, error } = await supabase
    .from("reminders")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al crear recordatorio: ${error.message}`);
  }

  return created;
};

// Obtener todos los recordatorios del usuario actual
export const getRemindersRequest = async () => {
  const petIds = await getUserPetIds();
  if (petIds.length === 0) return [];

  const { data, error } = await supabase
    .from("reminders")
    .select(`
      *,
      pet:pets (
        id,
        name,
        specie,
        breed,
        photo_url
      )
    `)
    .in("pet_id", petIds)
    .order("date", { ascending: true, nullsFirst: false });

  if (error) {
    throw new Error(`Error al obtener recordatorios: ${error.message}`);
  }

  return data ?? [];
};

// Obtener un recordatorio por ID
export const getReminderByIdRequest = async (id) => {
  const { data, error } = await supabase
    .from("reminders")
    .select(`
      *,
      pet:pets (
        id,
        name,
        specie,
        breed,
        photo_url
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error al obtener recordatorio: ${error.message}`);
  }

  return data;
};

// Actualizar recordatorio
export const updateReminderRequest = async (id, data) => {
  const payload = {
    updated_at: new Date().toISOString(),
  };

  if (data.pet_id !== undefined) payload.pet_id = data.pet_id;
  if (data.title !== undefined) payload.title = data.title;
  if (data.type !== undefined) payload.type = data.type;
  if (data.date !== undefined) payload.date = data.date || null;
  if (data.is_completed !== undefined) payload.is_completed = Boolean(data.is_completed);
  if (data.is_urgent !== undefined) payload.is_urgent = Boolean(data.is_urgent);
  if (data.is_routine !== undefined) payload.is_routine = Boolean(data.is_routine);
  if (data.times !== undefined) payload.times = Array.isArray(data.times) ? data.times : [];

  const { data: updated, error } = await supabase
    .from("reminders")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar recordatorio: ${error.message}`);
  }

  return updated;
};

// Eliminar recordatorio
export const deleteReminderRequest = async (id) => {
  const { data, error } = await supabase
    .from("reminders")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al eliminar recordatorio: ${error.message}`);
  }

  return data;
};