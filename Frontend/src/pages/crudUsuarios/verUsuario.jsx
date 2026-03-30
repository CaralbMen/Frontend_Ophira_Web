import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Save, Trash2, Plus } from 'lucide-react';

import {api} from '../../services/api';

const formatearFecha = (fecha) => {
  if (!fecha) return '';

  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return String(fecha);

  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
};

const mapUsuarioToForm = (usuario = {}) => ({
  nombre_usuario: usuario.nombre_usuario || '',
  apaterno_usuario: usuario.apellido_paterno || usuario.apaterno_usuario || '',
  amaterno_usuario: usuario.apellido_materno || usuario.amaterno_usuario || '',
  correo_usuario: usuario.correo || usuario.correo_usuario || '',
  pwd_usuario: usuario.pwd_usuario || '',
  telefono_usuario: usuario.telefono || usuario.telefono_usuario || '',
  fecha_registro_usuario: usuario.fecha_registro || usuario.fecha_registro_usuario || '',
  FK_id_rol: usuario.id_rol || usuario.FK_id_rol || '',
  FK_id_puesto: usuario.id_puesto || usuario.FK_id_puesto || '',
  activo_usuario: usuario.activo_usuario ?? usuario.activo ?? usuario.estado === 'Activo'
});

const VerUsuario = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [roles, setRoles] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [catalogoStatus, setCatalogoStatus] = useState({ type: '', message: '' });
  const [quickFormOpen, setQuickFormOpen] = useState('');
  const modo = location.state?.modo || (id ? 'editar' : 'crear');
  const usuarioExistente = location.state?.usuario;
  const [nuevoRol, setNuevoRol] = useState({ nombre: '', descripcion: '' });
  const [nuevoPuesto, setNuevoPuesto] = useState({ nombre: '', id_area: '' });
  const [nuevaArea, setNuevaArea] = useState({ nombre: '' });

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
  const cargarCatalogos = async () => {
    try {
      const [rolesData, puestosData, areasData] = await Promise.all([
        api.get('roles'),
        api.get('puestos'),
        api.get('areas')
      ]);

      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setPuestos(Array.isArray(puestosData) ? puestosData : []);
      setAreas(Array.isArray(areasData) ? areasData : []);
    } catch (error) {
      console.error('Error al cargar catalogos:', error);
      setCatalogoStatus({ type: 'error', message: `No se pudieron cargar catalogos: ${error.message}` });
    }
  };

  useEffect(() => {
    cargarCatalogos();
  }, []);


  useEffect(() => {
    const cargarUsuario = async () => {
      if (id) {
        try {
          const usuarioResponse = await api.get(`usuarios/${id}`);
          setFormData(mapUsuarioToForm(usuarioResponse));
          return;
        } catch (error) {
          console.error('Error al cargar usuario por id:', error);
        }
      }

      if (usuarioExistente) {
        setFormData(mapUsuarioToForm(usuarioExistente));
      }
    };

    if (modo !== 'crear') {
      cargarUsuario();
    }
  }, [id, usuarioExistente, modo]);

  const crearRol = async () => {
    if (!nuevoRol.nombre.trim() || !nuevoRol.descripcion.trim()) {
      setCatalogoStatus({ type: 'error', message: 'Para crear rol, captura nombre y descripcion.' });
      return;
    }

    try {
      await api.post('roles', {
        nombre: nuevoRol.nombre.trim(),
        descripcion: nuevoRol.descripcion.trim()
      });
      setNuevoRol({ nombre: '', descripcion: '' });
      setCatalogoStatus({ type: 'success', message: 'Rol creado correctamente.' });
      await cargarCatalogos();
    } catch (error) {
      setCatalogoStatus({ type: 'error', message: `Error al crear rol: ${error.message}` });
    }
  };

  const crearArea = async () => {
    if (!nuevaArea.nombre.trim()) {
      setCatalogoStatus({ type: 'error', message: 'Para crear area, captura un nombre.' });
      return;
    }

    try {
      await api.post('areas', { nombre: nuevaArea.nombre.trim() });
      setNuevaArea({ nombre: '' });
      setCatalogoStatus({ type: 'success', message: 'Area creada correctamente.' });
      await cargarCatalogos();
    } catch (error) {
      setCatalogoStatus({ type: 'error', message: `Error al crear area: ${error.message}` });
    }
  };

  const crearPuesto = async () => {
    if (!nuevoPuesto.nombre.trim() || !nuevoPuesto.id_area) {
      setCatalogoStatus({ type: 'error', message: 'Para crear puesto, captura nombre y area.' });
      return;
    }

    try {
      await api.post('puestos', {
        nombre: nuevoPuesto.nombre.trim(),
        id_area: Number(nuevoPuesto.id_area)
      });
      setNuevoPuesto({ nombre: '', id_area: '' });
      setCatalogoStatus({ type: 'success', message: 'Puesto creado correctamente.' });
      await cargarCatalogos();
    } catch (error) {
      setCatalogoStatus({ type: 'error', message: `Error al crear puesto: ${error.message}` });
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (modo === 'crear') {
      console.log('Crear usuario:', formData);
      navigate(-1);
    } else if (modo === 'editar') {
      const usuarioId = id || usuarioExistente?.id_usuario;

      if (!usuarioId) {
        console.error('No se encontro id para actualizar usuario');
        return;
      }

      const payload = {
        nombre_usuario: formData.nombre_usuario.trim(),
        apellido_paterno: formData.apaterno_usuario.trim(),
        apellido_materno: formData.amaterno_usuario.trim(),
        correo: formData.correo_usuario.trim(),
        telefono: formData.telefono_usuario.trim(),
        id_rol: formData.FK_id_rol,
        id_puesto: formData.FK_id_puesto,
        activo: Boolean(formData.activo_usuario),
      };

      try {
        await api.put(`usuarios/${usuarioId}`, payload);
        navigate(-1);
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
      }
    }
  };

  const handleEliminar = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      console.log('Eliminar usuario con id:', id);
      navigate(-1);
    }
  };

  const isReadOnly = modo === 'eliminar';
  const fechaRegistroFormateada = formatearFecha(formData.fecha_registro_usuario);

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

        <div className={`mb-6 ${
          isDark ? 'bg-slate-800' : 'bg-white'
        } rounded-lg shadow-sm p-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Catalogos Rapidos
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              onClick={() => setQuickFormOpen((prev) => (prev === 'rol' ? '' : 'rol'))}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                quickFormOpen === 'rol'
                  ? 'bg-green-600 text-white'
                  : isDark
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {quickFormOpen === 'rol' ? 'Ocultar rol' : 'Nuevo rol'}
            </button>

            <button
              type="button"
              onClick={() => setQuickFormOpen((prev) => (prev === 'area' ? '' : 'area'))}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                quickFormOpen === 'area'
                  ? 'bg-green-600 text-white'
                  : isDark
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {quickFormOpen === 'area' ? 'Ocultar area' : 'Nueva area'}
            </button>

            <button
              type="button"
              onClick={() => setQuickFormOpen((prev) => (prev === 'puesto' ? '' : 'puesto'))}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                quickFormOpen === 'puesto'
                  ? 'bg-green-600 text-white'
                  : isDark
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {quickFormOpen === 'puesto' ? 'Ocultar puesto' : 'Nuevo puesto'}
            </button>
          </div>

          {catalogoStatus.message && (
            <div className={`mb-4 rounded-lg border px-3 py-2 text-xs font-medium ${
              catalogoStatus.type === 'success'
                ? isDark
                  ? 'bg-green-950/40 border-green-800 text-green-300'
                  : 'bg-green-50 border-green-200 text-green-700'
                : isDark
                  ? 'bg-red-950/40 border-red-800 text-red-300'
                  : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {catalogoStatus.message}
            </div>
          )}

          {quickFormOpen === 'rol' && (
            <div className={`rounded-lg border p-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Nuevo rol</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nuevoRol.nombre}
                  onChange={(e) => setNuevoRol((prev) => ({ ...prev, nombre: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-slate-900'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                <input
                  type="text"
                  placeholder="Descripcion"
                  value={nuevoRol.descripcion}
                  onChange={(e) => setNuevoRol((prev) => ({ ...prev, descripcion: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-slate-900'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                <button
                  type="button"
                  onClick={crearRol}
                  className="w-full px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
                >
                  Crear rol
                </button>
              </div>
            </div>
          )}

          {quickFormOpen === 'area' && (
            <div className={`rounded-lg border p-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Nueva area</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nombre del area"
                  value={nuevaArea.nombre}
                  onChange={(e) => setNuevaArea({ nombre: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-slate-900'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                <button
                  type="button"
                  onClick={crearArea}
                  className="w-full px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
                >
                  Crear area
                </button>
              </div>
            </div>
          )}

          {quickFormOpen === 'puesto' && (
            <div className={`rounded-lg border p-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Nuevo puesto</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nombre del puesto"
                  value={nuevoPuesto.nombre}
                  onChange={(e) => setNuevoPuesto((prev) => ({ ...prev, nombre: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-slate-900'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                <select
                  value={nuevoPuesto.id_area}
                  onChange={(e) => setNuevoPuesto((prev) => ({ ...prev, id_area: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-slate-900'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option value="">Seleccionar area</option>
                  {areas.map((area) => (
                    <option key={area.id_area ?? area.id} value={area.id_area ?? area.id}>
                      {area.nombre}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={crearPuesto}
                  className="w-full px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
                >
                  Crear puesto
                </button>
              </div>
            </div>
          )}
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
                  type="text"
                  value={fechaRegistroFormateada}
                  disabled
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-slate-900'
                  } cursor-not-allowed opacity-80`}
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
                  {roles.map(rol => (
                    <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre}</option>
                  ))}
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
                  {puestos.map(puesto => (
                    <option key={puesto.id_puesto} value={puesto.id_puesto}>{puesto.nombre} - {puesto.nombre_area}</option>
                  ))}
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
