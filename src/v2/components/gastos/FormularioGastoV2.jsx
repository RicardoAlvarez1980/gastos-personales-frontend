import { useEffect, useState } from 'react';

const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export default function FormularioGastoV2({ anios, servicios, onGuardar, loading }) {
  const [form, setForm] = useState({ año: '', mes: '', servicio_id: '', importe: '' });

  useEffect(() => {
    if (anios.length && !form.año) setForm((prev) => ({ ...prev, año: String(anios[0]) }));
  }, [anios, form.año]);

  const cambiar = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    if (!form.año || !form.mes || !form.servicio_id || form.importe === '') return;
    const ok = await onGuardar({
      año: Number(form.año), mes: Number(form.mes), servicio_id: Number(form.servicio_id), importe: Number(form.importe),
    });
    if (ok) setForm((prev) => ({ ...prev, servicio_id: '', importe: '' }));
  };

  return <form className="v2-form" onSubmit={enviar}>
    <div className="v2-form-grid">
      <label>Año<select name="año" value={form.año} onChange={cambiar}><option value="">Seleccioná un año</option>{anios.map((a) => <option key={a} value={a}>{a}</option>)}</select></label>
      <label>Mes<select name="mes" value={form.mes} onChange={cambiar} disabled={!form.año}><option value="">Seleccioná un mes</option>{meses.map((nombre, i) => <option key={i + 1} value={i + 1}>{nombre}</option>)}</select></label>
      <label>Servicio<select name="servicio_id" value={form.servicio_id} onChange={cambiar}><option value="">Seleccioná un servicio</option>{servicios.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}</select></label>
      <label>Importe<input name="importe" type="number" min="0" step="0.01" value={form.importe} onChange={cambiar} placeholder="0,00" /></label>
    </div>
    <button className="v2-primary-button" type="submit" disabled={loading}>{loading ? 'Guardando…' : 'Guardar gasto'}</button>
  </form>;
}
