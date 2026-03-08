import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Save, Trash2, Plus } from 'lucide-react';

const VerUsuario = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const modo = location.state?.modo || (id ? 'editar' : 'crear');
  const usuarioExistente = location.state?.usuario;

  const [formData, setFormData] = useState({
    nombre_usuario: '',
    apaterno_usuario: '',
    amaterno_usuario: '',
    correo_usuario: '',
    pwd_usuario: '',
    telefono_usuario: '',
    fecha_registro_usuario: '',
    FK_id_rol: '',
    FK_id_puesto: '',
    activo_usuario: true
  });

  useEffect(() => {
    if (usuarioExistente) {
      setFormData({
        nombre_usuario: usuarioExistente.nombre_usuario || '',
        apaterno_usuario: usuarioExistente.apaterno_usuario || '',
        amaterno_usuario: usuarioExistente.amaterno_usuario || '',
        correo_usuario: usuarioExistente.correo_usuario || '',
        pwd_usuario: usuarioExistente.pwd_usuario || '',
        telefono_usuario: usuarioExistente.telefono_usuario || '',
        fecha_registro_usuario: usuarioExistente.fecha_registro_usuario || '',
        FK_id_rol: usuarioExistente.FK_id_rol || '',
        FK_id_puesto: usuarioExistente.FK_id_puesto || '',
        activo_usuario: usuarioExistente.activo_usuario ?? usuarioExistente.estado === 'Activo'
      });
    } else if (id && modo !== 'crear') {
      // fetchUsuario(id).then(data => setFormData(data));
    }
  }, [id, usuarioExistente, modo]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modo === 'crear') {
      console.log('Crear usuario:', formData);
    } else if (modo === 'editar') {
      console.log('Actualizar usuario:', formData);
    }
    
    navigate(-1);
  };

  const handleEliminar = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      console.log('Eliminar usuario con id:', id);
      navigate(-1);
    }
  };

  const isReadOnly = modo === 'eliminar';

  const getTitulo = () => {
    switch (modo) {
      case 'crear':
        return 'Nuevo Usuario';
      case 'editar':
        return 'Editar Usuario';
      case 'eliminar':
        return 'Eliminar Usuario';
      default:
        return 'Datos del Usuario';
    }
  };

  const getTextBoton = () => {
    switch (modo) {
      case 'crear':
        return 'Crear Usuario';
      case 'editar':
        return 'Guardar Cambios';
      case 'eliminar':
        return 'Eliminar Usuario';
      default:
        return 'Guardar';
    }
  };

  const getIconoBoton = () => {
    switch (modo) {
      case 'crear':
        return <Plus className="w-5 h-5" />;
      case 'editar':
        return <Save className="w-5 h-5" />;
      case 'eliminar':
        return <Trash2 className="w-5 h-5" />;
      default:
        return <Save className="w-5 h-5" />;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-lg ${
              isDark 
                ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-300' 
                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-800'
            }`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {getTitulo()}
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {modo === 'eliminar' 
                ? 'Al eliminar este usuario se eliminarán todos sus datos y registros'
                : 'Completa los datos del usuario:'
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`${
            isDark ? 'bg-slate-800' : 'bg-white'
          } rounded-lg shadow-sm p-6`}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre_usuario"
                  value={formData.nombre_usuario}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required={!isReadOnly}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Apellido Paterno
                </label>
                <input
                  type="text"
                  name="apaterno_usuario"
                  value={formData.apaterno_usuario}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required={!isReadOnly}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Apellido Materno
                </label>
                <input
                  type="text"
                  name="amaterno_usuario"
                  value={formData.amaterno_usuario}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="correo_usuario"
                  value={formData.correo_usuario}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required={!isReadOnly}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Contraseña
                </label>
                <input
                  type="password"
                  name="pwd_usuario"
                  value={formData.pwd_usuario}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required={!isReadOnly && modo === 'crear'}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono_usuario"
                  value={formData.telefono_usuario}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Fecha de Registro
                </label>
                <input
                  type="date"
                  name="fecha_registro_usuario"
                  value={formData.fecha_registro_usuario}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Rol
                </label>
                <select
                  name="FK_id_rol"
                  value={formData.FK_id_rol}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required={!isReadOnly}
                >
                  <option value="">Seleccionar rol</option>
                  <option value="1">Administrador</option>
                  <option value="2">Auditor</option>
                  <option value="3">Usuario</option>
                  <option value="4">Supervisor</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Puesto
                </label>
                <select
                  name="FK_id_puesto"
                  value={formData.FK_id_puesto}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required={!isReadOnly}
                >
                  <option value="">Seleccionar puesto</option>
                  <option value="1">Director</option>
                  <option value="2">Coordinador</option>
                  <option value="3">Técnico</option>
                  <option value="4">Asistente</option>
                  <option value="5">Consultor</option>
                </select>
              </div>

              {modo === 'editar' && (
                <div className="md:col-span-2">
                  <label
                    className={`inline-flex items-center gap-3 text-sm font-medium ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    } ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  >
                    <input
                      type="checkbox"
                      name="activo_usuario"
                      checked={Boolean(formData.activo_usuario)}
                      onChange={handleChange}
                      disabled={isReadOnly}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span>
                      Usuario {formData.activo_usuario ? 'Activo' : 'Inactivo'}
                    </span>
                  </label>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`px-6 py-2 rounded-lg ${
                  isDark
                    ? 'text-slate-300 hover:bg-slate-700'
                    : 'text-slate-600 hover:bg-gray-100'
                }`}
              >
                Cancelar
              </button>
              
              <button
                type={modo === 'eliminar' ? 'button' : 'submit'}
                onClick={modo === 'eliminar' ? handleEliminar : undefined}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium ${
                  modo === 'eliminar'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {getIconoBoton()}
                {getTextBoton()}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerUsuario;
