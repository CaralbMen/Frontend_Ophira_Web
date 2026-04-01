import { ArrowLeft, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

const formatearFechaHora = (valor) => {
  if (!valor) return '-';
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return '-';
  return fecha.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const intentarParsearJson = (valor) => {
  if (typeof valor !== 'string') return valor;
  const limpio = valor.trim();
  if (!limpio) return valor;

  try {
    return JSON.parse(limpio);
  } catch {
    return valor;
  }
};

const limpiarEtiqueta = (valor) => {
  const texto = String(valor || '').replace(/[_-]+/g, ' ').trim();
  if (!texto) return 'Campo';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const valorEsVacio = (valor) => valor === null || valor === undefined || String(valor).trim() === '';

const valorSimple = (valor) => {
  const normalizado = intentarParsearJson(valor);

  if (normalizado === null || normalizado === undefined || normalizado === '') {
    return 'Sin dato';
  }

  if (typeof normalizado === 'object') {
    return 'Dato estructurado';
  }

  return String(normalizado);
};

const valorComparable = (valor) => {
  const normalizado = intentarParsearJson(valor);

  if (normalizado === null || normalizado === undefined || normalizado === '') {
    return 'sin dato';
  }

  if (typeof normalizado === 'object') {
    try {
      return JSON.stringify(normalizado);
    } catch {
      return String(normalizado);
    }
  }

  return String(normalizado).trim();
};

const sonDistintos = (anterior, actual) => valorComparable(anterior) !== valorComparable(actual);

const construirCamposActualizacion = (detalle) => {
  const campo = intentarParsearJson(detalle?.campo_modificado);
  const anterior = intentarParsearJson(detalle?.valor_anterior);
  const nuevo = intentarParsearJson(detalle?.valor_nuevo);

  if (Array.isArray(campo)) {
    return campo.map((item, index) => ({
      label: limpiarEtiqueta(item),
      previous: Array.isArray(anterior) ? anterior[index] : anterior,
      current: Array.isArray(nuevo) ? nuevo[index] : nuevo,
    }));
  }

  if (typeof nuevo === 'object' && nuevo && !Array.isArray(nuevo)) {
    const keys = Object.keys(nuevo);
    return keys.map((key) => ({
      label: limpiarEtiqueta(key),
      previous: anterior && typeof anterior === 'object' ? anterior[key] : undefined,
      current: nuevo[key],
    }));
  }

  if (typeof anterior === 'object' && anterior && !Array.isArray(anterior)) {
    const keys = Object.keys(anterior);
    return keys.map((key) => ({
      label: limpiarEtiqueta(key),
      previous: anterior[key],
      current: nuevo && typeof nuevo === 'object' ? nuevo[key] : nuevo,
    }));
  }

  return [
    {
      label: limpiarEtiqueta(campo || 'Campo modificado'),
      previous: anterior,
      current: nuevo,
    },
  ];
};

const construirCamposParametros = (parametros) => {
  const normalizado = intentarParsearJson(parametros);

  if (typeof normalizado === 'object' && normalizado && !Array.isArray(normalizado)) {
    return Object.entries(normalizado).map(([key, value]) => ({
      key,
      label: limpiarEtiqueta(key),
      current: value,
    }));
  }

  return [{ key: 'parametros', label: 'Parámetros', current: normalizado }];
};

const CampoSoloLectura = ({ isDark, label, currentValue, previousValue }) => (
  <div>
    <p className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
    {!valorEsVacio(previousValue) && sonDistintos(previousValue, currentValue) && (
      <p className={`text-[11px] mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {`Anterior: ${valorSimple(previousValue)}`}
      </p>
    )}
    <div className={`rounded-lg border px-3 py-2 text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
      {valorSimple(currentValue)}
    </div>
  </div>
);

const DetalleMovimiento = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDetalle = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get(`movimientos/${id}/detalle`);
        setDetalle(response?.row || null);
      } catch (e) {
        setError('No se pudo cargar el detalle del movimiento.');
        setDetalle(null);
      } finally {
        setLoading(false);
      }
    };

    cargarDetalle();
  }, [id]);

  const tipo = useMemo(() => String(detalle?.tipo_movimiento || '').toLowerCase(), [detalle]);
  const usuarioMovimiento = useMemo(() => {
    if (!detalle) return '-';
    if (tipo === 'depreciacion') return 'Sistema';
    return [detalle.nombre_usuario, detalle.apellido_paterno].filter(Boolean).join(' ') || '-';
  }, [detalle, tipo]);
  const camposActualizacion = useMemo(() => construirCamposActualizacion(detalle), [detalle]);
  const camposParametros = useMemo(() => construirCamposParametros(detalle?.parametros_usados), [detalle]);
  const camposParametrosDepreciacion = useMemo(() => {
    if (tipo !== 'depreciacion') return camposParametros;

    const clavesDuplicadas = new Set([
      'valor_anterior',
      'valor_anterior_depreciacion',
      'valor_nuevo',
      'valor_actual',
      'valor_restante',
      'valor_depreciado',
      'metodo_depreciacion',
      'id_metodo_depreciacion',
    ]);

    return camposParametros.filter((campo) => !clavesDuplicadas.has(String(campo.key || '').toLowerCase()));
  }, [camposParametros, tipo]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
          Detalle de Movimiento
        </h1>
        <button
          onClick={() => navigate('/historial')}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition ${isDark
            ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </div>

      {loading && (
        <div className={`rounded-lg border p-6 flex items-center gap-3 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}>
          <Loader2 size={18} className="animate-spin" />
          Cargando detalle...
        </div>
      )}

      {!loading && error && (
        <div className={`rounded-lg border p-6 text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-red-400' : 'bg-white border-slate-200 text-red-600'}`}>
          {error}
        </div>
      )}

      {!loading && !error && detalle && (
        <>
          <div className={`rounded-lg border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              Datos Generales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ID Movimiento</p>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{detalle.id_movimiento}</p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tipo</p>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{detalle.tipo_movimiento}</p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Fecha y hora</p>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{formatearFechaHora(detalle.fecha_movimiento)}</p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Usuario</p>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {usuarioMovimiento}
                </p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ID Activo</p>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{detalle.id_activo}</p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Nombre Activo</p>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{detalle.nombre_activo || '-'}</p>
              </div>
            </div>
          </div>

          {tipo === 'depreciacion' && (
            <div className={`rounded-lg border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                Detalle de Depreciación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <CampoSoloLectura
                  isDark={isDark}
                  label="Valor anterior"
                  currentValue={detalle.valor_anterior_depreciacion}
                />
                <CampoSoloLectura
                  isDark={isDark}
                  label="Valor depreciado"
                  currentValue={detalle.valor_depreciado}
                />
                <CampoSoloLectura
                  isDark={isDark}
                  label="Valor actual"
                  currentValue={detalle.valor_restante}
                />
                <CampoSoloLectura
                  isDark={isDark}
                  label="Método"
                  currentValue={detalle.metodo_depreciacion}
                />
              </div>
              {camposParametrosDepreciacion.length > 0 && (
                <div className="mt-4">
                  <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Parámetros usados</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {camposParametrosDepreciacion.map((campo, idx) => (
                      <CampoSoloLectura
                        key={`${campo.label}-${idx}`}
                        isDark={isDark}
                        label={campo.label}
                        currentValue={campo.current}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tipo === 'actualizacion' && (
            <div className={`rounded-lg border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                Detalle de Actualización
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {camposActualizacion.map((campo, idx) => (
                  <CampoSoloLectura
                    key={`${campo.label}-${idx}`}
                    isDark={isDark}
                    label={campo.label}
                    previousValue={campo.previous}
                    currentValue={campo.current}
                  />
                ))}
              </div>
              <div className="mt-4">
                <CampoSoloLectura
                  isDark={isDark}
                  label="Justificación"
                  currentValue={detalle.justificacion}
                />
              </div>
            </div>
          )}

          {tipo === 'ubicacion' && (
            <div className={`rounded-lg border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                Detalle de Ubicación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Aula origen</p>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {detalle.id_aula_origen ? `${detalle.id_aula_origen} (${detalle.aula_origen || 'sin numero'} - ${detalle.tipo_aula_origen || 'sin tipo'})` : 'Sin dato'}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Aula destino</p>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {detalle.id_aula_destino ? `${detalle.id_aula_destino} (${detalle.aula_destino || 'sin numero'} - ${detalle.tipo_aula_destino || 'sin tipo'})` : 'Sin dato'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {tipo === 'baja' && (
            <div className={`rounded-lg border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                Detalle de Baja
              </h2>
              <CampoSoloLectura
                isDark={isDark}
                label="Motivo"
                currentValue={detalle.motivo_baja}
              />
            </div>
          )}

          {!['depreciacion', 'actualizacion', 'ubicacion', 'baja'].includes(tipo) && (
            <div className={`rounded-lg border p-6 text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
              Este movimiento no tiene tabla de detalle en el esquema actual.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DetalleMovimiento;
