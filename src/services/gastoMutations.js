import { supabase } from '../supabaseClient';

export async function insertarGasto(payload) {
  const { data, error } = await supabase.rpc('insertar_gasto', { payload });
  if (error) throw error;
  return data;
}

export async function actualizarImporteGasto({ servicio_id, año, mes, importe }) {
  const { data, error } = await supabase.rpc('actualizar_importe_gasto', { servicio_id, año, mes, nuevo_importe: importe });
  if (error) throw error;
  return data;
}

export async function eliminarGasto(id) {
  const { data, error } = await supabase.rpc('eliminar_gasto', { gasto_id: id });
  if (error) throw error;
  return data;
}
