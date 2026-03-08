import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Download, CheckCircle, XCircle, AlertCircle, MapPin, User, Calendar } from 'lucide-react';

const DetallesAuditoria = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  // Datos de ejemplo de auditoría
  const auditoria = {
    id: 'AUD-2023-0892',
    fecha: '24 Oct 2023',
    auditor: 'Juan Pérez',
    ubicacion: 'Almacén Central',
    estado: 'Finalizada',
    ultimaSincronizacion: 'Hace 12 minutos',
    localizados: 22,
    faltantes: 2,
    activos: [
      {
        id: 'QR-091',
        nombre: 'Laptop Dell Precision 5570',
        categoria: 'Equipamiento IT',
        hallado: true,
        estadoFisico: 'Bueno',
        observaciones: 'Sin novedades. Mantenimiento al día.'
      },
      {
        id: 'QR-045',
        nombre: 'Monitor LG UltraWide 34"',
        categoria: 'Equipamiento IT',
        hallado: true,
        estadoFisico: 'Regular',
        observaciones: 'Ligeros rayones en base de soporte. Pantalla OK.'
      },
      {
        id: 'QR-192',
        nombre: 'Cámara DSLR Canon EOS',
        categoria: 'Multimedia',
        hallado: false,
        estadoFisico: 'N/A',
        observaciones: 'No localizado en la ubicación asignada. Posible extravío.'
      },
      {
        id: 'QR-098',
        nombre: 'Silla Ergonómica Herman Miller',
        categoria: 'Muebles',
        hallado: true,
        estadoFisico: 'Malo',
        observaciones: 'Mecanismo de elevación dañado. Requiere reparación.'
      }
    ]
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Finalizada':
        return 'text-green-600';
      case 'En progreso':
        return 'text-yellow-600';
      case 'Pendiente':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const getEstadoFisicoColor = (estado) => {
    switch (estado) {
      case 'Bueno':
        return 'bg-green-100 text-green-700';
      case 'Regular':
        return 'bg-yellow-100 text-yellow-700';
      case 'Malo':
        return 'bg-red-100 text-red-700';
      case 'N/A':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 mb-4 text-sm font-medium ${
                isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <ArrowLeft size={18} />
              Volver
            </button>
            <div className={`text-xs font-semibold mb-2 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>
              MÓDULO DE AUDITORÍA
            </div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Detalle de Auditoría
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              ID: {auditoria.id}
            </p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            <Download size={18} />
            Exportar Reporte
          </button>
        </div>

        {/* Tarjetas de información */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Fecha */}
          <div className={`rounded-lg p-4 border ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Fecha
            </p>
            <div className="flex items-center gap-2">
              <Calendar size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {auditoria.fecha}
              </p>
            </div>
          </div>

          {/* Auditor Responsable */}
          <div className={`rounded-lg p-4 border ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Auditor Responsable
            </p>
            <div className="flex items-center gap-2">
              <User size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {auditoria.auditor}
              </p>
            </div>
          </div>

          {/* Ubicación */}
          <div className={`rounded-lg p-4 border ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Ubicación
            </p>
            <div className="flex items-center gap-2">
              <MapPin size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {auditoria.ubicacion}
              </p>
            </div>
          </div>

          {/* Estado General */}
          <div className={`rounded-lg p-4 border ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Estado General
            </p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <p className={`text-lg font-bold ${getEstadoColor(auditoria.estado)}`}>
                {auditoria.estado}
              </p>
            </div>
          </div>
        </div>

        {/* Tabla de Activos Verificados */}
        <div className={`rounded-lg border overflow-hidden transition ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <div className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
          }`}>
            <h2 className={`text-lg font-bold flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              Activos Verificados
            </h2>
            <span className="text-blue-600 font-semibold text-sm">
              {auditoria.activos.length} Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    ID Activo
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Nombre del Activo
                  </th>
                  <th className={`px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Hallado
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Estado Físico
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Observaciones
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
                {auditoria.activos.map((activo) => (
                  <tr key={activo.id} className={`transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <span className="text-blue-600 font-semibold text-sm hover:text-blue-700 cursor-pointer">
                        {activo.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {activo.nombre}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Categoría: {activo.categoria}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {activo.hallado ? (
                        <CheckCircle size={20} className="text-green-500 mx-auto" />
                      ) : (
                        <XCircle size={20} className="text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        getEstadoFisicoColor(activo.estadoFisico)
                      }`}>
                        {activo.estadoFisico}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {activo.observaciones}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer con estadísticas */}
          <div className={`px-6 py-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Última sincronización: {auditoria.ultimaSincronizacion}
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {auditoria.localizados} Localizados
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {auditoria.faltantes} Faltantes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesAuditoria;
