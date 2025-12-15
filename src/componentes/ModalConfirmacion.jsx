    export default function ModalConfirmacion({ visible, mensaje, onConfirmar, onCancelar, colores }) {
    if (!visible) return null

    return (
        <div
        style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}
        >
        <div
            style={{
            backgroundColor: colores.fondoForm,
            padding: 20,
            borderRadius: 10,
            maxWidth: 400,
            width: '90%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            color: colores.texto,
            textAlign: 'center',
            }}
        >
            <p style={{ marginBottom: 20, fontSize: 16 }}>{mensaje}</p>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <button
                onClick={onCancelar}
                style={{
                backgroundColor: '#ccc',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: '600',
                }}
            >
                Cancelar
            </button>
            <button
                onClick={onConfirmar}
                style={{
                backgroundColor: colores.botonFondo,
                color: colores.botonTexto,
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: '600',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = colores.botonHover)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = colores.botonFondo)}
            >
                Modificar
            </button>
            </div>
        </div>
        </div>
    )
    }
