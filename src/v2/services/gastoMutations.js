import { supabase } from '../../supabaseClient';

export async function verificarGastoExistente({ servicio_id, año, mes }) {
  const { data, error } = await supabase.rpc('verificar_gasto_existente', {
    _servicio_id: servicio_id, _año: año, _mes: mes,
  });
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function insertarGasto({ servicio_id, año, mes, importe }) {
  const { data, error } = await supabase.rpc('insertar_gasto', {
    _servicio_id: servicio_id, _año: año, _mes: mes, _importe: importe,
  });
  if (error) throw error;
  return data;
}

export async function actualizarImporteGasto({ servicio_id, año, mes, importe }) {
  const { data, error } = await supabase.rpc('actualizar_importe_gasto', {
    _servicio_id: servicio_id, _año: año, _mes: mes, _nuevo_importe: importe,
  });
  if (error) throw error;
  return data;
}
