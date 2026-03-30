import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Download, CheckCircle, XCircle, MapPin, User, Calendar } from 'lucide-react';
import { api } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DetallesAuditoria = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [auditoria, setAuditoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarAuditoria = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`auditorias/${id}`);
        const row = response?.rows || null;

        if (!row) {
          setAuditoria(null);
          setError('No se encontró la auditoría solicitada.');
          return;
        }

        setAuditoria(row);
      } catch (e) {
        setError('No se pudieron cargar los detalles de la auditoría.');
        setAuditoria(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarAuditoria();
    }
  }, [id]);

  const activosNormalizados = useMemo(() => {
    const estadosFuente = auditoria?.estados_activos ?? auditoria?.EstadosActivos ?? auditoria?.estadosActivos;

    if (!estadosFuente) {
      return [];
    }

    let estados = estadosFuente;
    if (typeof estados === 'string') {
      try {
        estados = JSON.parse(estados);
      } catch {
        return [];
      }
    }

    const normalizarDesdeEntrada = (id, rawValue, index = 0) => {
      let value = rawValue;
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch {
          value = { estado: rawValue };
        }
      }

      const tieneClave = id !== null && id !== undefined && String(id).trim() !== '';
      const claveNormalizada = tieneClave ? String(id).trim() : null;
      const keyEsNumerica = Boolean(claveNormalizada && /^\d+$/.test(claveNormalizada));
      const idActivo = keyEsNumerica
        ? claveNormalizada
        : (value?.id_activo ?? value?.idActivo ?? value?.id ?? null);
      const nombreFallbackDesdeClave = !keyEsNumerica && typeof id === 'string' ? id : null;

      const estado = value?.estado ?? value?.estado_activo ?? value?.estadoActivo ?? value?.estado_verificacion ?? 'Sin estado';

      return {
        claveObjeto: claveNormalizada,
        id: idActivo,
        nombre: value?.nombre_activo ?? value?.nombre ?? nombreFallbackDesdeClave ?? `Activo ${index + 1}`,
        categoria: value?.categoria ?? '-',
        responsable: value?.responsable ?? 'Sin responsable',
        hallado:
          value?.hallado ??
          value?.encontrado ??
          value?.localizado ??
          value?.ubicado ??
          !['no encontrado', 'no_encontrado', 'faltante'].includes(String(estado).toLowerCase()),
        estadoActivo: estado,
        colorEstado:
          value?.color ??
          value?.estado_color ??
          value?.color_estado ??
          value?.estadoActivoColor ??
          null,
        observaciones:
          value?.observaciones ??
          value?.observacion ??
          value?.comentario ??
          auditoria.observaciones ??
          'Sin observaciones'
      };
    };

    if (Array.isArray(estados)) {
      const entradas = [];

      estados.forEach((item, index) => {
        if (!item || typeof item !== 'object') {
          entradas.push([null, item, index]);
          return;
        }

        if ('estado' in item || 'id_activo' in item || 'id' in item) {
          entradas.push([item.id_activo ?? item.id ?? null, item, index]);
          return;
        }

        Object.entries(item).forEach(([key, value]) => {
          entradas.push([key, value, index]);
        });
      });

      return entradas.map(([idEntry, valueEntry, index]) => normalizarDesdeEntrada(idEntry, valueEntry, index));
    }

    if (estados && typeof estados === 'object') {
      return Object.entries(estados).map(([key, value], index) => normalizarDesdeEntrada(key, value, index));
    }

    return [];
  }, [auditoria]);

  const localizados = activosNormalizados.filter((item) => item.hallado).length;
  const faltantes = activosNormalizados.length - localizados;

  const fechaAuditoria = useMemo(() => {
    const raw = auditoria?.fecha_auditoria || auditoria?.fecha_registro || auditoria?.created_at || null;
    if (!raw) return '-';
    const fecha = new Date(raw);
    if (Number.isNaN(fecha.getTime())) return '-';
    return fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  }, [auditoria]);

  const auditorNombreCompleto = useMemo(() => {
    return [auditoria?.nombre_usuario || auditoria?.nombre, auditoria?.apellido_paterno]
      .filter(Boolean)
      .join(' ')
      .trim() || `Usuario #${auditoria?.id_usuario_auditor ?? '-'}`;
  }, [auditoria]);

  const auditorPuestoArea = useMemo(() => {
    return [auditoria?.puesto, auditoria?.area].filter(Boolean).join(' de ') || '-';
  }, [auditoria]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Finalizada':
      case 'finalizada':
        return 'text-green-600';
      case 'En progreso':
      case 'progreso':
        return 'text-yellow-600';
      case 'Pendiente':
      case 'pendiente':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const getEstadoActivoTextColor = (estado, colorEstado) => {
    const color = String(colorEstado || '').toLowerCase();

    if (color === 'green' || color === 'verde') return 'text-green-600';
    if (color === 'yellow' || color === 'amarillo') return 'text-yellow-600';
    if (color === 'red' || color === 'rojo') return 'text-red-600';
    if (color === 'blue' || color === 'azul') return 'text-blue-600';
    if (color === 'orange' || color === 'naranja') return 'text-orange-600';

    switch (estado) {
      case 'Activo':
      case 'activo':
        return 'text-green-600';
      case 'Mantenimiento':
      case 'mantenimiento':
        return 'text-yellow-600';
      case 'Retirado':
      case 'retirado':
      case 'Baja':
      case 'baja':
      case 'faltante':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const exportarReportePdf = () => {
    if (!auditoria) {
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

    const auditorNombre =
      [auditoria.nombre_usuario || auditoria.nombre, auditoria.apellido_paterno].filter(Boolean).join(' ') ||
      `Usuario #${auditoria.id_usuario_auditor}`;

    doc.setFontSize(16);
    doc.text('Reporte de Auditoria', 40, 40);

    doc.setFontSize(10);
    doc.text(`ID Auditoria: #${auditoria.id_auditoria}`, 40, 62);
    doc.text(`Fecha: ${fechaAuditoria}`, 220, 62);
    doc.text(`Auditor: ${auditorNombre}`, 40, 78);
    doc.text(`Ubicacion: Aula #${auditoria.id_aula ?? '-'}`, 40, 94);
    doc.text(`Estado general: ${auditoria.estado_general || 'Sin estado'}`, 220, 94);
    doc.text(`Total activos: ${activosNormalizados.length}`, 40, 110);
    doc.text(`Localizados: ${localizados}`, 220, 110);
    doc.text(`Faltantes: ${faltantes}`, 340, 110);

    const observacionesGenerales = auditoria.observaciones || 'Sin observaciones';
    doc.text(`Observaciones generales: ${observacionesGenerales}`, 40, 126);

    autoTable(doc, {
      startY: 146,
      head: [['ID Activo', 'Nombre', 'Categoria', 'Hallado', 'Estado del Activo', 'Observaciones']],
      body: activosNormalizados.map((activo) => [
        String((activo.claveObjeto && /^\d+$/.test(String(activo.claveObjeto)) ? activo.claveObjeto : activo.id) ?? '-'),
        activo.nombre || '-',
        activo.categoria || '-',
        activo.hallado ? 'Si' : 'No',
        activo.estadoActivo || '-',
        activo.observaciones || 'Sin observaciones',
      ]),
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`auditoria_${auditoria.id_auditoria}.pdf`);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {loading && (
          <div className={`rounded-lg border p-6 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}>
            Cargando detalle de auditoría...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && auditoria && (
        <>
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
              ID: #{auditoria.id_auditoria}
            </p>
          </div>
          <button
            onClick={exportarReportePdf}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
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
                {fechaAuditoria}
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
                {auditorNombreCompleto}
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {auditorPuestoArea}
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
                Aula #{auditoria.id_aula ?? '-'}
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
              <p className={`text-lg font-bold ${getEstadoColor(auditoria.estado_general)}`}>
                {auditoria.estado_general || 'Sin estado'}
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
          <div className={`px-4 py-3 border-b transition ${
            isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Activos Verificados
              </h2>
              <span className="text-blue-600 font-semibold text-sm">
                {activosNormalizados.length} Total
              </span>
            </div>
          </div>

          <div className="max-h-[28rem] overflow-auto">
            <table className="w-full">
              <thead className={`border-b transition ${
                isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
              }`}>
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
                    Estado del Activo
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Observaciones
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
                {activosNormalizados.length === 0 && (
                  <tr>
                    <td colSpan={5} className={`px-6 py-6 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      No hay activos detallados en esta auditoría.
                    </td>
                  </tr>
                )}

                {activosNormalizados.map((activo, index) => (
                  <tr key={activo.claveObjeto ?? activo.id ?? index} className={`transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                    <td className="px-4 py-3">
                      <div>
                        <span className="text-blue-600 font-semibold text-sm hover:text-blue-700 cursor-pointer">
                          {(activo.claveObjeto && /^\d+$/.test(String(activo.claveObjeto)) ? activo.claveObjeto : activo.id) ?? index + 1}
                        </span>
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {activo.responsable || 'Sin responsable'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className={`font-medium text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                          {activo.nombre}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Categoría: {activo.categoria}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {activo.hallado ? (
                        <CheckCircle size={20} className="text-green-500 mx-auto" />
                      ) : (
                        <XCircle size={20} className="text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        getEstadoActivoTextColor(activo.estadoActivo, activo.colorEstado)
                      }`}>
                        {activo.estadoActivo}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
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
                Observaciones: {auditoria.observaciones || 'Sin observaciones'}
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {localizados} Localizados
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {faltantes} Faltantes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default DetallesAuditoria;
