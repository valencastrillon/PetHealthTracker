import { supabase } from "./supabaseClient";

const BUCKET_NAME = "health-documents";

// Subir archivos a Supabase Storage y devolver sus URLs públicas
const uploadDocuments = async (files = [], petId = "general") => {
  if (!Array.isArray(files) || files.length === 0) return [];

  const uploadedUrls = [];

  for (const file of files) {
    if (!(file instanceof File)) continue;

    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${petId}/${Date.now()}_${cleanName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      console.warn("Error subiendo archivo a Storage:", uploadError.message);
      continue;
    }

    const { data: publicData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    if (publicData?.publicUrl) {
      uploadedUrls.push(publicData.publicUrl);
    }
  }

  return uploadedUrls;
};

// Limpiar campos para que coincidan con la tabla health_records
const sanitizeRecordPayload = (data = {}, extraDocUrls = []) => {
  const existingUrls = Array.isArray(data.document_urls)
    ? data.document_urls
    : [];

  const payload = {
    pet_id: data.pet_id,
    type: data.type, // 'VACUNA' | 'CHEQUEO' | 'TRATAMIENTO'
    description: data.description ?? null,
    first_date: data.first_date || null,
    second_date: data.second_date || null,
    vet_name: data.vet_name ?? null,
    document_urls: [...existingUrls, ...extraDocUrls],
    updated_at: new Date().toISOString(),
  };

  // Eliminar claves undefined para no sobrescribir con vacío en updates
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  return payload;
};

// Crear HealthRecord
export const createHealthRecordRequest = async (data) => {
  const newUrls = await uploadDocuments(data.documents, data.pet_id);
  const payload = sanitizeRecordPayload(data, newUrls);

  const { data: created, error } = await supabase
    .from("health_records")
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return created;
};

// Obtener todos (incluye datos básicos de la mascota si existen)
export const getHealthRecordsRequest = async () => {
  const { data, error } = await supabase
    .from("health_records")
    .select(`
      *,
      pet:pets (
        id,
        name,
        specie,
        breed,
        photo_url,
        owner_id
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
};

// Obtener uno por ID
export const getHealthRecordByIdRequest = async (id) => {
  const { data, error } = await supabase
    .from("health_records")
    .select(`
      *,
      pet:pets (
        id,
        name,
        specie,
        breed,
        photo_url,
        owner_id
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Obtener registros de una mascota específica
export const getHealthRecordsByPetRequest = async (petId) => {
  const { data, error } = await supabase
    .from("health_records")
    .select("*")
    .eq("pet_id", petId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
};

// Actualizar
export const updateHealthRecordRequest = async (id, data) => {
  const newUrls = await uploadDocuments(data.documents, data.pet_id);
  const payload = sanitizeRecordPayload(data, newUrls);

  const { data: updated, error } = await supabase
    .from("health_records")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return updated;
};

// Eliminar
export const deleteHealthRecordRequest = async (id) => {
  const { data, error } = await supabase
    .from("health_records")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};