import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Save, Trash2, Plus, X } from 'lucide-react';
import { api } from '../../services/api';

const normalizarOpciones = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const idRaw =
        item?.id ??
        item?.id_categoria ??
        item?.id_metodo_depreciacion ??
        item?.id_estado_activo ??
        item?.FK_id_categoria ??
        item?.FK_id_estado;

      const nombreRaw =
        item?.nombre ??
        item?.descripcion ??
        item?.nombre_categoria ??
        item?.categoria ??
        item?.nombre_metodo ??
        item?.metodo ??
        item?.nombre_estado ??
        item?.estado;

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

  if (Array.isArray(response?.data?.aulas)) {
    return response.data.aulas;
  }

  if (Array.isArray(response?.aulas)) {
    return response.aulas;
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

const VerActivo = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const modo = location.state?.modo || (id ? 'editar' : 'crear');
  const activoExistente = location.state?.activo;

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    modelo: '',
    numero_serie: '',
    fecha_compra: '',
    precio_compra: '',
    valor_residual: '',
    vida_util_anios: '',
    id_metodo_depreciacion: '1',
    id_categoria: '',
    id_estado_activo: '',
    id_aula: '',
    multiparte: false
  });

  const [partes, setPartes] = useState([
    { id: 1, nombre_parte: '', FK_id_aula_parte: '' }
  ]);

  const [categorias, setCategorias] = useState([]);
  const [metodosDepreciacion, setMetodosDepreciacion] = useState([]);
  const [estadosActivo, setEstadosActivo] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // const enviarDatos= async()=>{
  //   console.log('Datos a enviar:', formData);
  // }
  useEffect(() => {
    if (activoExistente) {
      setFormData({
        nombre: activoExistente.nombre || activoExistente.nombre_activo || '',
        descripcion: activoExistente.descripcion || activoExistente.descripcion_activo || '',
        modelo: activoExistente.modelo || activoExistente.Modelo_activo || '',
        numero_serie: activoExistente.numero_serie || '',
        fecha_compra: activoExistente.fecha_compra || activoExistente.fecha_compra_activo || '',
        precio_compra: activoExistente.precio_compra || activoExistente.precio_original || '',
        valor_residual: activoExistente.valor_residual || '',
        vida_util_anios: activoExistente.vida_util_anios || activoExistente.vida_util || '',
        id_metodo_depreciacion: String(activoExistente.id_metodo_depreciacion || '1'),
        id_categoria: String(activoExistente.id_categoria || activoExistente.FK_id_categoria || ''),
        id_estado_activo: String(activoExistente.id_estado_activo || activoExistente.FK_id_estado || ''),
        id_aula: activoExistente.id_aula || activoExistente.FK_id_aula || '',
        multiparte: activoExistente.multiparte || false
      });
      
      if (activoExistente.partes && activoExistente.partes.length > 0) {
        setPartes(activoExistente.partes);
      }
    } else if (id && modo !== 'crear') {
      // fetchActivo(id).then(data => setFormData(data));
    }
  }, [id, activoExistente, modo]);

  useEffect(() => {
    const cargarCatalogos = async () => {
      setCargandoCatalogos(true);
      try {
        const [categoriasResponse, metodosResponse, estadosResponse, aulasResponse] = await Promise.all([
          api.get('categorias'),
          api.get('metodos-depreciacion'),
          api.get('estados-activo'),
          api.get('ubicacion/aulas')
        ]);

        setCategorias(normalizarOpciones(extraerItems(categoriasResponse)));
        setMetodosDepreciacion(normalizarOpciones(extraerItems(metodosResponse)));
        setEstadosActivo(normalizarOpciones(extraerItems(estadosResponse)));
        setAulas(normalizarAulas(extraerItems(aulasResponse)));
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
    setPartes(prev => [...prev, { id: nuevoId, nombre_parte: '', FK_id_aula_parte: '' }]);
  };

  const eliminarParte = (id) => {
    if (partes.length > 1) {
      setPartes(prev => prev.filter(parte => parte.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      modelo: formData.modelo,
      numero_serie: formData.numero_serie,
      fecha_compra: formData.fecha_compra,
      precio_compra: formData.precio_compra === '' ? null : Number(formData.precio_compra),
      valor_actual: formData.precio_actual === '' ? null : Number(formData.precio_actual),
      valor_residual: formData.valor_residual === '' ? null : Number(formData.valor_residual),
      vida_util_anios: formData.vida_util_anios === '' ? null : Number(formData.vida_util_anios),
      id_metodo_depreciacion: formData.id_metodo_depreciacion === '' ? null : Number(formData.id_metodo_depreciacion),
      id_categoria: formData.id_categoria,
      id_estado_activo: formData.id_estado_activo,
      id_aula: formData.id_aula
    };
    console.log('Payload a enviar:', payload);
    try {
      setGuardando(true);

      if (modo === 'crear') {
        await api.post('assets', payload);
        navigate(-1);
        return;
      }

      if (modo === 'editar') {
        console.log('Actualizar activo:', payload);
        if (formData.multiparte) {
          console.log('Partes:', partes);
        }
        navigate(-1);
        return;
      }

      if (modo === 'eliminar') {
        return;
      }
    } catch (error) {
      console.error('Error al guardar el activo:', error);
      window.alert('No se pudo guardar el activo. Intenta nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este activo?')) {
      console.log('Eliminar activo con id:', id);
      navigate(-1);
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
                    name="precio_actual"
                    value={formData.precio_actual}
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
                                Nombre de la Parte
                              </label>
                              <input
                                type="text"
                                value={parte.nombre_parte}
                                onChange={(e) => handleParteChange(parte.id, 'nombre_parte', e.target.value)}
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
                                Ubicación/Aula
                              </label>
                              <select
                                value={parte.FK_id_aula_parte}
                                onChange={(e) => handleParteChange(parte.id, 'FK_id_aula_parte', e.target.value)}
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
                disabled={guardando}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium ${
                  modo === 'eliminar'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } ${guardando ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {getIconoBoton()}
                {guardando ? 'Guardando...' : getTextBoton()}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerActivo;
