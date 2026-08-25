import { useState } from 'react';
import { usePeriodos } from './hooks/usePeriodos';
import { useGastos } from './hooks/useGastos';
import ListadoGastosV2 from './components/gastos/ListadoGastosV2';
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
    <div><label htmlFor="year">Año</label><select id="year" value={anio ?? ''} onChange={(e) => setAnio(Number(e.target.value))} disabled={loading || !anios.length}>
      {!anios.length && <option value="">Sin datos</option>}{anios.map((item) => <option key={item} value={item}>{item}</option>)}
    </select></div>
    <div><label htmlFor="month">Mes</label><select id="month" value={mes ?? ''} onChange={(e) => setMes(Number(e.target.value))} disabled={!meses.length}>
      {!meses.length && <option value="">Sin datos</option>}{meses.map((item) => <option key={item} value={item}>{mesesNombre[item - 1] ?? item}</option>)}
    </select></div>
  </div>;
}

function Inicio({ periodos, gastos }) {
  const { anios, anio, setAnio, meses, mes, setMes, loading, error } = periodos;
  const totalMes = gastos.reduce((sum, gasto) => sum + Number(gasto.importe || 0), 0);
  return <section className="v2-dashboard">
    <div className="v2-welcome"><div><span className="v2-eyebrow">RESUMEN</span><h2>Mis gastos</h2><p>Una vista clara de lo que realmente registraste.</p></div><SelectorPeriodos {...{ anios, anio, setAnio, meses, mes, setMes, loading }} /></div>
    {error && <div className="v2-error">{error}</div>}
    <div className="v2-cards">
      <article><span>Total del período</span><strong>{totalMes.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</strong><small>{mes ? `${mesesNombre[mes - 1]} ${anio}` : 'Sin período seleccionado'}</small></article>
      <article><span>Meses cargados</span><strong>{meses.length}</strong><small>{anio ? `Meses con datos en ${anio}` : 'Seleccioná un año'}</small></article>
      <article><span>Gastos registrados</span><strong>{gastos.length}</strong><small>En el período activo</small></article>
    </div>
    <ListadoGastosV2 anio={anio} mes={mes} gastos={gastos} loading={periodos.loading || !mes} error={error} />
  </section>;
}
function Placeholder({ section }) { const item = menu.find((entry) => entry.id === section); return <section className="v2-placeholder"><span className="v2-eyebrow">GASTOS PERSONALES · V2</span><h2>{item?.label}</h2><p>Este módulo será conectado en la próxima etapa.</p></section>; }

export default function AppV2() {
  const [section, setSection] = useState('inicio');
  const periodos = usePeriodos();
  const gastosState = useGastos(periodos.anio, periodos.mes);
  return <div className="v2-shell"><aside className="v2-sidebar"><div className="v2-brand"><span className="v2-brand-mark">$</span><div><strong>Gastos</strong><small>PERSONALES · V2</small></div></div><nav>{menu.map((item) => <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)}><span>{item.icon}</span>{item.label}</button>)}</nav><div className="v2-sidebar-footer">Versión 2.0 · base inicial</div></aside><main className="v2-main"><header className="v2-header"><div><span className="v2-eyebrow">CONTROL PERSONAL</span><h1>{menu.find((item) => item.id === section)?.label}</h1></div></header>{section === 'inicio' ? <Inicio periodos={periodos} gastos={gastosState.gastos} /> : section === 'gastos' ? <section className="v2-dashboard"><SelectorPeriodos {...periodos} /><ListadoGastosV2 anio={periodos.anio} mes={periodos.mes} {...gastosState} /></section> : <Placeholder section={section} />}</main></div>;
}
