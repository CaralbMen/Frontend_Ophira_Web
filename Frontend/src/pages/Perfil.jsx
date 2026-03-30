import { useTheme } from '../context/ThemeContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, Briefcase, Shield, Edit } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { getToken } from '../services/authStorage';

const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload?.id ? String(payload.id) : null;
  } catch {
    return null;
  }
};

const Perfil = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarUsuarios = async () => {
      setLoading(true);
      setError('');

      try {
        const [usuariosResponse, rolesResponse] = await Promise.all([
          api.get('usuarios'),
          api.get('roles')
        ]);

        setUsuarios(Array.isArray(usuariosResponse) ? usuariosResponse : []);
        setRoles(Array.isArray(rolesResponse) ? rolesResponse : []);
      } catch (e) {
        setError('No se pudo cargar la información del perfil.');
        setUsuarios([]);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarios();
  }, []);

  const usuario = useMemo(() => {
    const idObjetivo = id || getUserIdFromToken();
    const registro = idObjetivo
      ? usuarios.find((u) => String(u.id_usuario) === String(idObjetivo))
      : usuarios[0];

    if (!registro) return null;

    const nombreCompleto = [registro.nombre_usuario, registro.apellido_paterno, registro.apellido_materno]
      .filter(Boolean)
      .join(' ')
      .trim();

    const iniciales = [registro.nombre_usuario?.[0], registro.apellido_paterno?.[0]]
      .filter(Boolean)
      .join('')
      .toUpperCase();

    return {
      id: String(registro.id_usuario),
      nombre_completo: nombreCompleto || `Usuario #${registro.id_usuario}`,
      correo_usuario: registro.correo || '-',
      telefono_usuario: registro.telefono || '-',
      fecha_registro_usuario: registro.fecha_registro,
      rol: registro.rol || 'Sin rol',
      descripcion_rol:
        roles.find((r) => String(r.nombre).toLowerCase() === String(registro.rol || '').toLowerCase())?.descripcion ||
        'Sin descripción de rol disponible.',
      puesto: registro.puesto || 'Sin puesto',
      estado: registro.activo ? 'Activo' : 'Inactivo',
      avatar: iniciales || 'US',
      colorAvatar: 'bg-gradient-to-br from-blue-500 to-cyan-600'
    };
  }, [usuarios, roles, id]);

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    const date = new Date(fecha);
    if (Number.isNaN(date.getTime())) return '-';
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
      {loading && (
        <div className={`rounded-lg border p-4 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}>
          Cargando perfil...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && !usuario && (
        <div className={`rounded-lg border p-4 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}>
          No hay información de usuario para mostrar.
        </div>
      )}

      {!loading && !error && usuario && (
      <>
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
                {usuarios.filter((u) => u.id_usuario === Number(usuario.id)).length > 0 ? 1 : 0}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Activos revisados
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {usuarios.length}
              </p>
            </div>
          </div>
        </div>

        {/* Descripción del rol */}
        <div className={`rounded-lg border p-6 transition ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Descripción del Rol
          </h3>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {usuario.descripcion_rol}
          </p>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default Perfil;
