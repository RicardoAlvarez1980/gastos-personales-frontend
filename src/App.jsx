import { useState } from 'react';
import { usePeriodos } from './hooks/usePeriodos';
import { useGastos } from './hooks/useGastos';
import { useServicios } from './hooks/useServicios';
import { useAgregarGasto } from './hooks/useAgregarGasto';
import ListadoGastos from './components/gastos/ListadoGastos';
import FormularioGasto from './components/gastos/FormularioGasto';
import Modal from './components/common/Modal';
import { formatearImporte, formatearNombreServicio } from './utils/formateo';
import './styles/v2.css';

const menu = [
  { id: 'inicio', label: 'Resumen anual', icon: '▥' },
  { id: 'gastos', label: 'Gastos mensuales', icon: '▤' },
  { id: 'agregar', label: 'Agregar gasto', icon: '+' },
  { id: 'analisis', label: 'Análisis', icon: '◒' },
  { id: 'buscar', label: 'Buscar', icon: '⌕' },
];

const mesesNombre = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function SelectorAnio({ anios, anio, setAnio, loading }) {
  return <div className="v2-filters"><div><label htmlFor="year">Año</label><select id="year" value={anio ?? ''} onChange={e => setAnio(Number(e.target.value))} disabled={loading || !anios.length}>{!anios.length && <option value="">Sin datos</option>}{anios.map(item => <option key={item} value={item}>{item}</option>)}</select></div></div>;
}

function SelectorMes({ meses, mes, setMes }) {
  return <div className="v2-filters"><div><label htmlFor="month">Mes</label><select id="month" value={mes ?? ''} onChange={e => setMes(Number(e.target.value))} disabled={!meses.length}>{!meses.length && <option value="">Sin datos</option>}{meses.map(item => <option key={item} value={item}>{mesesNombre[item - 1] ?? item}</option>)}</select></div></div>;
}

function Inicio({ periodos, gastosState, onEliminar, onEditar }) {
  const { gastos } = gastosState;
  const total = gastos.reduce((sum, gasto) => sum + Number(gasto.importe || 0), 0);

  return <section className="v2-dashboard">
    <div className="v2-welcome">
      <div><span className="v2-eyebrow">RESUMEN ANUAL</span><h2>Gastos del año</h2><p>Todos los gastos registrados, ordenados por mes y luego por servicio.</p></div>
      <SelectorAnio {...periodos} />
    </div>
    {periodos.error && <div className="v2-error">{periodos.error}</div>}
    <ListadoGastos anual anio={periodos.anio} gastos={gastos} loading={gastosState.loading} error={gastosState.error} onEliminar={onEliminar} onEditar={onEditar} total={total} titulo="GASTOS DEL AÑO" />
  </section>;
}

function GastosMensuales({ periodos, gastosState, onEliminar, onEditar }) {
  const { gastos } = gastosState;
  const total = gastos.reduce((sum, gasto) => sum + Number(gasto.importe || 0), 0);

  return <section className="v2-dashboard">
    <div className="v2-page-toolbar">
      <div><span className="v2-eyebrow">DETALLE MENSUAL</span><h2>Gastos de un mes</h2><p>Seleccioná un año y un mes para ver solamente ese período.</p></div>
      <div className="v2-period-filters"><SelectorAnio {...periodos} /><SelectorMes {...periodos} /></div>
    </div>
    <ListadoGastos anio={periodos.anio} mes={periodos.mes} gastos={gastos} loading={gastosState.loading} error={gastosState.error} onEliminar={onEliminar} onEditar={onEditar} total={total} titulo="GASTOS REGISTRADOS" />
  </section>;
}

function Agregar({ periodos, servicios, mutation }) {
  return <section className="v2-dashboard"><div className="v2-page-toolbar"><div><span className="v2-eyebrow">NUEVO REGISTRO</span><h2>Agregar gasto</h2><p>Registrá lo que realmente pagaste.</p></div></div>{mutation.error && !mutation.confirmacion && <div className="v2-error">{mutation.error}</div>}<FormularioGasto anios={periodos.anios} servicios={servicios} onGuardar={mutation.guardar} loading={mutation.loading} />{mutation.confirmacion && <Modal title="El gasto ya existe" icon="!" tone="edit" onCancel={mutation.cancelar} onConfirm={mutation.confirmar} confirmLabel="Modificar importe"><div className="v2-modal-context"><strong>{mutation.confirmacion.nuevo?.servicio_nombre || 'Gasto registrado'}</strong><span>{mesesNombre[(Number(mutation.confirmacion.nuevo?.mes) || 1) - 1] || ''} {mutation.confirmacion.nuevo?.año || ''}</span></div><p>Ya existe un gasto para ese año, mes y servicio.</p><div className="v2-delete-amount">Actual: {formatearImporte(mutation.confirmacion.existente.importe)}</div><div className="v2-delete-amount">Nuevo: {formatearImporte(mutation.confirmacion.nuevo.importe)}</div><p className="v2-modal-hint">¿Querés reemplazar el importe actual?</p></Modal>}</section>;
}

function Placeholder({ section }) { const item = menu.find(entry => entry.id === section); return <section className="v2-placeholder"><span className="v2-eyebrow">GASTOS PERSONALES · V2</span><h2>{item?.label}</h2><p>Este módulo será conectado en la próxima etapa.</p></section>; }

export default function App() {
  const [section, setSection] = useState('inicio');
  const [gastoGuardado, setGastoGuardado] = useState(null);
  const periodos = usePeriodos();
  const gastosAnuales = useGastos(periodos.anio, 'ANUAL');
  const gastosMensuales = useGastos(periodos.anio, periodos.mes);
  const servicios = useServicios();

  const refrescarTodo = async (anioPreferido = periodos.anio, mesPreferido = periodos.mes) => {
    await periodos.refrescar({ anioPreferido, mesPreferido });
  };

  const eliminarAnual = async (id) => {
    const ok = await gastosAnuales.eliminar(id);
    if (ok) await periodos.refrescar({ anioPreferido: periodos.anio, mesPreferido: periodos.mes });
    return ok;
  };

  const eliminarMensual = async (id) => {
    const ok = await gastosMensuales.eliminar(id);
    if (ok) await periodos.refrescar({ anioPreferido: periodos.anio, mesPreferido: periodos.mes });
    return ok;
  };

  const handleGastoGuardado = async (nuevo) => {
    await refrescarTodo(nuevo.año, nuevo.mes);
    setSection('gastos');
    setGastoGuardado(nuevo);
  };

  const mutation = useAgregarGasto({ onSuccess: handleGastoGuardado });
  const servicioGuardado = gastoGuardado ? servicios.servicios.find(s => Number(s.id) === Number(gastoGuardado.servicio_id)) : null;
  const cerrarExito = () => setGastoGuardado(null);
  const irAlListado = async () => { setGastoGuardado(null); await gastosMensuales.recargar(); setSection('gastos'); };

  const contenido = section === 'inicio'
    ? <Inicio periodos={periodos} gastosState={gastosAnuales} onEliminar={eliminarAnual} onEditar={gastosAnuales.editarImporte} />
    : section === 'gastos'
      ? <GastosMensuales periodos={periodos} gastosState={gastosMensuales} onEliminar={eliminarMensual} onEditar={gastosMensuales.editarImporte} />
      : section === 'agregar'
        ? <Agregar periodos={periodos} servicios={servicios.servicios} mutation={mutation} />
        : <Placeholder section={section} />;

  return <div className="v2-shell">
    <aside className="v2-sidebar"><div className="v2-brand"><span className="v2-brand-mark">$</span><div><strong>Gastos</strong><small>PERSONALES · V2</small></div></div><nav>{menu.map(item => <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)}><span>{item.icon}</span>{item.label}</button>)}</nav><div className="v2-sidebar-footer">Versión 2.0 · base inicial</div></aside>
    <main className="v2-main"><header className="v2-header"><div><span className="v2-eyebrow">CONTROL PERSONAL</span><h1>{menu.find(item => item.id === section)?.label}</h1></div></header>{contenido}</main>
    {gastoGuardado && <Modal title="Gasto agregado correctamente" icon="✓" tone="success" onCancel={cerrarExito} onConfirm={irAlListado} confirmLabel={`Ver gastos de ${mesesNombre[Number(gastoGuardado.mes) - 1]}`}><div className="v2-modal-context"><strong>{servicioGuardado ? formatearNombreServicio(servicioGuardado.nombre) : 'Gasto registrado'}</strong><span>{mesesNombre[Number(gastoGuardado.mes) - 1]} {gastoGuardado.año}</span></div><div className="v2-success-amount">{formatearImporte(gastoGuardado.importe)}</div><p className="v2-modal-hint">El gasto fue guardado correctamente. Podés revisar todos los gastos de este período.</p></Modal>}
  </div>;
}
