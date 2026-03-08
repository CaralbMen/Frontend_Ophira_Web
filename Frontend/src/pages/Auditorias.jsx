import { Search, Plus, Calendar, Filter, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Auditorias = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [filtroActivo, setFiltroActivo] = useState('todas');

  // Datos de ejemplo
  const auditorias = [
    {
      id: 'AUD-2023-001',
      usuario: {
        nombre: 'Elena García',
        rol: 'Supervisor',
        avatar: 'EG'
      },
      fecha: '25 Oct, 2023',
      hora: '10:30 AM',
      estado: 'completada'
    },
    {
      id: 'AUD-2023-002',
      usuario: {
        nombre: 'Roberto Sanz',
        rol: 'Auditor Interno',
        avatar: 'RS'
      },
      fecha: '25 Oct, 2023',
      hora: '11:45 AM',
      estado: 'progreso'
    },
    {
      id: 'AUD-2023-003',
      usuario: {
        nombre: 'Carla Méndez',
        rol: 'Inventario',
        avatar: 'CM'
      },
      fecha: '24 Oct, 2023',
      hora: '09:15 AM',
      estado: 'completada'
    },
    {
      id: 'AUD-2023-004',
      usuario: {
        nombre: 'Miguel Torres',
        rol: 'Auditor Junior',
        avatar: 'MT'
      },
      fecha: '24 Oct, 2023',
      hora: '04:20 PM',
      estado: 'pendiente'
    },
    {
      id: 'AUD-2023-005',
      usuario: {
        nombre: 'Ana Martínez',
        rol: 'Supervisor',
        avatar: 'AM'
      },
      fecha: '23 Oct, 2023',
      hora: '02:30 PM',
      estado: 'completada'
    },
    {
      id: 'AUD-2023-006',
      usuario: {
        nombre: 'Luis Hernández',
        rol: 'Auditor Interno',
        avatar: 'LH'
      },
      fecha: '23 Oct, 2023',
      hora: '08:45 AM',
      estado: 'progreso'
    },
  ];

  const filtros = [
    { id: 'todas', label: 'Todas' },
    { id: 'completadas', label: 'Completadas' },
    { id: 'progreso', label: 'En progreso' },
    { id: 'pendientes', label: 'Pendientes' }
  ];

  const auditoriasFiltradas = auditorias.filter(auditoria => {
    if (filtroActivo === 'todas') return true;
    if (filtroActivo === 'completadas') return auditoria.estado === 'completada';
    if (filtroActivo === 'progreso') return auditoria.estado === 'progreso';
    if (filtroActivo === 'pendientes') return auditoria.estado === 'pendiente';
    return true;
  });

  const getColorAvatar = (index) => {
    const colores = [
      'bg-blue-600',
      'bg-purple-600',
      'bg-green-600',
      'bg-orange-600',
      'bg-pink-600',
      'bg-teal-600'
    ];
    return colores[index % colores.length];
  };

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
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          <Plus size={16} />
          Nueva Auditoría
        </button>
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
              className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Filtro de fecha */}
          <div className="flex gap-2">
            <select className={`px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${
              isDark
                ? 'bg-slate-700 border-slate-600 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <option>Esta semana</option>
              <option>Este mes</option>
              <option>Último trimestre</option>
              <option>Este año</option>
            </select>

            <button className={`p-2 border rounded-lg transition ${
              isDark
                ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Pestañas de filtro */}
      <div className="flex gap-2">
        {filtros.map(filtro => (
          <button
            key={filtro.id}
            onClick={() => setFiltroActivo(filtro.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filtroActivo === filtro.id
                ? 'bg-blue-600 text-white'
                : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filtro.label}
          </button>
        ))}
      </div>

      {/* Tabla de auditorías */}
      <div className={`rounded-lg border overflow-hidden transition ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
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
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {auditoriasFiltradas.map((auditoria, index) => (
                <tr key={auditoria.id} className={`transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                  <td className="px-6 py-4">
                    <span className="text-blue-600 font-semibold text-sm hover:text-blue-700 cursor-pointer">
                      {auditoria.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${getColorAvatar(index)} flex items-center justify-center text-white text-sm font-semibold`}>
                        {auditoria.usuario.avatar}
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                          {auditoria.usuario.nombre}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {auditoria.usuario.rol}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {auditoria.fecha}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {auditoria.hora}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => navigate(`/auditorias/${auditoria.id}`)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition"
                    >
                      Ver Detalles
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
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
