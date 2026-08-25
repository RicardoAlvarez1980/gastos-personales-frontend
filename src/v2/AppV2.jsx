import { useState } from 'react';
import './styles/v2.css';

const menu = [
  { id: 'inicio', label: 'Inicio', icon: '⌂' },
  { id: 'gastos', label: 'Gastos', icon: '▤' },
  { id: 'agregar', label: 'Agregar gasto', icon: '+' },
  { id: 'analisis', label: 'Análisis', icon: '◒' },
  { id: 'buscar', label: 'Buscar', icon: '⌕' },
];

function Placeholder({ section }) {
  const item = menu.find((entry) => entry.id === section);
  return (
    <section className="v2-placeholder">
      <span className="v2-eyebrow">GASTOS PERSONALES · V2</span>
      <h2>{item?.label}</h2>
      <p>Este módulo será conectado en la próxima etapa.</p>
    </section>
  );
}

function Inicio() {
  return (
    <section className="v2-dashboard">
      <div className="v2-welcome">
        <div>
          <span className="v2-eyebrow">RESUMEN</span>
          <h2>Mis gastos</h2>
          <p>Una vista clara de lo que realmente registraste.</p>
        </div>
        <div className="v2-period">
          <label htmlFor="year">Año</label>
          <select id="year" defaultValue="2026">
            <option>2026</option>
          </select>
        </div>
      </div>

      <div className="v2-cards">
        <article><span>Total del año</span><strong>$ 0,00</strong><small>Datos reales registrados</small></article>
        <article><span>Meses cargados</span><strong>0</strong><small>Sobre el año seleccionado</small></article>
        <article><span>Servicios</span><strong>0</strong><small>Con gastos registrados</small></article>
      </div>

      <div className="v2-panel">
        <span className="v2-eyebrow">PRÓXIMAMENTE</span>
        <h3>Evolución de gastos</h3>
        <p>Acá aparecerá la evolución mensual cuando conectemos los datos de Supabase.</p>
      </div>
    </section>
  );
}

export default function AppV2() {
  const [section, setSection] = useState('inicio');

  return (
    <div className="v2-shell">
      <aside className="v2-sidebar">
        <div className="v2-brand"><span className="v2-brand-mark">$</span><div><strong>Gastos</strong><small>PERSONALES · V2</small></div></div>
        <nav>
          {menu.map((item) => (
            <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="v2-sidebar-footer">Versión 2.0 · base inicial</div>
      </aside>

      <main className="v2-main">
        <header className="v2-header">
          <div><span className="v2-eyebrow">CONTROL PERSONAL</span><h1>{menu.find((item) => item.id === section)?.label}</h1></div>
        </header>
        {section === 'inicio' ? <Inicio /> : <Placeholder section={section} />}
      </main>
    </div>
  );
}
