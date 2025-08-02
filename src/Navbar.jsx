import React from 'react';

export default function Navbar({ view, setView }) {
  return (
    <header className="app-header">
      <h1 className="title">💰 Dashboard de Gastos</h1>
      <nav
        className="app-nav"
        role="tablist"
        aria-label="Navegación de vistas"
      >
        {view !== 'todos' && (
          <button
            className="tab-button"
            onClick={() => setView('todos')}
            role="tab"
            aria-selected={view === 'todos'}
          >
            Todos
          </button>
        )}
        {view !== 'porAño' && (
          <button
            className="tab-button"
            onClick={() => setView('porAño')}
            role="tab"
            aria-selected={view === 'porAño'}
          >
            Por Año
          </button>
        )}
      </nav>
    </header>
  );
}
