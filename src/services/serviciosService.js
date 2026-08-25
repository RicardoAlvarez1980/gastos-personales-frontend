import { supabase } from '../supabaseClient';

export async function obtenerServicios() {
  const { data, error } = await supabase.from('servicios').select('id, nombre').order('id', { ascending: true });
  if (error) throw new Error(`No se pudieron obtener los servicios: ${error.message}`);
  return data ?? [];
}
