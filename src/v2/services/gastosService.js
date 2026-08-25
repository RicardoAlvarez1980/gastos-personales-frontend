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

export async function obtenerGastosPorPeriodo(anio, mes) {
  if (!anio || !mes) return [];

  const { data, error } = await supabase
    .from('gastos')
    .select('id, servicio_id, año, mes, importe, servicios(id, nombre)')
    .eq('año', Number(anio))
    .eq('mes', Number(mes))
    .order('servicio_id', { ascending: true });

  if (error) throw new Error(`No se pudieron obtener los gastos: ${error.message}`);
  return data ?? [];
}
