// utils/formateo.js

export function formatearNombreServicio(nombre) {
  if (!nombre) return '—'

  const nombres = {
    ARBA: 'ARBA',
    INTERNET: 'Internet',
    EXPENSAS_COMUNES: 'Expensas Comunes',
    EXPENSAS_EXTRAS: 'Expensas Extraordinarias',
    GAS: 'Gas',
    LUZ: 'Luz',
    MONOTRIBUTO: 'Monotributo',
    MOVISTAR: 'Movistar',
    PERSONAL: 'Personal',
    PROTECCION_CIUDADANA: 'Protección Ciudadana',
    'Proteccion Ciudadana': 'Protección Ciudadana',
    TASAS_RETRIBUTIVAS: 'Tasas Retributivas',
    SERVICIOS_SANITARIOS: 'Servicios Sanitarios',
  }

  if (nombres[nombre]) return nombres[nombre]

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

export function formatearImporte(valor) {
  const numero = Number(valor)
  if (!Number.isFinite(numero)) return '$ 0,00'

  return `$ ${numero.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
