import { Search, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const Auditorias = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [auditorias, setAuditorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarAuditorias = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('auditorias');
        const rows = Array.isArray(response?.rows) ? response.rows : [];
        setAuditorias(rows);
      } catch (e) {
        setError('No se pudieron cargar las auditorías.');
        setAuditorias([]);
      } finally {
        setLoading(false);
      }
    };

    cargarAuditorias();
  }, []);

  const auditoriasFiltradas = useMemo(() => {
    const termino = searchTerm.trim().toLowerCase();
    const now = new Date();

    return auditorias.filter((auditoria) => {
      const fechaRaw = auditoria.fecha_auditoria || auditoria.fecha_registro || auditoria.created_at || null;
      const fecha = fechaRaw ? new Date(fechaRaw) : null;

      const coincideTermino = !termino || [
        String(auditoria.id_auditoria ?? ''),
        String(auditoria.nombre_usuario ?? ''),
        String(auditoria.nombre ?? ''),
        String(auditoria.apellido_paterno ?? ''),
        String(auditoria.apellido_materno ?? ''),
      ].join(' ').toLowerCase().includes(termino);

      if (!coincideTermino) {
        return false;
      }

      if (dateFilter === 'Todas' || !fecha || Number.isNaN(fecha.getTime())) {
        return true;
      }

      if (dateFilter === 'Esta semana') {
        const diffDays = (now.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }

      if (dateFilter === 'Este mes') {
        return fecha.getMonth() === now.getMonth() && fecha.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [auditorias, searchTerm, dateFilter]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Auditorías de Activos
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Gestión y control centralizado de revisiones de activos fijos
          </p>
        </div>
        {/* <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          <Plus size={16} />
          Nueva Auditoría
        </button> */}
      </div>

      {/* Filtros y búsqueda */}
      <div className={`rounded-lg p-4 border transition ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row gap-3">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
            <input
              type="text"
              placeholder="Buscar por ID de auditoría o nombre de usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Filtro de fecha */}
          <div className="flex gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={`px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${
              isDark
                ? 'bg-slate-700 border-slate-600 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <option>Todas</option>
              <option>Esta semana</option>
              <option>Este mes</option>
            </select>
          </div>
        </div>
      </div>

    
      {/* Tabla de auditorías */}
      <div className={`rounded-lg border overflow-hidden transition ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="max-h-[28rem] overflow-auto">
          <table className="w-full">
            <thead className={`border-b transition ${
              isDark
                ? 'bg-slate-700 border-slate-600'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ID Auditoría
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Usuario
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Fecha
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Hora
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Aula
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Estado
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {loading && (
                <tr>
                  <td colSpan={7} className={`px-6 py-6 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Cargando auditorías...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-sm text-red-600">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && auditoriasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={7} className={`px-6 py-6 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    No hay auditorías para mostrar.
                  </td>
                </tr>
              )}

              {!loading && !error && auditoriasFiltradas.map((auditoria) => {
                const fechaRaw = auditoria.fecha_auditoria || auditoria.fecha_registro || auditoria.created_at || null;
                const fecha = fechaRaw ? new Date(fechaRaw) : null;
                const nombreCompleto = [auditoria.nombre_usuario || auditoria.nombre, auditoria.apellido_paterno]
                  .filter(Boolean)
                  .join(' ')
                  .trim();
                const puestoArea = [auditoria.puesto, auditoria.area].filter(Boolean).join(' de ');

                return (
                <tr key={auditoria.id_auditoria} className={`transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                  <td className="px-6 py-4">
                    <span className="text-blue-600 font-semibold text-sm hover:text-blue-700 cursor-pointer">
                      #{auditoria.id_auditoria}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className={`font-medium text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                          {nombreCompleto || `Usuario #${auditoria.id_usuario_auditor}`}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {puestoArea || '-'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {fecha && !Number.isNaN(fecha.getTime())
                      ? fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '-'}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {fecha && !Number.isNaN(fecha.getTime())
                      ? fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                      : '-'}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {auditoria.id_aula ?? '-'}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {auditoria.estado_general || 'Sin definir'}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => navigate(`/auditorias/${auditoria.id_auditoria}`)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition"
                    >
                      Ver Detalles
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>

        {/* Footer - Contador */}
        <div className={`px-6 py-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Mostrando {auditoriasFiltradas.length} de {auditorias.length} auditorías
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auditorias;
