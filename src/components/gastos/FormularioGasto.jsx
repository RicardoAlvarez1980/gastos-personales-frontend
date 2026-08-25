import { useEffect, useState } from 'react';
import { formatearNombreServicio } from '../../utils/formateo';
import '../../styles/ui-icons.css';

const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const iconos = {
  add: new URL('../../assets/icons/add.png', import.meta.url).href,
  calendar: new URL('../../assets/icons/calendar month.png', import.meta.url).href,
  service: new URL('../../assets/icons/service.png', import.meta.url).href,
  money: new URL('../../assets/icons/money.png', import.meta.url).href,
  save: new URL('../../assets/icons/save.png', import.meta.url).href,
};

export default function FormularioGasto({ anios, servicios, onGuardar, loading }) {
  const [form, setForm] = useState({ año: '', mes: '', servicio_id: '', importe: '' });

  useEffect(() => {
    if (anios.length && !form.año) setForm((prev) => ({ ...prev, año: String(anios[0]) }));
  }, [anios, form.año]);

  const cambiar = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    if (!form.año || !form.mes || !form.servicio_id || form.importe === '') return;
    const ok = await onGuardar({ año: Number(form.año), mes: Number(form.mes), servicio_id: Number(form.servicio_id), importe: Number(form.importe) });
    if (ok) setForm((prev) => ({ ...prev, servicio_id: '', importe: '' }));
  };

  return <form className="v2-form" onSubmit={enviar}>
    <div className="v2-form-intro"><span className="v2-form-icon"><img src={iconos.add} alt="" /></span><div><h3>Nuevo gasto</h3><p>Completá los datos del gasto que querés registrar.</p></div></div>
    <div className="v2-form-grid">
      <label><span><img className="v2-field-icon" src={iconos.calendar} alt="" />Año</span><select name="año" value={form.año} onChange={cambiar}><option value="">Seleccioná un año</option>{anios.map((a) => <option key={a} value={a}>{a}</option>)}</select></label>
      <label><span><img className="v2-field-icon" src={iconos.calendar} alt="" />Mes</span><select name="mes" value={form.mes} onChange={cambiar} disabled={!form.año}><option value="">Seleccioná un mes</option>{meses.map((nombre, i) => <option key={i + 1} value={i + 1}>{nombre}</option>)}</select></label>
      <label className="v2-form-wide"><span><img className="v2-field-icon" src={iconos.service} alt="" />Servicio</span><select name="servicio_id" value={form.servicio_id} onChange={cambiar}><option value="">Seleccioná un servicio</option>{servicios.map((s) => <option key={s.id} value={s.id}>{formatearNombreServicio(s.nombre)}</option>)}</select></label>
      <label><span><img className="v2-field-icon" src={iconos.money} alt="" />Importe</span><div className="v2-money-input"><b>$</b><input name="importe" type="number" min="0" step="0.01" value={form.importe} onChange={cambiar} placeholder="0,00" /></div></label>
    </div>
    <div className="v2-form-footer"><small>El gasto se guardará en el período seleccionado.</small><button className="v2-primary-button" type="submit" disabled={loading}>{loading ? 'Guardando…' : <><img className="v2-save-icon" src={iconos.save} alt="" />Guardar gasto</>}</button></div>
  </form>;
}
