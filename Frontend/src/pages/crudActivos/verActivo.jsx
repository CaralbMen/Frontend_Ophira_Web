import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Save, Trash2, Plus, X } from 'lucide-react';

const VerActivo = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const modo = location.state?.modo || (id ? 'editar' : 'crear');
  const activoExistente = location.state?.activo;

  const [formData, setFormData] = useState({
    nombre_activo: '',
    marca_activo: '',
    Modelo_activo: '',
    descripcion_activo: '',
    precio_original: '',
    valor_residual: '',
    vida_util: '',
    fecha_compra_activo: '',
    FK_id_responsable_activo: '',
    FK_id_categoria: '',
    FK_id_estado: '',
    FK_id_aula: '',
    multiparte: false
  });

  const [partes, setPartes] = useState([
    { id: 1, nombre_parte: '', FK_id_aula_parte: '' }
  ]);

  useEffect(() => {
    if (activoExistente) {
      setFormData({
        nombre_activo: activoExistente.nombre_activo || '',
        marca_activo: activoExistente.marca_activo || '',
        Modelo_activo: activoExistente.Modelo_activo || '',
        descripcion_activo: activoExistente.descripcion_activo || '',
        precio_original: activoExistente.precio_original || '',
        valor_residual: activoExistente.valor_residual || '',
        vida_util: activoExistente.vida_util || '',
        fecha_compra_activo: activoExistente.fecha_compra_activo || '',
        FK_id_responsable_activo: activoExistente.FK_id_responsable_activo || '',
        FK_id_categoria: activoExistente.FK_id_categoria || '',
        FK_id_estado: activoExistente.FK_id_estado || '',
        FK_id_aula: activoExistente.FK_id_aula || '',
        multiparte: activoExistente.multiparte || false
      });
      
      if (activoExistente.partes && activoExistente.partes.length > 0) {
        setPartes(activoExistente.partes);
      }
    } else if (id && modo !== 'crear') {
      // fetchActivo(id).then(data => setFormData(data));
    }
  }, [id, activoExistente, modo]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modo === 'crear') {
      console.log('Crear activo:', formData);
      if (formData.multiparte) {
        console.log('Partes:', partes);
      }
    } else if (modo === 'editar') {
      console.log('Actualizar activo:', formData);
      if (formData.multiparte) {
        console.log('Partes:', partes);
      }
    }
    
    navigate(-1);
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
                  name="nombre_activo"
                  value={formData.nombre_activo}
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
                  Marca
                </label>
                <input
                  type="text"
                  name="marca_activo"
                  value={formData.marca_activo}
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
                  Modelo
                </label>
                <input
                  type="text"
                  name="Modelo_activo"
                  value={formData.Modelo_activo}
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
                  Fecha de Compra
                </label>
                <input
                  type="date"
                  name="fecha_compra_activo"
                  value={formData.fecha_compra_activo}
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
                  Precio Original
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-2.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    name="precio_original"
                    value={formData.precio_original}
                    onChange={handleChange}
                    disabled={isReadOnly}
                    className={`w-full pl-8 pr-16 py-2 rounded-lg border ${
                      isDark 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-gray-300 text-slate-900'
                    } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                  <span className={`absolute right-3 top-2.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    USD
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
                  />
                  <span className={`absolute right-3 top-2.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    USD
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
                  name="vida_util"
                  value={formData.vida_util}
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
                  Categoría
                </label>
                <select
                  name="FK_id_categoria"
                  value={formData.FK_id_categoria}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required={!isReadOnly}
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="1">Computadoras & Laptops</option>
                  <option value="2">Muebles</option>
                  <option value="3">Vehículos</option>
                  <option value="4">Equipos</option>
                  <option value="5">Herramientas</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Responsable
                </label>
                <select
                  name="FK_id_responsable_activo"
                  value={formData.FK_id_responsable_activo}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option value="">Seleccionar responsable</option>
                  <option value="1">Usuario 1</option>
                  <option value="2">Usuario 2</option>
                  <option value="3">Usuario 3</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Estado
                </label>
                <select
                  name="FK_id_estado"
                  value={formData.FK_id_estado}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option value="">Seleccionar estado</option>
                  <option value="1">Activo</option>
                  <option value="2">En mantenimiento</option>
                  <option value="3">Inactivo</option>
                  <option value="4">Dado de baja</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Aula en que se ubica
                </label>
                <select
                  name="FK_id_aula"
                  value={formData.FK_id_aula}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option value="">Seleccionar aula</option>
                  <option value="1">Aula 101</option>
                  <option value="2">Aula 102</option>
                  <option value="3">Oficina Principal</option>
                  <option value="4">Sala de reuniones</option>
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
                                <option value="">Seleccionar ubicación</option>
                                <option value="1">Aula 101</option>
                                <option value="2">Aula 102</option>
                                <option value="3">Oficina Principal</option>
                                <option value="4">Sala de reuniones</option>
                                <option value="5">Almacén</option>
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
                  name="descripcion_activo"
                  value={formData.descripcion_activo}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  rows="3"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-slate-900'
                  } ${isReadOnly ? 'cursor-not-allowed opacity-60' : ''} focus:outline-none focus:ring-2 focus:ring-green-500 resize-none`}
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

export default VerActivo;
