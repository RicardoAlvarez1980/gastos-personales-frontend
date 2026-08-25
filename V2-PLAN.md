# Gastos Personales — V2

## Objetivo
Nueva interfaz para registrar y analizar gastos reales mes a mes. No proyecta gastos futuros.

## Principios
- La base de datos sigue siendo la fuente de verdad.
- Años, meses y servicios se obtienen dinámicamente.
- Alta, modificación y eliminación deben quedar desacopladas de la UI.
- La V1 no se modifica.
- La V2 debe ser modular y fácil de mantener.

## Módulos
- Inicio: resumen del período seleccionado.
- Gastos: listado, filtros, edición y eliminación.
- Cargar gasto: año, mes, servicio e importe.
- Análisis: evolución mensual/anual, por servicio y promedios históricos reales.
- Buscar: búsqueda y filtros sobre gastos registrados.

## Arquitectura prevista
src/
  components/
    layout/
    dashboard/
    gastos/
    graficos/
    common/
  hooks/
  services/
  utils/
  data/
  supabase/

## Primera etapa
1. Crear arquitectura V2 sin alterar main.
2. Separar acceso a Supabase de los componentes visuales.
3. Crear layout y navegación.
4. Crear dashboard inicial.
5. Incorporar listado y carga de gastos.
6. Incorporar análisis y búsqueda.
7. Validar contra la base existente.
