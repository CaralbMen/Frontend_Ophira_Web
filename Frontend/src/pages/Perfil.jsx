import { useTheme } from '../context/ThemeContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, Briefcase, Shield, Edit } from 'lucide-react';

const Perfil = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  // Usuario de ejemplo - en producción esto vendría de un contexto de autenticación o API
  const usuarioActual = {
    id: '1',
    nombre_usuario: 'Carlos',
    apaterno_usuario: 'Mendoza',
    amaterno_usuario: 'García',
    nombre_completo: 'Carlos Mendoza García',
    correo_usuario: 'carlos.mendoza@institution.com',
    telefono_usuario: '+34 912 345 678',
    fecha_registro_usuario: '2023-08-10',
    rol: 'Administrador',
    puesto: 'Director',
    estado: 'Activo',
    avatar: 'CM',
    colorAvatar: 'bg-gradient-to-br from-blue-400 to-blue-600'
  };

  // Si hay un id en la URL, buscar ese usuario (simulado)
  const usuarios = [
    {
      id: '1',
      nombre_usuario: 'Carlos',
      apaterno_usuario: 'Mendoza',
      amaterno_usuario: 'García',
      nombre_completo: 'Carlos Mendoza García',
      correo_usuario: 'carlos.mendoza@institution.com',
      telefono_usuario: '+34 912 345 678',
      fecha_registro_usuario: '2023-08-10',
      rol: 'Administrador',
      puesto: 'Director',
      estado: 'Activo',
      avatar: 'CM',
      colorAvatar: 'bg-gradient-to-br from-blue-400 to-blue-600'
    },
    {
      id: '2',
      nombre_usuario: 'Daniyel',
      apaterno_usuario: 'Paulín',
      amaterno_usuario: 'López',
      nombre_completo: 'Daniyel Paulín López',
      correo_usuario: 'daniyel.paulin@gmail.com',
      telefono_usuario: '+34 912 345 679',
      fecha_registro_usuario: '2023-09-15',
      rol: 'Auditor',
      puesto: 'Coordinador',
      estado: 'Activo',
      avatar: 'DP',
      colorAvatar: 'bg-gradient-to-br from-purple-400 to-purple-600'
    },
    {
      id: '3',
      nombre_usuario: 'María',
      apaterno_usuario: 'Rodríguez',
      amaterno_usuario: 'Fernández',
      nombre_completo: 'María Rodríguez Fernández',
      correo_usuario: 'maria.rodriguez@gmail.com',
      telefono_usuario: '+34 912 345 680',
      fecha_registro_usuario: '2023-10-01',
      rol: 'Usuario',
      puesto: 'Técnico',
      estado: 'Activo',
      avatar: 'MR',
      colorAvatar: 'bg-gradient-to-br from-green-400 to-green-600'
    }
  ];

  const usuario = id ? usuarios.find(u => u.id === id) || usuarioActual : usuarioActual;

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getEstadoBadge = (estado) => {
    if (estado === 'Activo') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          Activo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        Inactivo
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {id && (
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg transition ${
                isDark 
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-300' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-gray-800'
              }`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              Perfil de Usuario
            </h1>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Información personal y configuración de cuenta
            </p>
          </div>
        </div>
        {!id && (
          <button
            onClick={() => navigate(`/usuarios/editar/${usuario.id}`)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            <Edit size={16} />
            Editar Perfil
          </button>
        )}
      </div>

      {/* Tarjeta Principal */}
      <div className={`rounded-lg border overflow-hidden transition ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        {/* Banner Superior */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
        
        {/* Información del Usuario */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 mb-6">
            <div className={`w-32 h-32 rounded-full ${usuario.colorAvatar} flex items-center justify-center text-white text-4xl font-bold border-4 ${
              isDark ? 'border-slate-800' : 'border-white'
            } shadow-lg`}>
              {usuario.avatar}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {usuario.nombre_completo}
                </h2>
                {getEstadoBadge(usuario.estado)}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Shield size={16} />
                  {usuario.rol}
                </span>
                <span className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Briefcase size={16} />
                  {usuario.puesto}
                </span>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-600' : 'bg-white'}`}>
                  <Mail size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Correo Electrónico
                  </p>
                  <p className={`text-sm font-medium truncate ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {usuario.correo_usuario}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-600' : 'bg-white'}`}>
                  <Phone size={20} className={isDark ? 'text-green-400' : 'text-green-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Teléfono
                  </p>
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {usuario.telefono_usuario}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-600' : 'bg-white'}`}>
                  <Calendar size={20} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Fecha de Registro
                  </p>
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {formatearFecha(usuario.fecha_registro_usuario)}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-600' : 'bg-white'}`}>
                  <Shield size={20} className={isDark ? 'text-orange-400' : 'text-orange-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    ID de Usuario
                  </p>
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    #{usuario.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estadísticas (placeholder) */}
        <div className={`rounded-lg border p-6 transition ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Auditorías completadas
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                12
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Activos revisados
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                156
              </p>
            </div>
          </div>
        </div>

        {/* Permisos */}
        <div className={`rounded-lg border p-6 transition ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Permisos y Accesos
          </h3>
          <div className="space-y-2">
            {usuario.rol === 'Administrador' && (
              <>
                <PermisoItem isDark={isDark} permiso="Gestión completa de usuarios" activo={true} />
                <PermisoItem isDark={isDark} permiso="Configuración del sistema" activo={true} />
                <PermisoItem isDark={isDark} permiso="Generación de reportes" activo={true} />
                <PermisoItem isDark={isDark} permiso="Gestión de auditorías" activo={true} />
              </>
            )}
            {usuario.rol === 'Auditor' && (
              <>
                <PermisoItem isDark={isDark} permiso="Realizar auditorías" activo={true} />
                <PermisoItem isDark={isDark} permiso="Generación de reportes" activo={true} />
                <PermisoItem isDark={isDark} permiso="Consultar activos" activo={true} />
                <PermisoItem isDark={isDark} permiso="Gestión de usuarios" activo={false} />
              </>
            )}
            {usuario.rol === 'Usuario' && (
              <>
                <PermisoItem isDark={isDark} permiso="Consultar activos" activo={true} />
                <PermisoItem isDark={isDark} permiso="Escanear QR" activo={true} />
                <PermisoItem isDark={isDark} permiso="Realizar auditorías" activo={false} />
                <PermisoItem isDark={isDark} permiso="Gestión de usuarios" activo={false} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PermisoItem = ({ isDark, permiso, activo }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${activo ? 'bg-green-500' : 'bg-slate-400'}`}></div>
    <span className={`text-sm ${
      isDark 
        ? activo ? 'text-slate-300' : 'text-slate-500' 
        : activo ? 'text-slate-700' : 'text-slate-400'
    }`}>
      {permiso}
    </span>
  </div>
);

export default Perfil;
