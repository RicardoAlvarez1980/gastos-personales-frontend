import React from 'react';

export default function Navbar({ view, setView }) {
  const navItems = [
    { id: 'todos', label: 'Todos', icon: '📋' },
    { id: 'porAño', label: 'Por Año', icon: '📊' },
    { id: 'agregar', label: 'Agregar', icon: '➕' },
    { id: 'totales', label: 'Totales', icon: '💵' }
  ];

  return (
    <header className="app-header" style={{
      backgroundColor: '#282c34',
      padding: '1rem 2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h1 className="title" style={{
          margin: 0,
          fontSize: '1.8rem',
          color: '#61dafb',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          💰 Dashboard de Gastos
        </h1>
        
        <nav
          className="app-nav"
          role="tablist"
          aria-label="Navegación de vistas"
          style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}
        >
          {navItems.map(item => (
            <button
              key={item.id}
              className="tab-button"
              onClick={() => setView(item.id)}
              role="tab"
              aria-selected={view === item.id}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: view === item.id ? '#61dafb' : 'transparent',
                color: view === item.id ? '#282c34' : '#ddd',
                border: view === item.id ? 'none' : '2px solid #61dafb',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (view !== item.id) {
                  e.target.style.backgroundColor = 'rgba(97, 218, 251, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (view !== item.id) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}