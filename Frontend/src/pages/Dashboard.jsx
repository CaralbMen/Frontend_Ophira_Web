import { Plus, ArrowUp, Wrench, TrendingUp, DollarSign, FileText, MapPin, Building2, Layers, DoorOpen, ChevronDown, X, MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

// Usamos la api para consumir el back
import {api} from '../services/api';

const colorEstadoTexto = {
  green: 'text-ophira-success',
  yellow: 'text-ophira-warning',
  red: 'text-ophira-danger',
  blue: 'text-ophira-primary'
};

const colorCategoria = [
  { bg: 'bg-ophira-primary', stroke: '#00BFFF' },
  { bg: 'bg-slate-400', stroke: '#94a3b8' },
  { bg: 'bg-ophira-success', stroke: '#10b981' },
  { bg: 'bg-ophira-warning', stroke: '#f59e0b' },
  { bg: 'bg-ophira-danger', stroke: '#f43f5e' }
];

const formatoMoneda = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2
});

const toNumber = (value) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizarEstado = (estado) => String(estado || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim();

const esEstadoMantenimiento = (estado) => normalizarEstado(estado).includes('mantenimiento');

const esEstadoDanado = (estado) => {
  const valor = normalizarEstado(estado);
  return valor.includes('danad') || valor.includes('deteriorad') || valor.includes('averiad');
};

const Dashboard = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showUbicacionMenu, setShowUbicacionMenu] = useState(false);
  const [showCategoriaMenu, setShowCategoriaMenu] = useState(false);
  const [activeCreateForm, setActiveCreateForm] = useState('edificio');

  const [edificios, setEdificios] = useState([]);
  const [pisosXedificio, setPisosXedificio] = useState([]);
  const [aulasXpiso, setAulasXpiso] = useState([]);
  const [operationStatus, setOperationStatus] = useState({ type: '', message: '' });
  const [categoriaStatus, setCategoriaStatus] = useState({ type: '', message: '' });
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: '',
    descripcion: ''
  });

  const [selectedEdificio, setSelectedEdificio] = useState('');
  const [selectedPiso, setSelectedPiso] = useState('');
  const [selectedAula, setSelectedAula] = useState('');
  const [dashboardData, setDashboardData] = useState({
    total_activos: '0',
    activos_en_mantenimiento: '0',
    activos_danados: '0',
    aniadidos_recientemente: '0',
    valor_total: '0'
  });
  const [activos, setActivos] = useState([]);
  // Para nuevas ubicaciones 
  const [nuevoEdificio, setNuevoEdificio] = useState({
    clave: '',
    nombre: '',
    cantidad_pisos: '',
    direccion: '',
  });
  const [nuevoPiso, setNuevoPiso] = useState({
    edificioId: '',
    numero_piso: '',
    cantidad_aulas: '',
  });
  const [nuevaAula, setNuevaAula] = useState({
    edificioId: '',
    pisoId: '',
    numero_aula: '',
    tipo: 'Aula',
  });

  const limpiarOperationStatus = () => setOperationStatus({ type: '', message: '' });
  const limpiarCategoriaStatus = () => setCategoriaStatus({ type: '', message: '' });

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        const [dashboardResponse, activosResponse] = await Promise.all([
          api.get('assets/dashboard'),
          api.get('assets/activos')
        ]);

        const dashboardRaw = dashboardResponse?.rows ?? dashboardResponse;
        const dashboardObj = Array.isArray(dashboardRaw) ? dashboardRaw[0] : dashboardRaw;

        const activosRaw = activosResponse?.rows ?? activosResponse;
        const activosList = Array.isArray(activosRaw) ? activosRaw : [];

        setDashboardData(dashboardObj || {});
        setActivos(activosList);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      }
    };

    cargarDashboard();
  }, []);

  const totalActivos = toNumber(dashboardData.total_activos);
  const mantenimiento = activos.filter((a) => esEstadoMantenimiento(a.estado)).length || toNumber(dashboardData.activos_en_mantenimiento);
  const danados = activos.filter((a) => esEstadoDanado(a.estado)).length || toNumber(dashboardData.activos_danados);
  const recientes = toNumber(dashboardData.aniadidos_recientemente);
  const valorTotal = toNumber(dashboardData.valor_total);

  const stats = [
    {
      label: 'TOTAL ACTIVOS',
      value: totalActivos.toLocaleString('es-MX'),
      change: 'Registrados',
      icon: FileText,
      color: 'blue',
      trend: 'up'
    },
    {
      label: 'EN MANTENIMIENTO',
      value: mantenimiento.toLocaleString('es-MX'),
      change: 'Activos',
      icon: Wrench,
      color: 'orange',
      trend: 'warning'
    },
    {
      label: 'ACTIVOS DANADOS',
      value: danados.toLocaleString('es-MX'),
      change: 'Requieren atencion',
      icon: TrendingUp,
      color: 'red',
      trend: 'danger'
    },
    {
      label: 'AÑADIDOS RECIENTEMENTE',
      value: recientes.toLocaleString('es-MX'),
      change: 'Últimos registros',
      icon: TrendingUp,
      color: 'green',
      trend: 'up'
    },
    {
      label: 'VALOR TOTAL',
      value: formatoMoneda.format(valorTotal),
      change: 'Inventario actual',
      icon: DollarSign,
      color: 'purple',
      trend: 'up'
    }
  ];

  const actividades = activos.slice(0, 6).map((activo) => ({
    nombre: activo.nombre,
    codigo: activo.id_activo,
    estado: activo.estado,
    responsable: activo.responsable,
    estadoColor: activo.color,
    ubicacion: activo.aula,
    piso: activo.tipo_aula,
    icon: FileText
  }));

  const totalDistribucion = activos.length;
  const conteoCategorias = activos.reduce((acc, activo) => {
    const key = activo.categoria || 'Sin categoría';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const distribucion = Object.entries(conteoCategorias)
    .map(([categoria, cantidad], index) => {
      const porcentaje = totalDistribucion > 0 ? Math.round((cantidad * 100) / totalDistribucion) : 0;
      const color = colorCategoria[index % colorCategoria.length];
      return { categoria, porcentaje, ...color };
    })
    .sort((a, b) => b.porcentaje - a.porcentaje);

  const circumference = 2 * Math.PI * 40;
  let acumulado = 0;

  const edificioSeleccionadoParaPiso = edificios.find((item) => item.id_edificio === nuevoPiso.edificioId);
  const pisoSeleccionadoParaAula = pisosXedificio.find((item) => item.id_piso === nuevaAula.pisoId);

  const handleSelectEdificio = async (value) => {
    setSelectedEdificio(value);
    setSelectedPiso('');
    setSelectedAula('');

    if (!value) {
      setPisosXedificio([]);
      setAulasXpiso([]);
      return;
    }

    await cargarPisosXEdificio(value);
  };

  const handleSelectPiso = async (value) => {
    setSelectedPiso(value);
    setSelectedAula('');

    if (!value) {
      setAulasXpiso([]);
      return;
    }

    await cargarAulasXpiso(value);
  };

  const crearEdificio = async() => {
    if (!nuevoEdificio.clave || !nuevoEdificio.nombre || !nuevoEdificio.cantidad_pisos || !nuevoEdificio.direccion) {
      setOperationStatus({ type: 'error', message: 'Completa todos los campos para crear el edificio.' });
      return;
    }
    const totalPisos = Number(nuevoEdificio.cantidad_pisos);
    if (totalPisos <= 0) {
      setOperationStatus({ type: 'error', message: 'La cantidad de pisos debe ser mayor a 0.' });
      return;
    }
    try {
      console.log('nuevo edificio', nuevoEdificio);
      const response= await api.post('ubicacion/edificio', nuevoEdificio);
      console.log(response);
      setNuevoEdificio({ clave: '', nombre: '', cantidad_pisos: '', direccion: '' });
      setOperationStatus({ type: 'success', message: 'Edificio creado correctamente.' });
      await cargarEdificiosParaPiso();
    } catch (error) {
      setOperationStatus({ type: 'error', message: `Error al crear edificio: ${error.message}` });
    }
  };

  const cargarEdificiosParaPiso = async() => {
    try{
      const response = await api.get('ubicacion/edificio');
      setEdificios(response);
      console.log(response);
    } catch (error) {
      console.error('Error al cargar edificios:', error);
      setOperationStatus({ type: 'error', message: `Error al cargar edificios: ${error.message}` });
    }
  }

  const cargarPisosXEdificio = async (edificioId) => {
    try{
      const response= await api.get(`ubicacion/piso/${edificioId}`);
      setPisosXedificio(response);
      console.log(response);
    }catch (error) {
      console.error('Error al cargar pisos:', error);
      setOperationStatus({ type: 'error', message: `Error al cargar pisos: ${error.message}` });
    }
  }
  const crearPiso = async() => {
    if (!nuevoPiso.edificioId || !nuevoPiso.numero_piso || !nuevoPiso.cantidad_aulas) {
      setOperationStatus({ type: 'error', message: 'Completa todos los campos para crear el piso.' });
      return;
    }
    try {
      console.log('nuevo piso', nuevoPiso);
      const result= await api.post('ubicacion/piso', {
        id_edificio: nuevoPiso.edificioId,
        numero_piso: nuevoPiso.numero_piso,
        cantidad_aulas: nuevoPiso.cantidad_aulas,
      });
      console.log(result);

      setNuevoPiso({ edificioId: '', numero_piso: '', cantidad_aulas: '' });
      setOperationStatus({ type: 'success', message: 'Piso creado correctamente.' });
      await cargarPisosXEdificio(result.id_edificio ?? nuevoPiso.edificioId);
    } catch (error) {
      setOperationStatus({ type: 'error', message: `Error al crear piso: ${error.message}` });
    }
  };
  const cargarAulasXpiso= async(pisoId)=>{
    try{
      const response= await api.get(`ubicacion/aula/${pisoId}`);
      setAulasXpiso(response);
      console.log(response);
    }catch (error) {
      console.error('Error al cargar aulas:', error);
      setOperationStatus({ type: 'error', message: `Error al cargar aulas: ${error.message}` });
    }
  }
  const crearAula = async() => {
    if (!nuevaAula.edificioId || !nuevaAula.pisoId || !nuevaAula.numero_aula || !nuevaAula.tipo) {
      setOperationStatus({ type: 'error', message: 'Completa todos los campos para crear el aula.' });
      return;
    }
    try {
      console.log('nueva aula', nuevaAula);
      const result= await api.post('ubicacion/aula', {
        id_piso: nuevaAula.pisoId,
        numero_aula: nuevaAula.numero_aula,
        tipo: nuevaAula.tipo,
      });
      console.log(result);
      setNuevaAula({ edificioId: '', pisoId: '', numero_aula: '', tipo: 'Aula' });
      setOperationStatus({ type: 'success', message: 'Aula creada correctamente.' });
      await cargarAulasXpiso(result.id_piso ?? nuevaAula.pisoId);
    } catch (error) {
      setOperationStatus({ type: 'error', message: `Error al crear aula: ${error.message}` });
    }
  };

  const crearCategoria = async () => {
    if (!nuevaCategoria.nombre.trim() || !nuevaCategoria.descripcion.trim()) {
      setCategoriaStatus({ type: 'error', message: 'Completa nombre y descripcion de la categoria.' });
      return;
    }

    try {
      await api.post('categorias', {
        nombre: nuevaCategoria.nombre.trim(),
        descripcion: nuevaCategoria.descripcion.trim(),
      });

      setNuevaCategoria({ nombre: '', descripcion: '' });
      setCategoriaStatus({ type: 'success', message: 'Categoria creada correctamente.' });
    } catch (error) {
      setCategoriaStatus({ type: 'error', message: `Error al crear categoria: ${error.message}` });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium border transition ${
                isDark
                  ? 'bg-ophira-bg-card text-slate-200 border-ophira-bg-hover hover:bg-ophira-bg-hover'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              onClick={() => {
                setShowUbicacionMenu((prev) => {
                  const nextOpen = !prev;
                  limpiarOperationStatus();
                  if (nextOpen) {
                    cargarEdificiosParaPiso();
                  }
                  return nextOpen;
                });
              }}
              type="button"
            >
              <MapPin size={18} />
              Nueva Ubicacion
              <ChevronDown size={16} className={`transition ${showUbicacionMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUbicacionMenu && (
              <div className={`absolute right-0 mt-2 w-[440px] max-w-[90vw] rounded-xl border shadow-lg z-20 p-4 space-y-4 ${
                isDark ? 'bg-ophira-bg-card border-ophira-bg-hover' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Gestion de Ubicaciones</h3>
                  <button
                    className={`p-1 rounded transition ${
                      isDark ? 'text-slate-400 hover:bg-ophira-bg-hover hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    }`}
                      onClick={() => {
                        limpiarOperationStatus();
                        setShowUbicacionMenu(false);
                      }}
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </div>

                {operationStatus.message && (
                  <div className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                    operationStatus.type === 'success'
                      ? isDark
                        ? 'bg-green-950/40 border-green-800 text-green-300'
                        : 'bg-green-50 border-green-200 text-green-700'
                      : isDark
                        ? 'bg-red-950/40 border-red-800 text-red-300'
                        : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    {operationStatus.message}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      activeCreateForm === 'edificio'
                        ? 'bg-ophira-primary text-white'
                        : isDark
                          ? 'bg-ophira-bg-hover text-slate-300 hover:bg-ophira-bg-hover/80'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    onClick={() => setActiveCreateForm('edificio')}
                    onClickCapture={limpiarOperationStatus}
                    type="button"
                  >
                    <Building2 size={14} />
                    Nuevo edificio
                  </button>
                  <button
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      activeCreateForm === 'piso'
                        ? 'bg-ophira-primary text-white'
                        : isDark
                          ? 'bg-ophira-bg-hover text-slate-300 hover:bg-ophira-bg-hover/80'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    onClick={() => {
                      limpiarOperationStatus();
                      setActiveCreateForm('piso')
                      cargarEdificiosParaPiso();
                    }}
                    type="button"
                  >
                    <Layers size={14} />
                    Nuevo piso
                  </button>
                  <button
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      activeCreateForm === 'aula'
                        ? 'bg-ophira-primary text-white'
                        : isDark
                          ? 'bg-ophira-bg-hover text-slate-300 hover:bg-ophira-bg-hover/80'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    onClick={() => {
                      limpiarOperationStatus();
                      setActiveCreateForm('aula');
                      cargarEdificiosParaPiso();
                    }}
                    type="button"
                  >
                    <DoorOpen size={14} />
                    Nueva aula
                  </button>
                </div>

                {activeCreateForm === 'edificio' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Clave"
                      value={nuevoEdificio.clave}
                      onChange={(event) => setNuevoEdificio((prev) => ({ ...prev, clave: event.target.value }))}
                      className={`px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-ophira-primary focus:ring-1 focus:ring-ophira-primary ${
                        isDark ? 'bg-ophira-bg-hover border-ophira-bg-hover text-slate-100 placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={nuevoEdificio.nombre}
                      onChange={(event) => setNuevoEdificio((prev) => ({ ...prev, nombre: event.target.value }))}
                      className={`px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-ophira-primary focus:ring-1 focus:ring-ophira-primary ${
                        isDark ? 'bg-ophira-bg-hover border-ophira-bg-hover text-slate-100 placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Cantidad de pisos"
                      value={nuevoEdificio.cantidad_pisos}
                      onChange={(event) => setNuevoEdificio((prev) => ({ ...prev, cantidad_pisos: event.target.value }))}
                      className={`px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-ophira-primary focus:ring-1 focus:ring-ophira-primary ${
                        isDark ? 'bg-ophira-bg-hover border-ophira-bg-hover text-slate-100 placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Direccion"
                      value={nuevoEdificio.direccion}
                      onChange={(event) => setNuevoEdificio((prev) => ({ ...prev, direccion: event.target.value }))}
                      className={`md:col-span-2 px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-ophira-primary focus:ring-1 focus:ring-ophira-primary ${
                        isDark ? 'bg-ophira-bg-hover border-ophira-bg-hover text-slate-100 placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                    <button
                      className="md:col-span-2 bg-ophira-primary text-white rounded-lg py-2 text-xs font-medium hover:bg-ophira-primary/90 transition"
                      onClick={crearEdificio}
                      type="button"
                    >
                      Crear edificio
                    </button>
                  </div>
                )}

                {activeCreateForm === 'piso' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <select
                      value={nuevoPiso.edificioId}
                      onChange={(event) => {
                        const edificioId = event.target.value;
                        setNuevoPiso((prev) => ({ ...prev, edificioId, numero_piso: '' }));
                      }}
                      className={`px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-ophira-primary focus:ring-1 focus:ring-ophira-primary ${
                        isDark ? 'bg-ophira-bg-hover border-ophira-bg-hover text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="">Selecciona edificio</option>
                      {edificios.map((edificio) => (
                        <option key={edificio.id_edificio} value={edificio.id_edificio}>{edificio.nombre}</option>
                      ))}
                    </select>
                    <select
                      value={nuevoPiso.numero_piso}
                      onChange={(event) => setNuevoPiso((prev) => ({ ...prev, numero_piso: event.target.value }))}
                      className={`px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-ophira-primary focus:ring-1 focus:ring-ophira-primary ${
                        isDark ? 'bg-ophira-bg-hover border-ophira-bg-hover text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="">Numero de piso</option>
                      {Array.from({ length: Number(edificioSeleccionadoParaPiso?.cantidad_pisos ?? 0) }, (_, index) => {
                        const numero = index + 1;
                        return (
                          <option key={numero} value={numero}>
                            Piso {numero}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      value={nuevoPiso.cantidad_aulas}
                      onChange={(event) => setNuevoPiso((prev) => ({ ...prev, cantidad_aulas: event.target.value }))}
                      className={`md:col-span-2 px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                        isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="">Cantidad de aulas</option>
                      {Array.from({ length: 60 }, (_, index) => {
                        const cantidad = index + 1;
                        return (
                          <option key={cantidad} value={cantidad}>
                            {cantidad} aula{cantidad > 1 ? 's' : ''}
                          </option>
                        );
                      })}
                    </select>
                    <button
                      className="md:col-span-2 bg-ophira-primary text-white rounded-lg py-2 text-xs font-medium hover:bg-ophira-primary/90 transition"
                      onClick={crearPiso}
                      type="button"
                    >
                      Crear piso
                    </button>
                  </div>
                )}

                {activeCreateForm === 'aula' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <select
                      value={nuevaAula.edificioId}
                      onChange={async (event) => {
                        const edificioId = event.target.value;
                        setNuevaAula((prev) => ({ ...prev, edificioId, pisoId: '', numero_aula: '' }));
                        if (!edificioId) {
                          setPisosXedificio([]);
                          return;
                        }
                        await cargarPisosXEdificio(edificioId);
                      }}
                      className={`px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                        isDark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="">Selecciona edificio</option>
                      {edificios.map((edificio) => (
                        <option key={edificio.id_edificio} value={edificio.id_edificio}>{edificio.nombre}</option>
                      ))}
                    </select>
                    <select
                      value={nuevaAula.pisoId}
                      onChange={(event) => setNuevaAula((prev) => ({ ...prev, pisoId: event.target.value, numero_aula: '' }))}
                      disabled={!nuevaAula.edificioId}
                      className={`px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-ophira-primary focus:ring-1 focus:ring-ophira-primary disabled:opacity-60 ${
                        isDark ? 'bg-ophira-bg-hover border-ophira-bg-hover text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="">Selecciona piso</option>
                      {pisosXedificio.map((piso) => (
                        <option key={piso.id_piso} value={piso.id_piso}>Piso {piso.numero_piso}</option>
                      ))}
                    </select>
                    {/* <input */}
                    <select
                      value={nuevaAula.numero_aula}
                      onChange={(event) => setNuevaAula((prev) => ({ ...prev, numero_aula: event.target.value }))}
                      className={`px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-ophira-primary focus:ring-1 focus:ring-ophira-primary ${
                        isDark ? 'bg-ophira-bg-hover border-ophira-bg-hover text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                      disabled={!nuevaAula.pisoId}
                    >
                      <option value="">Numero de aula</option>
                      {Array.from({ length: Number(pisoSeleccionadoParaAula?.cantidad_aulas ?? 0) }, (_, index) => {
                        const numero = index + 1 < 10 ? String(index + 1).padStart(2, '0') : String(index + 1);
                        return (
                          <option key={numero} value={numero}>
                            Aula {numero}
                          </option>
                        );
                      })}
                    </select>
                    <input
                      type="text"
                      placeholder="Tipo"
                      value={nuevaAula.tipo}
                      onChange={(event) => setNuevaAula((prev) => ({ ...prev, tipo: event.target.value }))}
                      className={`px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-ophira-primary focus:ring-1 focus:ring-ophira-primary ${
                        isDark ? 'bg-ophira-bg-hover border-ophira-bg-hover text-slate-100 placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                    <button
                      className="md:col-span-2 bg-ophira-primary text-white rounded-lg py-2 text-xs font-medium hover:bg-ophira-primary/90 transition"
                      onClick={crearAula}
                      type="button"
                    >
                      Crear aula
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition" onClick={() => navigate('/activos/nuevo')}>
            <Plus size={16} />
            Nuevo Activo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`rounded-xl p-6 shadow-sm border transition ${
              isDark 
                ? 'bg-ophira-bg-card border-ophira-bg-hover' 
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? isDark ? 'bg-blue-900/30' : 'bg-blue-100' :
                  stat.color === 'orange' ? isDark ? 'bg-orange-900/30' : 'bg-orange-100' :
                  stat.color === 'red' ? isDark ? 'bg-red-900/30' : 'bg-red-100' :
                  stat.color === 'green' ? isDark ? 'bg-green-900/30' : 'bg-green-100' :
                  isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}>
                  <Icon className={
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'orange' ? 'text-orange-600' :
                    stat.color === 'red' ? 'text-red-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    'text-purple-600'
                  } size={20} />
                </div>
              </div>
              <h3 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{stat.value}</h3>
              <p className={`text-sm flex items-center gap-1 ${
                stat.trend === 'warning' ? 'text-orange-600' :
                stat.trend === 'danger' ? 'text-red-600' :
                'text-green-600'
              }`}>
                {stat.trend === 'up' && <ArrowUp size={14} />}
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`rounded-xl p-6 shadow-sm border transition relative ${
          isDark 
            ? 'bg-ophira-bg-card border-ophira-bg-hover' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Distribución por Categoría</h2>
            <button
              className={`${isDark ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}
              onClick={() => {
                setShowCategoriaMenu((prev) => {
                  const nextState = !prev;
                  limpiarCategoriaStatus();
                  return nextState;
                });
              }}
              type="button"
            >
              <MoreVertical size={18} />
            </button>
          </div>

          {showCategoriaMenu && (
            <div className={`absolute right-6 top-16 w-[320px] max-w-[85vw] rounded-xl border shadow-lg z-20 p-4 space-y-3 ${
              isDark ? 'bg-ophira-bg-card border-ophira-bg-hover' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Nueva categoria</h3>
                <button
                  className={`p-1 rounded transition ${
                    isDark ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                  onClick={() => {
                    limpiarCategoriaStatus();
                    setShowCategoriaMenu(false);
                  }}
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>

              {categoriaStatus.message && (
                <div className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                  categoriaStatus.type === 'success'
                    ? isDark
                      ? 'bg-green-950/40 border-green-800 text-green-300'
                      : 'bg-green-50 border-green-200 text-green-700'
                    : isDark
                      ? 'bg-red-950/40 border-red-800 text-red-300'
                      : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {categoriaStatus.message}
                </div>
              )}

              <input
                type="text"
                placeholder="Nombre de categoria"
                value={nuevaCategoria.nombre}
                onChange={(event) => setNuevaCategoria((prev) => ({ ...prev, nombre: event.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-ophira-primary focus:ring-1 focus:ring-ophira-primary ${
                  isDark ? 'bg-ophira-bg-hover border-ophira-bg-hover text-slate-100 placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />

              <textarea
                placeholder="Descripcion breve"
                value={nuevaCategoria.descripcion}
                onChange={(event) => setNuevaCategoria((prev) => ({ ...prev, descripcion: event.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-ophira-primary focus:ring-1 focus:ring-ophira-primary min-h-[88px] resize-none ${
                  isDark ? 'bg-ophira-bg-hover border-ophira-bg-hover text-slate-100 placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />

              <button
                className="w-full bg-ophira-primary text-white rounded-lg py-2 text-xs font-medium hover:bg-ophira-primary/90 transition"
                onClick={crearCategoria}
                type="button"
              >
                Crear categoria
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-center mb-8">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="12" />
                {distribucion.map((item, index) => {
                  const segmento = (item.porcentaje / 100) * circumference;
                  const circle = (
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={item.stroke}
                      strokeWidth="12"
                      strokeDasharray={`${segmento} ${circumference}`}
                      strokeDashoffset={-acumulado}
                    />
                  );
                  acumulado += segmento;
                  return circle;
                })}
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            {distribucion.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.bg}`}></div>
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.categoria}</span>
                </div>
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.porcentaje}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`lg:col-span-2 rounded-xl p-6 shadow-sm border transition ${
          isDark 
            ? 'bg-ophira-bg-card border-ophira-bg-hover' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Actividad Reciente</h2>
            <button className="text-ophira-primary hover:text-ophira-primary/80 text-sm font-medium">Ver Todo</button>
          </div>
          <div className="max-h-[28rem] overflow-auto">
            <table className="w-full">
              <thead className={`border-b ${isDark ? 'border-ophira-bg-hover' : 'border-slate-200'}`}>
                <tr>
                  <th className={`text-left text-xs font-semibold uppercase pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Activo</th>
                  <th className={`text-left text-xs font-semibold uppercase pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Responsable</th>
                  <th className={`text-left text-xs font-semibold uppercase pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Estado</th>
                  <th className={`text-left text-xs font-semibold uppercase pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ubicación</th>
                </tr>
              </thead>
              <tbody>
                {actividades.map((actividad, index) => {
                  const Icon = actividad.icon;
                  return (
                    <tr key={index} className={`border-b ${isDark ? 'border-ophira-bg-hover hover:bg-ophira-bg-hover/30' : 'border-slate-100 hover:bg-slate-50'} last:border-0 transition`}>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded flex items-center justify-center ${isDark ? 'bg-ophira-bg-hover' : 'bg-slate-100'}`}>
                            <Icon size={16} className={isDark ? 'text-slate-300' : 'text-slate-600'} />
                          </div>
                          <div>
                            <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{actividad.nombre}</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ID: {actividad.codigo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{actividad.responsable}</span>
                      </td>
                      <td className="py-4">
                        <span className={`text-xs font-medium ${colorEstadoTexto[actividad.estadoColor] || 'text-slate-500'}`}>
                          {actividad.estado}
                        </span>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className={`text-sm ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>{actividad.ubicacion}</p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{actividad.piso}</p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;