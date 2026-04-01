import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Save, Trash2, Plus, X } from 'lucide-react';
import { api } from '../../services/api';
import QRCodeComponent from '../../components/QRCode';

const normalizarOpciones = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const idRaw =
        item?.id ??
        item?.id_usuario ??
        item?.id_categoria ??
        item?.id_metodo_depreciacion ??
        item?.id_estado_activo ??
        item?.FK_id_categoria ??
        item?.FK_id_estado ??
        item?.FK_id_usuario;

      const nombreRaw =
        item?.nombre ??
        item?.nombre_usuario ??
        item?.nombre_completo ??
        item?.descripcion ??
        item?.nombre_categoria ??
        item?.categoria ??
        item?.nombre_metodo ??
        item?.metodo ??
        item?.nombre_estado ??
        item?.estado ??
        [item?.nombre_usuario, item?.apaterno_usuario, item?.amaterno_usuario]
          .filter(Boolean)
          .join(' ');

      if (idRaw === undefined || idRaw === null || !nombreRaw) {
        return null;
      }

      return {
        id: String(idRaw),
        nombre: String(nombreRaw)
      };
    })
    .filter(Boolean);
};

const extraerItems = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data?.usuarios)) {
    return response.data.usuarios;
  }

  if (Array.isArray(response?.data?.aulas)) {
    return response.data.aulas;
  }

  if (Array.isArray(response?.usuarios)) {
    return response.usuarios;
  }

  if (Array.isArray(response?.aulas)) {
    return response.aulas;
  }

  if (Array.isArray(response?.data?.users)) {
    return response.data.users;
  }

  if (Array.isArray(response?.users)) {
    return response.users;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.result)) {
    return response.result;
  }

  return [];
};

const normalizarAulas = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const idRaw =
        item?.id_aula ??
        item?.id ??
        item?.aula ??
        item?.codigo_aula ??
        item?.codigo;

      const nombreRaw = idRaw;

      if (idRaw === undefined || idRaw === null || !nombreRaw) {
        return null;
      }

      return {
        id: String(idRaw),
        id_aula: String(idRaw),
        nombre: String(nombreRaw)
      };
    })
    .filter(Boolean);
};

const formatearFechaInput = (fecha) => {
  if (!fecha) return '';
  if (typeof fecha === 'string' && fecha.includes('T')) {
    return fecha.split('T')[0];
  }
  return String(fecha);
};

const mapActivoToFormData = (activo = {}) => ({
  nombre: activo.nombre || activo.nombre_activo || '',
  descripcion: activo.descripcion || activo.descripcion_activo || '',
  modelo: activo.modelo || activo.Modelo_activo || '',
  numero_serie: activo.numero_serie || activo.numeroSerie || '',
  fecha_compra: formatearFechaInput(activo.fecha_compra || activo.fecha_compra_activo || ''),
  precio_compra: activo.precio_compra ?? activo.precio_original ?? '',
  valor_actual: activo.valor_actual ?? activo.precio_actual ?? '',
  valor_residual: activo.valor_residual ?? '',
  vida_util_anios: activo.vida_util_anios ?? activo.vida_util ?? '',
  id_metodo_depreciacion: String(activo.id_metodo_depreciacion || activo.FK_id_metodo_depreciacion || '1'),
  id_categoria: String(activo.id_categoria || activo.FK_id_categoria || ''),
  id_estado_activo: String(activo.id_estado_activo || activo.FK_id_estado || ''),
  id_aula: String(activo.id_aula || activo.FK_id_aula || activo.aula || ''),
  id_responsable: String(activo.id_responsable || activo.FK_id_responsable || activo.FK_id_responsable_activo || ''),
  multiparte: Boolean(activo.multiparte || (Array.isArray(activo.partes) && activo.partes.length > 0))
});

const mapPartesToState = (partes = []) => {
  if (!Array.isArray(partes) || partes.length === 0) {
    return [{ id: 1, descripcion: '', id_aula: '' }];
  }

  return partes.map((parte, index) => ({
    id: parte.id_parte ?? parte.id ?? index + 1,
    descripcion: parte.descripcion ?? parte.nombre_parte ?? '',
    id_aula: String(parte.id_aula ?? parte.FK_id_aula_parte ?? '')
  }));
};

const extraerActivo = (response) => {
  if (!response) return null;

  if (Array.isArray(response)) {
    return response[0] ?? null;
  }

  if (Array.isArray(response?.data)) {
    return response.data[0] ?? null;
  }

  if (Array.isArray(response?.rows)) {
    return response.rows[0] ?? null;
  }

  if (response?.rows && typeof response.rows === 'object' && !Array.isArray(response.rows)) {
    return response.rows;
  }

  if (Array.isArray(response?.data?.rows)) {
    return response.data.rows[0] ?? null;
  }

  if (response?.data?.rows && typeof response.data.rows === 'object' && !Array.isArray(response.data.rows)) {
    return response.data.rows;
  }

  if (response?.data?.activo) {
    return response.data.activo;
  }

  if (response?.activo) {
    return response.activo;
  }

  if (response?.data && typeof response.data === 'object') {
    return response.data;
  }

  if (typeof response === 'object') {
    return response;
  }

  return null;
};

const VerActivo = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const modo = location.state?.modo || (id ? 'editar' : 'crear');
  const activoExistente = location.state?.activo;
  const idActivoEdicion = id || activoExistente?.id_activo || activoExistente?.id || null;

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    modelo: '',
    numero_serie: '',
    fecha_compra: '',
    precio_compra: '',
    valor_actual: '',
    valor_residual: '',
    vida_util_anios: '',
    id_metodo_depreciacion: '1',
    id_categoria: '',
    id_estado_activo: '',
    id_aula: '',
    id_responsable: '',
    multiparte: false
  });

  const [partes, setPartes] = useState([
    { id: 1, descripcion: '', id_aula: '' }
  ]);

  const [categorias, setCategorias] = useState([]);
  const [metodosDepreciacion, setMetodosDepreciacion] = useState([]);
  const [estadosActivo, setEstadosActivo] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [encargados, setEncargados] = useState([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(false);
  const [cargandoActivo, setCargandoActivo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mostrarModalQR, setMostrarModalQR] = useState(false);
  const [idActivoCreado, setIdActivoCreado] = useState(null);

  // const enviarDatos= async()=>{
  //   console.log('Datos a enviar:', formData);
  // }
  useEffect(() => {
    const cargarActivoPorId = async () => {
      if (!idActivoEdicion || modo === 'crear') {
        return;
      }

      setCargandoActivo(true);
      try {
        console.log('Cargando activo con ID:', idActivoEdicion);
        const response = await api.get(`assets/id/${idActivoEdicion}`);
        const activo = extraerActivo(response);
        console.log('Activo cargado:', activo);
        if (!activo) {
          window.alert('No fue posible obtener los datos del activo.');
          navigate(-1);
          return;
        }

        setFormData(mapActivoToFormData(activo));
        setPartes(mapPartesToState(activo.partes));
      } catch (error) {
        console.error('No fue posible cargar el activo para edición:', error);
        window.alert('No se pudo cargar el activo. Intenta nuevamente.');
        navigate(-1);
      } finally {
        setCargandoActivo(false);
      }
    };

    if (idActivoEdicion && modo !== 'crear') {
      cargarActivoPorId();
      return;
    }

    if (activoExistente) {
      setFormData(mapActivoToFormData(activoExistente));
      setPartes(mapPartesToState(activoExistente.partes));
    }
  }, [idActivoEdicion, activoExistente, modo, navigate]);

  useEffect(() => {
    const cargarCatalogos = async () => {
      setCargandoCatalogos(true);
      try {
        const [categoriasResponse, metodosResponse, estadosResponse, aulasResponse, encargadosResponse] = await Promise.all([
          api.get('categorias'),
          api.get('metodos-depreciacion'),
          api.get('estados-activo'),
          api.get('ubicacion/aulas'),
          api.get('usuarios')
        ]);

        setCategorias(normalizarOpciones(extraerItems(categoriasResponse)));
        setMetodosDepreciacion(normalizarOpciones(extraerItems(metodosResponse)));
        setEstadosActivo(normalizarOpciones(extraerItems(estadosResponse)));
        setAulas(normalizarAulas(extraerItems(aulasResponse)));
        setEncargados(encargadosResponse);
      } catch (error) {
        console.error('No fue posible cargar los catálogos del formulario de activos:', error);
      } finally {
        setCargandoCatalogos(false);
      }
    };

    cargarCatalogos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleParteChange = (id, field, value) => {
    setPartes(prev => prev.map(parte => 
      parte.id === id ? { ...parte, [field]: value } : parte
    ));
  };

  const agregarParte = () => {
    const nuevoId = partes.length > 0 ? Math.max(...partes.map(p => p.id)) + 1 : 1;
    setPartes(prev => [...prev, { id: nuevoId, descripcion: '', id_aula: '' }]);
  };

  const eliminarParte = (id) => {
    if (partes.length > 1) {
      setPartes(prev => prev.filter(parte => parte.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const partesPayload = formData.multiparte
      ? partes
          .filter((parte) => String(parte.id_aula || '').trim() !== '' && String(parte.descripcion || '').trim() !== '')
          .map((parte) => ({
            id_aula: String(parte.id_aula),
            descripcion: String(parte.descripcion || '').trim()
          }))
      : [];

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      modelo: formData.modelo,
      numero_serie: formData.numero_serie,
      fecha_compra: formData.fecha_compra,
      precio_compra: formData.precio_compra === '' ? null : Number(formData.precio_compra),
      valor_actual: formData.valor_actual === '' ? null : Number(formData.valor_actual),
      valor_residual: formData.valor_residual === '' ? null : Number(formData.valor_residual),
      vida_util_anios: formData.vida_util_anios === '' ? null : Number(formData.vida_util_anios),
      id_metodo_depreciacion: formData.id_metodo_depreciacion === '' ? null : Number(formData.id_metodo_depreciacion),
      id_categoria: formData.id_categoria === '' ? null : Number(formData.id_categoria),
      id_estado_activo: formData.id_estado_activo === '' ? null : Number(formData.id_estado_activo),
      id_aula: formData.id_aula === '' ? null : String(formData.id_aula),
      id_responsable: formData.id_responsable === '' ? null : Number(formData.id_responsable),
      multiparte: formData.multiparte
    };

    if (partesPayload.length > 0) {
      payload.partes = partesPayload;
    }
    console.log('Payload a enviar:', payload);
    try {
      setGuardando(true);

      if (modo === 'crear') {
        const respuesta = await api.post('assets', payload);
        const nuevoId = respuesta?.id_activo || respuesta?.id || respuesta?.data?.id_activo;
        if (nuevoId) {
          setIdActivoCreado(nuevoId);
          setMostrarModalQR(true);
        } else {
          navigate('/activos', { replace: true, state: { refreshActivos: Date.now() } });
        }
        return;
      }

      if (modo === 'editar') {
        if (!idActivoEdicion) {
          window.alert('No se pudo identificar el activo a editar.');
          return;
        }

        await api.put(`assets/${idActivoEdicion}`, payload);
        if (formData.multiparte) {
          console.log('Partes a actualizar:', partes);
        }
        navigate('/activos', { replace: true, state: { refreshActivos: Date.now() } });
        return;
      }

      if (modo === 'eliminar') {
        return;
      }
    } catch (error) {
      console.error('Error al guardar el activo:', error);
      window.alert(error?.message || 'No se pudo guardar el activo. Intenta nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este activo?')) {
      try {
        setGuardando(true);
        await api.delete(`assets/${id}`);
        navigate('/activos', { replace: true, state: { refreshActivos: Date.now() } });
      } catch (error) {
        console.error('Error al eliminar el activo:', error);
        window.alert(error?.message || 'No se pudo eliminar el activo. Intenta nuevamente.');
      } finally {
        setGuardando(false);
      }
    }
  };

  const isReadOnly = modo === 'eliminar';

  const getTitulo = () => {
    switch (modo) {
      case 'crear':
        return 'Datos del Activo';
      case 'editar':
        return 'Datos del Activo';
      case 'eliminar':
        return 'Datos del Activo';
      default:
        return 'Datos del Activo';
    }
  };

  const getTextBoton = () => {
    switch (modo) {
      case 'crear':
        return 'Crear';
      case 'editar':
        return 'Guardar Activo';
      case 'eliminar':
        return 'Eliminar Activo';
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
                ? 'Al eliminar este activo se eliminarán todos su datos de los escáneres'
                : 'Añade la información del Activo fixo:'
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`${
            isDark ? 'bg-slate-800' : 'bg-white'
          } rounded-lg shadow-sm p-6`}>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Nombre del Activo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
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
                  Número de Serie
                </label>
                <input
                  type="text"
                  name="numero_serie"
                  value={formData.numero_serie}
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
                  Modelo
                </label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
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
                  Fecha de Compra
                </label>
                <input
                  type="date"
                  name="fecha_compra"
                  value={formData.fecha_compra}
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
                  Precio de Compra
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-2.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    name="precio_compra"
                    value={formData.precio_compra}
                    onChange={handleChange}
                    disabled={isReadOnly}
                    className={`w-full pl-8 pr-16 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-gray-300 text-slate-900'
                    } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required={!isReadOnly}
                  />
                  <span className={`absolute right-3 top-2.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    MXN
                  </span>
                </div>
              </div>

               <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Valor Actual
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-2.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    name="valor_actual"
                    value={formData.valor_actual}
                    onChange={handleChange}
                    disabled={isReadOnly}
                    className={`w-full pl-8 pr-16 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-gray-300 text-slate-900'
                    } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required={!isReadOnly}
                  />
                  <span className={`absolute right-3 top-2.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    MXN
                  </span>
                </div>
              </div>


              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Valor Residual
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-2.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    name="valor_residual"
                    value={formData.valor_residual}
                    onChange={handleChange}
                    disabled={isReadOnly}
                    className={`w-full pl-8 pr-16 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-gray-300 text-slate-900'
                    } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required={!isReadOnly}
                  />
                  <span className={`absolute right-3 top-2.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    MXN
                  </span>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Vida Útil (años)
                </label>
                <input
                  type="number"
                  name="vida_util_anios"
                  value={formData.vida_util_anios}
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
                  Categoría
                </label>
                <select
                  name="id_categoria"
                  value={formData.id_categoria}
                  onChange={handleChange}
                  disabled={isReadOnly || cargandoCatalogos}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required={!isReadOnly}
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Método de Depreciación
                </label>
                <select
                  name="id_metodo_depreciacion"
                  value={formData.id_metodo_depreciacion}
                  onChange={handleChange}
                  disabled={isReadOnly || cargandoCatalogos}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required={!isReadOnly}
                >
                  <option value="">Seleccionar método</option>
                  {metodosDepreciacion.map((metodo) => (
                    <option key={metodo.id} value={metodo.id}>
                      {metodo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              
              <div className="flex items-center gap-3 md:col-span-2">
                <input
                  type="checkbox"
                  id="multiparte"
                  name="multiparte"
                  checked={formData.multiparte}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-5 h-5 rounded border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-green-600' 
                      : 'bg-white border-gray-300 text-green-600'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:ring-2 focus:ring-green-500`}
                />
                <label 
                  htmlFor="multiparte"
                  className={`text-sm font-medium ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Este activo es multiparte (contiene múltiples componentes)
                </label>
              </div>

              {formData.multiparte && (
                <div className="md:col-span-2">
                  <div className={`${
                    isDark ? 'bg-slate-700/50' : 'bg-gray-50'
                  } rounded-lg p-4 space-y-4`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-lg font-semibold ${
                        isDark ? 'text-white' : 'text-slate-800'
                      }`}>
                        Partes del Activo
                      </h3>
                      <span className={`text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {partes.length} parte{partes.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {partes.map((parte, index) => (
                        <div 
                          key={parte.id}
                          className={`${
                            isDark ? 'bg-slate-800' : 'bg-white'
                          } rounded-lg p-4 border ${
                            isDark ? 'border-slate-600' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-sm font-medium ${
                              isDark ? 'text-slate-300' : 'text-slate-700'
                            }`}>
                              Parte {index + 1}
                            </span>
                            {partes.length > 1 && !isReadOnly && (
                              <button
                                type="button"
                                onClick={() => eliminarParte(parte.id)}
                                className={`p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600`}
                                title="Eliminar parte"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className={`block text-sm font-medium mb-1 ${
                                isDark ? 'text-slate-300' : 'text-slate-700'
                              }`}>
                                Descripción de la Parte
                              </label>
                              <input
                                type="text"
                                value={parte.descripcion}
                                onChange={(e) => handleParteChange(parte.id, 'descripcion', e.target.value)}
                                disabled={isReadOnly}
                                className={`w-full px-3 py-2 rounded-lg border ${
                                  isDark 
                                    ? 'bg-slate-700 border-slate-600 text-white' 
                                    : 'bg-white border-gray-300 text-slate-900'
                                } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                              />
                            </div>

                            <div>
                              <label className={`block text-sm font-medium mb-1 ${
                                isDark ? 'text-slate-300' : 'text-slate-700'
                              }`}>
                                Ubicación
                              </label>
                              <select
                                value={parte.id_aula}
                                onChange={(e) => handleParteChange(parte.id, 'id_aula', e.target.value)}
                                disabled={isReadOnly}
                                className={`w-full px-3 py-2 rounded-lg border ${
                                  isDark 
                                    ? 'bg-slate-700 border-slate-600 text-white' 
                                    : 'bg-white border-gray-300 text-slate-900'
                                } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                              >
                                <option value="">Seleccionar aula</option>
                                {aulas.map((aula) => (
                                  <option key={aula.id} value={aula.id}>
                                    {aula.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={agregarParte}
                        className={`w-full py-2 rounded-lg border-2 border-dashed ${
                          isDark 
                            ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500' 
                            : 'border-gray-300 text-slate-600 hover:bg-gray-50 hover:border-gray-400'
                        } flex items-center justify-center gap-2 font-medium transition-colors`}
                      >
                        <Plus className="w-5 h-5" />
                        Agregar otra parte
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  rows="3"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500 resize-none`}
                  required={!isReadOnly}
                />
              </div>
            </div>
              </div>

              <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-6 self-start">
                {id && (
                  <QRCodeComponent 
                    value={id}
                    size={180}
                    title={`ID Activo: ${id}`}
                    showDownload={true}
                  />
                )}

                <div className={`${
                  isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-gray-200'
                } rounded-lg border p-4 space-y-4`}>
                  <h3 className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Ubicación y Control
                  </h3>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Estado
                    </label>
                    <select
                      name="id_estado_activo"
                      value={formData.id_estado_activo}
                      onChange={handleChange}
                      disabled={isReadOnly || cargandoCatalogos}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-white border-gray-300 text-slate-900'
                      } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                      required={!isReadOnly}
                    >
                      <option value="">Seleccionar estado</option>
                      {estadosActivo.map((estado) => (
                        <option key={estado.id} value={estado.id}>
                          {estado.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Aula en que se ubica
                    </label>
                    <select
                      name="id_aula"
                      value={formData.id_aula}
                      onChange={handleChange}
                      disabled={isReadOnly || cargandoCatalogos}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-white border-gray-300 text-slate-900'
                      } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                      required={!isReadOnly}
                    >
                      <option value="">Seleccionar aula</option>
                      {aulas.map((aula) => (
                        <option key={aula.id} value={aula.id}>
                          {aula.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Responsable
                    </label>
                    <select
                      name="id_responsable"
                      value={formData.id_responsable}
                      onChange={handleChange}
                      disabled={isReadOnly || cargandoCatalogos}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-white border-gray-300 text-slate-900'
                      } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                      required={!isReadOnly}
                    >
                      <option value="">Seleccionar responsable</option>
                      {encargados.map((encargado) => (
                        <option key={encargado.id_usuario} value={encargado.id_usuario}>
                          {encargado.nombre_usuario} - {encargado.puesto} de {encargado.area}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
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
                disabled={guardando || cargandoActivo}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium ${
                  modo === 'eliminar'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } ${(guardando || cargandoActivo) ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {getIconoBoton()}
                {guardando ? 'Guardando...' : cargandoActivo ? 'Cargando activo...' : getTextBoton()}
              </button>
            </div>
          </div>
        </form>
      </div>

      {mostrarModalQR && idActivoCreado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${
            isDark ? 'bg-slate-800' : 'bg-white'
          } rounded-lg shadow-lg p-8 max-w-sm w-full`}>
            <h2 className={`text-2xl font-bold mb-4 text-center ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}>
              ¡Activo Creado!
            </h2>
            
            <p className={`text-center mb-6 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Tu activo ha sido creado exitosamente. Aquí está su código QR:
            </p>

            <div className="flex justify-center mb-6">
              <QRCodeComponent 
                value={String(idActivoCreado)}
                size={200}
                title={`ID: ${idActivoCreado}`}
                showDownload={true}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                  isDark
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
                }`}
              >
                Volver
              </button>
              <button
                onClick={() => {
                  setMostrarModalQR(false);
                  navigate('/activos', { state: { refreshActivos: Date.now() } });
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Ir al Inventario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerActivo;
