import { useState } from 'react';
import { usePeriodos } from './hooks/usePeriodos';
import { useGastos } from './hooks/useGastos';
import { useServicios } from './hooks/useServicios';
import { useAgregarGasto } from './hooks/useAgregarGasto';
import ListadoGastos from './components/gastos/ListadoGastos';
import FormularioGasto from './components/gastos/FormularioGasto';
import Modal from './components/common/Modal';
import './styles/v2.css';

const menu = [
  { id: 'inicio', label: 'Inicio', icon: '⌂' },
  { id: 'gastos', label: 'Gastos', icon: '▤' },
  { id: 'agregar', label: 'Agregar gasto', icon: '+' },
  { id: 'analisis', label: 'Análisis', icon: '◒' },
  { id: 'buscar', label: 'Buscar', icon: '⌕' },
];

const mesesNombre = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function SelectorPeriodos({ anios, anio, setAnio, meses, mes, setMes, loading }) {
  return <div className="v2-filters">
    <div><label htmlFor="year">Año</label><select id="year" value={anio ?? ''} onChange={e => setAnio(Number(e.target.value))} disabled={loading || !anios.length}>
      {!anios.length && <option value="">Sin datos</option>}{anios.map(item => <option key={item} value={item}>{item}</option>)}
    </select></div>
    <div><label htmlFor="month">Mes</label><select id="month" value={mes ?? ''} onChange={e => setMes(Number(e.target.value))} disabled={!meses.length}>
      {!meses.length && <option value="">Sin datos</option>}{meses.map(item => <option key={item} value={item}>{mesesNombre[item - 1] ?? item}</option>)}
    </select></div>
  </div>;
}

function Inicio({ periodos, gastosState, onEliminar }) {
  const { gastos } = gastosState;
  const total = gastos.reduce((sum, gasto) => sum + Number(gasto.importe || 0), 0);
  const mesNombre = periodos.mes ? mesesNombre[periodos.mes - 1] : '—';
  return <section className="v2-dashboard">
    <div className="v2-welcome"><div><span className="v2-eyebrow">RESUMEN</span><h2>Mis gastos</h2><p>Una vista clara de lo que realmente registraste.</p></div><SelectorPeriodos {...periodos} /></div>
    {periodos.error && <div className="v2-error">{periodos.error}</div>}
    <div className="v2-cards">
      <article><span>Total del período</span><strong>{total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</strong><small>{periodos.mes ? `${mesNombre} ${periodos.anio}` : 'Sin período seleccionado'}</small></article>
      <article><span>Meses cargados</span><strong>{periodos.meses.length}</strong><small>{periodos.anio ? `Con datos en ${periodos.anio}` : 'Seleccioná un año'}</small></article>
      <article><span>Gastos registrados</span><strong>{gastos.length}</strong><small>{periodos.mes ? mesesNombre[periodos.mes - 1] : 'Mes'} {periodos.anio || ''}</small></article>
    </div>
    <ListadoGastos anio={periodos.anio} mes={periodos.mes} gastos={gastos} loading={gastosState.loading} error={gastosState.error} onEliminar={onEliminar} onEditar={gastosState.editarImporte} />
  </section>;
}

function Agregar({ periodos, servicios, mutation }) {
  return <section className="v2-dashboard">
    <div className="v2-page-toolbar"><div><span className="v2-eyebrow">NUEVO REGISTRO</span><h2>Agregar gasto</h2><p>Registrá lo que realmente pagaste.</p></div></div>
    {mutation.error && !mutation.confirmacion && <div className="v2-error">{mutation.error}</div>}
    <FormularioGasto anios={periodos.anios} servicios={servicios} onGuardar={mutation.guardar} loading={mutation.loading} />
    {mutation.confirmacion && <Modal title="El gasto ya existe" icon="!" tone="edit" onCancel={mutation.cancelar} onConfirm={mutation.confirmar} confirmLabel="Modificar importe">
      <div className="v2-modal-context"><strong>{mutation.confirmacion.nuevo?.servicio_nombre || 'Gasto registrado'}</strong><span>{mesesNombre[(Number(mutation.confirmacion.nuevo?.mes) || 1) - 1] || ''} {mutation.confirmacion.nuevo?.año || ''}</span></div>
      <p>Ya existe un gasto para ese año, mes y servicio.</p><div className="v2-delete-amount">Actual: {mutation.confirmacion.existente.importe}</div><div className="v2-delete-amount">Nuevo: {mutation.confirmacion.nuevo.importe}</div><p className="v2-modal-hint">¿Querés reemplazar el importe actual?</p>
    </Modal>}
  </section>;
}

function Placeholder({ section }) { const item = menu.find(entry => entry.id === section); return <section className="v2-placeholder"><span className="v2-eyebrow">GASTOS PERSONALES · V2</span><h2>{item?.label}</h2><p>Este módulo será conectado en la próxima etapa.</p></section>; }

export default function App() {
  const [section, setSection] = useState('inicio');
  const periodos = usePeriodos();
  const gastosState = useGastos(periodos.anio, periodos.mes);
  const servicios = useServicios();
  const refrescarTodo = async (anioPreferido = periodos.anio, mesPreferido = periodos.mes) => {
    await periodos.refrescar({ anioPreferido, mesPreferido });
    await gastosState.recargar();
  };
  const eliminar = async (id) => {
    const ok = await gastosState.eliminar(id);
    if (ok) await periodos.refrescar({ anioPreferido: periodos.anio, mesPreferido: periodos.mes });
    return ok;
  };
  const mutation = useAgregarGasto({ onSuccess: () => refrescarTodo() });

  return <div className="v2-shell">
    <aside className="v2-sidebar"><div className="v2-brand"><span className="v2-brand-mark">$</span><div><strong>Gastos</strong><small>PERSONALES · V2</small></div></div>
      <nav>{menu.map(item => <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)}><span>{item.icon}</span>{item.label}</button>)}</nav>
      <div className="v2-sidebar-footer">Versión 2.0 · base inicial</div>
    </aside>
    <main className="v2-main"><header className="v2-header"><div><span className="v2-eyebrow">CONTROL PERSONAL</span><h1>{menu.find(item => item.id === section)?.label}</h1></div></header>
      {section === 'inicio' ? <Inicio periodos={periodos} gastosState={gastosState} onEliminar={eliminar} /> : section === 'gastos' ? <section className="v2-dashboard"><div className="v2-page-toolbar"><div><span className="v2-eyebrow">HISTORIAL</span><h2>Gastos registrados</h2></div><SelectorPeriodos {...periodos} /></div><ListadoGastos {...gastosState} onEliminar={eliminar} onEditar={gastosState.editarImporte} /> </section> : section === 'agregar' ? <Agregar periodos={periodos} servicios={servicios.servicios} mutation={mutation} /> : <Placeholder section={section} />}
    </main>
  </div>;
}
