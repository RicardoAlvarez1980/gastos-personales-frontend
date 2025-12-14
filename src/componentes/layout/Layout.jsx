export default function Layout({ sidebar, children }) {
  return (
    <div style={{ display: 'flex' }}>
      {sidebar}
      <main style={{ flex: 1, padding: 20 }}>
        {children}
      </main>
    </div>
  );
}
