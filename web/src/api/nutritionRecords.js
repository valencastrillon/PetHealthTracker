import { supabase } from "./supabaseClient";

// Obtener registros por mascota
export const getNutritionRecordsRequest = async (petId) => {
  if (!petId) return [];

  const { data, error } = await supabase
    .from("nutrition_records")
    .select("*")
    .eq("pet_id", petId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message || "Error al cargar nutrición");
  return data ?? [];
};

// Crear registro
export const createNutritionRecordRequest = async (data) => {
  const payload = {
    pet_id: data.pet_id,
    food_type: data.food_type,
    food_brand: data.food_brand ?? null,
    daily_meals: Number(data.daily_meals),
    meal_times: Array.isArray(data.meal_times) ? data.meal_times : [],
    portion_size: data.portion_size,
    notes: data.notes ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data: created, error } = await supabase
    .from("nutrition_records")
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message || "Error al crear registro");
  return created;
};

// Eliminar registro
export const deleteNutritionRecordRequest = async (recordId) => {
  const { data, error } = await supabase
    .from("nutrition_records")
    .delete()
    .eq("id", recordId)
    .select()
    .single();

  if (error) throw new Error(error.message || "Error al eliminar registro");
  return data;
};