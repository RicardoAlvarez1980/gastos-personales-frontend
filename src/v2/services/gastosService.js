import { supabase } from '../../supabaseClient';

/**
 * Capa única de acceso a datos para la V2.
 * Los componentes no llaman directamente a Supabase.
 */
export async function obtenerAnios() {
  const { data, error } = await supabase.rpc('get_anios_gastos');
  if (error) throw new Error(`No se pudieron obtener los años: ${error.message}`);
  return (data ?? []).map((row) => Number(row.anio ?? row.año ?? row.anio_gasto ?? Object.values(row)[0]));
}

export async function obtenerMeses(anio) {
  const { data, error } = await supabase.rpc('get_meses_por_anio', { anio_input: anio });
  if (error) throw new Error(`No se pudieron obtener los meses: ${error.message}`);
  return (data ?? []).map((row) => Number(row.mes ?? row.mes_gasto ?? Object.values(row)[0]));
}
