import { supabase } from "./supabaseClient";

const PET_BUCKET = "health-documents"; // Puedes cambiarlo a "pet-photos" si creas otro bucket en Storage

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

// Convertir FormData (si viene así desde el formulario) a objeto plano
const normalizePetInput = (input) => {
  if (input instanceof FormData) {
    const obj = {};
    for (const [key, value] of input.entries()) {
      if (key === "photo" || key === "image" || key === "file") {
        obj.photoFile = value;
      } else {
        obj[key] = value;
      }
    }
    return obj;
  }
  return { ...(input || {}) };
};

// Subir foto de mascota a Supabase Storage si existe un File
const uploadPetPhoto = async (file, ownerId) => {
  if (!(file instanceof File)) return null;

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `pets/${ownerId}/${Date.now()}_${cleanName}`;

  const { error: uploadError } = await supabase.storage
    .from(PET_BUCKET)
    .upload(filePath, file, { upsert: false });

  if (uploadError) {
    console.warn("Error subiendo foto de mascota:", uploadError.message);
    return null;
  }

  const { data: publicData } = supabase.storage
    .from(PET_BUCKET)
    .getPublicUrl(filePath);

  return publicData?.publicUrl || null;
};

export const createPetRequest = async (petData) => {
  const ownerId = await getCurrentUserId();
  const parsed = normalizePetInput(petData);

  let photoUrl = parsed.photo_url || null;
  if (parsed.photoFile) {
    const uploadedUrl = await uploadPetPhoto(parsed.photoFile, ownerId);
    if (uploadedUrl) photoUrl = uploadedUrl;
  }

  const payload = {
    name: parsed.name,
    age: parsed.age ? String(parsed.age) : null,
    specie: parsed.specie,
    breed: parsed.breed ?? null,
    photo_url: photoUrl,
    owner_id: ownerId,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("pets")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al crear mascota: ${error.message}`);
  }

  return data;
};

export const getPetsRequest = async () => {
  const ownerId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error al obtener mascotas: ${error.message}`);
  }

  return data ?? [];
};

export const getPetByIdRequest = async (id) => {
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error al obtener mascota: ${error.message}`);
  }

  return data;
};

export const updatePetRequest = async (petId, petData) => {
  const ownerId = await getCurrentUserId();
  const parsed = normalizePetInput(petData);

  const payload = {
    updated_at: new Date().toISOString(),
  };

  if (parsed.name !== undefined) payload.name = parsed.name;
  if (parsed.age !== undefined) payload.age = parsed.age ? String(parsed.age) : null;
  if (parsed.specie !== undefined) payload.specie = parsed.specie;
  if (parsed.breed !== undefined) payload.breed = parsed.breed;
  if (parsed.photo_url !== undefined) payload.photo_url = parsed.photo_url;

  if (parsed.photoFile) {
    const uploadedUrl = await uploadPetPhoto(parsed.photoFile, ownerId);
    if (uploadedUrl) payload.photo_url = uploadedUrl;
  }

  const { data, error } = await supabase
    .from("pets")
    .update(payload)
    .eq("id", petId)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar mascota: ${error.message}`);
  }

  return data;
};

export const deletePetRequest = async (petId) => {
  const { data, error } = await supabase
    .from("pets")
    .delete()
    .eq("id", petId)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al eliminar mascota: ${error.message}`);
  }

  return data;
};