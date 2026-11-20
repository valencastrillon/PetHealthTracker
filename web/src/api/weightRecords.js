import { supabase } from "./supabaseClient";

// Obtener historial de peso por mascota
export const getWeightRecordsRequest = async (petId) => {
  if (!petId) return [];

  const { data, error } = await supabase
    .from("weight_records")
    .select("*")
    .eq("pet_id", petId)
    .order("recorded_at", { ascending: true });

  if (error) {
    throw new Error(error.message || "Error al cargar historial de peso");
  }

  return data ?? [];
};

// Crear registro de peso
export const createWeightRecordRequest = async (petId, data = {}) => {
  if (!petId) {
    throw new Error("El ID de la mascota es obligatorio para guardar el peso");
  }

  const rawWeight = typeof data === "object" ? data.weight : data;
  const parsedWeight = Number(rawWeight);

  if (Number.isNaN(parsedWeight)) {
    throw new Error("El valor del peso debe ser numérico");
  }

  const payload = {
    pet_id: petId,
    weight: parsedWeight,
    recorded_at:
      typeof data === "object" && data.recorded_at
        ? data.recorded_at
        : new Date().toISOString(),
  };

  const { data: created, error } = await supabase
    .from("weight_records")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Error al guardar peso");
  }

  return created;
};