// utils/formateo.js

export function formatearNombreServicio(nombre) {
  if (!nombre) return '—'

  if (nombre === 'EXPENSAS_EXTRAS') {
    return 'Expensas Extraordinarias'
  }

  return nombre
    .toLowerCase()
    .split('_')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

export function nombreMes(mes) {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  return meses[mes - 1] || '—'
}
