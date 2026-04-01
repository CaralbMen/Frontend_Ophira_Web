import { Search, Download, RefreshCw, Calendar, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const normalizarFechaClave = (valor) => {
  if (!valor) return '';

  const raw = String(valor).trim();
  const directa = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (directa) {
    return directa[1];
  }

  const fecha = new Date(raw);
  if (Number.isNaN(fecha.getTime())) return '';

  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const capitalizarPrimera = (valor) => {
  const limpio = String(valor || '').trim();
  if (!limpio) return '';
  return limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase();
};

const Historial = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('Todas las Acciones');
  const [filterDate, setFilterDate] = useState('');
  const [historialData, setHistorialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dateInputRef = useRef(null);
  const tiposConDetalle = useMemo(() => new Set(['depreciacion', 'actualizacion', 'ubicacion', 'baja']), []);

  useEffect(() => {
    const cargarHistorial = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('movimientos');
        const rows = Array.isArray(response?.rows) ? response.rows : [];

        const normalizados = rows.map((mov) => {
          const fecha = mov.fecha_movimiento ? new Date(mov.fecha_movimiento) : null;
          const tipo = String(mov.tipo_movimiento || '').toLowerCase();
          const esDepreciacion = tipo === 'depreciacion';
          const nombreResponsable = [mov.nombre_usuario, mov.apellido_paterno]
            .filter(Boolean)
            .join(' ')
            .trim();
          const puestoResponsable = String(mov.puesto || mov.responsable_puesto || '').trim();
          const areaResponsable = String(mov.area || mov.responsable_area || '').trim();

          // Responsable del activo
          const nombreResponsableActivo = [mov.responsable, mov.responsable_apellido]
            .filter(Boolean)
            .join(' ')
            .trim();
          const puestoResponsableActivo = String(mov.responsable_puesto_activo || '').trim();
          const areaResponsableActivo = String(mov.responsable_area_activo || '').trim();

          return {
            id: mov.id_movimiento,
            fechaISO: mov.fecha_movimiento || null,
            fechaClave: normalizarFechaClave(mov.fecha_movimiento),
            fecha: fecha && !Number.isNaN(fecha.getTime())
              ? fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
              : '-',
            hora: fecha && !Number.isNaN(fecha.getTime())
              ? fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
              : '-',
            usuario: esDepreciacion ? 'Sistema' : (nombreResponsable || `Usuario ${mov.id_usuario}`),
            puesto: puestoResponsable || null,
            area: areaResponsable || null,
            responsableActivo: nombreResponsableActivo || 'Sin asignar',
            puestoActivo: puestoResponsableActivo || null,
            areaActivo: areaResponsableActivo || null,
            assetId: mov.id_activo,
            idActivo: mov.id_activo,
            nombreActivo: mov.nombre_activo || 'Activo sin nombre',
            categoriaActivo: mov.categoria_activo || 'Sin categoría',
            accion: capitalizarPrimera(mov.tipo_movimiento) || 'Sin tipo',
            tipoRaw: tipo,
            tieneDetalle: tiposConDetalle.has(tipo),
            accionColor:
              tipo === 'depreciacion' ? 'yellow' :
                tipo === 'baja' ? 'red' :
                  tipo === 'actualizacion' ? 'blue' :
                    'green',
            cambios: mov.descripcion || `Movimiento de tipo ${capitalizarPrimera(mov.tipo_movimiento) || 'General'}`
          };
        });

        setHistorialData(normalizados);
      } catch (e) {
        setError('No se pudo cargar el historial desde el servidor.');
        setHistorialData([]);
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [tiposConDetalle]);

  const verDetalle = (movimiento) => {
    if (!movimiento?.tieneDetalle) return;
    navigate(`/historial/${movimiento.id}/detalle`);
  };

  const historialFiltrado = useMemo(() => {
    const termino = searchTerm.trim().toLowerCase();

    return historialData.filter((item) => {
      const coincideTermino = !termino || [
        String(item.id),
        String(item.idActivo),
        String(item.assetId),
        String(item.usuario),
        String(item.puesto || ''),
        String(item.area || ''),
        String(item.responsableActivo),
        String(item.puestoActivo || ''),
        String(item.areaActivo || ''),
        String(item.nombreActivo),
        String(item.categoriaActivo),
        String(item.accion)
      ].some((valor) => valor.toLowerCase().includes(termino));

      const coincideAccion =
        filterAction === 'Todas las Acciones' ||
        String(item.accion).toLowerCase() === String(filterAction).toLowerCase();

      const coincideFecha = !filterDate || item.fechaClave === filterDate;

      return coincideTermino && coincideAccion && coincideFecha;
    });
  }, [historialData, searchTerm, filterAction, filterDate]);

  const accionesDisponibles = useMemo(() => {
    const unicas = Array.from(new Set(historialData.map((item) => item.accion).filter(Boolean)));
    return ['Todas las Acciones', ...unicas];
  }, [historialData]);

  const getAccionBadgeColor = (color) => {
    switch (color) {
      case 'green':
        return 'text-ophira-success font-semibold';
      case 'yellow':
        return 'text-ophira-warning font-semibold';
      case 'red':
        return 'text-ophira-danger font-semibold';
      case 'blue':
        return 'text-ophira-primary font-semibold';
      default:
        return 'text-slate-600 font-semibold';
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    if (historialFiltrado.length === 0) {
      return;
    }

    const registros = historialFiltrado.map((item) => ({
      Fecha: item.fecha,
      Usuario: item.usuario,
      ResponsableActivo: item.responsableActivo,
      IDActivo: item.assetId,
      Activo: item.nombreActivo,
      Categoria: item.categoriaActivo,
      Movimiento: item.accion,
      Descripcion: item.cambios
    }));

    const resumenPorTipo = Object.entries(
      historialFiltrado.reduce((acc, item) => {
        const tipo = item.accion || 'Sin tipo';
        acc[tipo] = (acc[tipo] || 0) + 1;
        return acc;
      }, {})
    ).map(([tipo, cantidad]) => ({ tipo, cantidad }));

    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    doc.setFontSize(14);
    doc.text('Historial de Actividad', 40, 40);
    doc.setFontSize(10);
    doc.text(`Registros: ${historialFiltrado.length}`, 40, 58);

    const chartX = 40;
    const chartY = 78;
    const chartW = 300;
    const chartH = 110;
    const maxCantidad = Math.max(...resumenPorTipo.map((r) => r.cantidad), 1);

    doc.setDrawColor(210, 210, 210);
    doc.rect(chartX, chartY, chartW, chartH);

    resumenPorTipo.forEach((item, idx) => {
      const barH = (item.cantidad / maxCantidad) * (chartH - 20);
      const barW = Math.max(24, (chartW - 20) / resumenPorTipo.length - 8);
      const x = chartX + 10 + idx * (barW + 8);
      const y = chartY + chartH - 10 - barH;

      doc.setFillColor(59, 130, 246);
      doc.rect(x, y, barW, barH, 'F');
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(8);
      doc.text(String(item.cantidad), x + 2, y - 3);
      doc.text(item.tipo.slice(0, 10), x, chartY + chartH + 10);
    });

    autoTable(doc, {
      startY: 210,
      head: [['Fecha', 'Usuario', 'Responsable Activo', 'ID Activo', 'Nombre', 'Categoría', 'Movimiento', 'Descripcion']],
      body: registros.map((r) => [r.Fecha, r.Usuario, r.ResponsableActivo, r.IDActivo, r.Activo, r.Categoria, r.Movimiento, r.Descripcion]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`historial_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setFilterAction('Todas las Acciones');
    setFilterDate('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
          Historial de Actividad
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition ${isDark
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
          >
            <Download size={16} />
            Exportar PDF
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            <RefreshCw size={16} />
            Refrescar
          </button>
        </div>
      </div>

      <div className={`rounded-xl p-6 border transition ${isDark
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
        }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'
              }`} size={18} />
            <input
              type="text"
              placeholder="Buscar por usuario movimiento o ID activo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition text-sm ${isDark
                  ? 'bg-ophira-bg-hover border-ophira-bg-hover text-slate-200 placeholder-slate-500 focus:border-ophira-primary'
                  : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-ophira-primary'
                } focus:outline-none focus:ring-2 focus:ring-ophira-primary/20`}
            />
          </div>

          <div className="relative">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border transition text-sm appearance-none cursor-pointer ${isDark
                  ? 'bg-ophira-bg-hover border-ophira-bg-hover text-slate-200 focus:border-ophira-primary'
                  : 'bg-white border-slate-300 text-slate-800 focus:border-ophira-primary'
                } focus:outline-none focus:ring-2 focus:ring-ophira-primary/20`}
            >
              {accionesDisponibles.map((accion) => (
                <option key={accion} value={accion}>{accion}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => dateInputRef.current?.showPicker?.()}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1"
              aria-label="Abrir calendario"
            >
              <Calendar className={isDark ? 'text-slate-400' : 'text-slate-400'} size={18} />
            </button>
            <input
              ref={dateInputRef}
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker?.()}
              onFocus={(e) => e.currentTarget.showPicker?.()}
              aria-label="Seleccionar fecha"
              className={`w-full pl-12 pr-4 py-2.5 rounded-lg border transition text-sm ${isDark
                  ? 'bg-ophira-bg-hover border-ophira-bg-hover text-slate-200 placeholder-slate-500 focus:border-ophira-primary'
                  : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-ophira-primary'
                } focus:outline-none focus:ring-2 focus:ring-ophira-primary/20 cursor-pointer`}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={limpiarFiltros} className="text-sm text-ophira-primary hover:text-ophira-primary/80 font-medium">
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Yo había ponido mi historial aki */}
      <div className={`rounded-lg border overflow-hidden transition ${isDark
          ? 'bg-ophira-bg-card border-ophira-bg-hover'
          : 'bg-white border-slate-200'
        }`}>
        <div className="max-h-[28rem] overflow-auto">
          <table className="w-full min-w-[1100px]">
            <thead className={`border-b transition ${isDark
                ? 'bg-ophira-bg-hover border-ophira-bg-hover'
                : 'bg-slate-50 border-slate-200'
              }`}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  FECHA
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  USUARIO MOVIMIENTO
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  RESPONSABLE DEL ACTIVO
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ID ACTIVO
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  NOMBRE DEL ACtiVO
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  MOVIMIENTO
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  DESCRIPCIÓN
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  VER
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {loading && (
                <tr>
                  <td colSpan={8} className={`px-4 py-8 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Cargando historial...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-sm text-red-600">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && historialFiltrado.length === 0 && (
                <tr>
                  <td colSpan={8} className={`px-4 py-8 text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    No hay movimientos para mostrar con los filtros actuales.
                  </td>
                </tr>
              )}

              {!loading && !error && historialFiltrado.map((item) => (
                <tr key={item.id} className={`transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                  <td className="px-4 py-3">
                    <div className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.fecha}</div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.hora}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <div className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.usuario}</div>
                      {(item.puesto || item.area) && (
                        <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {[item.puesto, item.area].filter(Boolean).join(' de ')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <div className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.responsableActivo}</div>
                      {(item.puestoActivo || item.areaActivo) && (
                        <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {[item.puestoActivo, item.areaActivo].filter(Boolean).join(' de ')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm font-mono ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {item.idActivo}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      {/* <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Nombre:</span> */}
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {item.nombreActivo}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {item.categoriaActivo}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${getAccionBadgeColor(item.accionColor)}`}>
                      {item.accion}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.cambios}</div>
                    {item.subcambios && (
                      <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.subcambios}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {item.tieneDetalle ? (
                      <button
                        onClick={() => verDetalle(item)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${isDark
                          ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                      >
                        <Eye size={14} />
                        Ver
                      </button>
                    ) : (
                      <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`px-6 py-4 border-t flex items-center justify-between ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Mostrando {historialFiltrado.length} de {historialData.length} movimientos
          </p>
        </div>
      </div>
    </div>
  );
};

export default Historial;
