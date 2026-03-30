import { FileText, Download, TrendingUp, CheckCircle, AlertCircle, DollarSign, MoreVertical } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const toNumber = (value) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const moneyMx = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2
});

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha';
  const date = new Date(fecha);
  return Number.isNaN(date.getTime()) ? 'Sin fecha' : date.toLocaleDateString('es-MX');
};

const Reportes = () => {
  const { isDark } = useTheme();
  const [dateRange, setDateRange] = useState('30');
  const [reporteData, setReporteData] = useState({
    total_activos: '0',
    bienes_activos: '0',
    activos_en_mantenimiento: '0',
    aniadidos_recientemente: '0',
    valor_total: '0',
    enero: '0',
    febrero: '0',
    marzo: '0',
    abril: '0',
    mayo: '0',
    junio: '0',
    julio: '0',
    agosto: '0',
    septiembre: '0',
    octubre: '0',
    noviembre: '0',
    diciembre: '0'
  });
  const [activos, setActivos] = useState([]);

  useEffect(() => {
    const cargarDatosReporte = async () => {
      try {
        const [reporteResponse, activosResponse] = await Promise.all([
          api.get('assets/reporte'),
          api.get('assets/activos')
        ]);

        const reporteRaw = reporteResponse?.rows ?? reporteResponse;
        const reporteObj = Array.isArray(reporteRaw) ? reporteRaw[0] : reporteRaw;

        const activosRaw = activosResponse?.rows ?? activosResponse;
        const activosList = Array.isArray(activosRaw) ? activosRaw : [];

        setReporteData(reporteObj || {});
        setActivos(activosList);
      } catch (error) {
        console.error('Error al cargar reportes:', error);
      }
    };

    cargarDatosReporte();
  }, []);

  const activosFiltradosPorRango = useMemo(() => {
    const dias = Number(dateRange || 30);
    const ahora = new Date();
    const msRango = dias * 24 * 60 * 60 * 1000;

    return activos.filter((activo) => {
      const fecha = new Date(activo.fecha_registro);
      if (Number.isNaN(fecha.getTime())) return false;
      return (ahora.getTime() - fecha.getTime()) <= msRango;
    });
  }, [activos, dateRange]);

  const totalActivos = activosFiltradosPorRango.length || toNumber(reporteData.total_activos);
  const bienesActivos = activosFiltradosPorRango.filter((a) => String(a.estado).toLowerCase() === 'activo').length || toNumber(reporteData.bienes_activos);
  const enMantenimiento = activosFiltradosPorRango.filter((a) => String(a.estado).toLowerCase() === 'mantenimiento').length || toNumber(reporteData.activos_en_mantenimiento);
  const aniadidosRecientes = activosFiltradosPorRango.length || toNumber(reporteData.aniadidos_recientemente);
  const valorTotal = toNumber(reporteData.valor_total);
  const retirados = Math.max(totalActivos - bienesActivos - enMantenimiento, 0);

  const stats = [
    {
      label: 'Total de Activos',
      value: totalActivos.toLocaleString('es-MX'),
      change: `${aniadidosRecientes} recientes`,
      description: 'Total registrado',
      icon: FileText,
      color: 'blue',
    },
    {
      label: 'Bienes Activos',
      value: bienesActivos.toLocaleString('es-MX'),
      change: `${totalActivos > 0 ? ((bienesActivos * 100) / totalActivos).toFixed(1) : '0.0'}%`,
      description: 'Activos vigentes',
      icon: CheckCircle,
      color: 'green',
    },
    {
      label: 'Mantenimiento',
      value: enMantenimiento.toLocaleString('es-MX'),
      change: 'Activos en revisión',
      description: 'Activos en mantenimiento',
      icon: AlertCircle,
      color: 'orange',
    },
    {
      label: 'Valor Total',
      value: moneyMx.format(valorTotal),
      change: 'Inventario actual',
      description: 'Valor contable',
      icon: DollarSign,
      color: 'purple',
    },
  ];

  const acquisitionData = [
    { month: 'Enero', value: toNumber(reporteData.enero) },
    { month: 'Febrero', value: toNumber(reporteData.febrero) },
    { month: 'Marzo', value: toNumber(reporteData.marzo) },
    { month: 'Abril', value: toNumber(reporteData.abril) },
    { month: 'Mayo', value: toNumber(reporteData.mayo) },
    { month: 'Junio', value: toNumber(reporteData.junio) },
    { month: 'Julio', value: toNumber(reporteData.julio) },
    { month: 'Agosto', value: toNumber(reporteData.agosto) },
    { month: 'Septiembre', value: toNumber(reporteData.septiembre) },
    { month: 'Octubre', value: toNumber(reporteData.octubre) },
    { month: 'Noviembre', value: toNumber(reporteData.noviembre) },
    { month: 'Diciembre', value: toNumber(reporteData.diciembre) },
  ];

  const maxValue = Math.max(...acquisitionData.map(d => d.value), 1);

  const recentActivities = activosFiltradosPorRango.slice(0, 10).map((activo) => ({
    activo: activo.nombre,
    responsable: activo.responsable,
    id: activo.id_activo,
    categoria: activo.categoria,
    estado: activo.estado,
    estadoColor: activo.color,
    ubicacion: `${activo.aula} (${activo.tipo_aula})`,
    fecha: formatearFecha(activo.fecha_registro),
    accion: 'Registro de activo',
  }));

  const statusDistribution = [
    { label: 'Activo', value: totalActivos > 0 ? (bienesActivos * 100) / totalActivos : 0, color: '#10b981' },
    { label: 'Mantenimiento', value: totalActivos > 0 ? (enMantenimiento * 100) / totalActivos : 0, color: '#f59e0b' },
    { label: 'Retirado', value: totalActivos > 0 ? (retirados * 100) / totalActivos : 0, color: '#6b7280' },
  ];

  const estadoColorClass = (color) => {
    if (color === 'green') return 'text-green-600';
    if (color === 'yellow') return 'text-yellow-600';
    if (color === 'red') return 'text-red-600';
    if (color === 'blue') return 'text-blue-600';
    return 'text-slate-500';
  };

  const getStatColor = (color) => {
    const colors = {
      blue: isDark ? 'bg-blue-900/30' : 'bg-blue-100',
      green: isDark ? 'bg-green-900/30' : 'bg-green-100',
      orange: isDark ? 'bg-orange-900/30' : 'bg-orange-100',
      purple: isDark ? 'bg-purple-900/30' : 'bg-purple-100',
    };
    return colors[color];
  };

  const getStatIconColor = (color) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      purple: 'text-purple-600',
    };
    return colors[color];
  };

  const exportarPdfReporte = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const fechaActual = new Date().toLocaleDateString('es-MX');
    const rangoTexto = dateRange === '30' ? 'Tras 30 dias' : dateRange === '90' ? 'Tras 90 dias' : 'Tras 1 anio';

    doc.setFontSize(16);
    doc.text('Reporte de Activos', 40, 40);
    doc.setFontSize(10);
    doc.text(`Fecha de generacion: ${fechaActual}`, 40, 60);
    doc.text(`Rango aplicado: ${rangoTexto}`, 260, 60);

    doc.setFontSize(11);
    doc.text(`Total de Activos: ${totalActivos}`, 40, 90);
    doc.text(`Bienes Activos: ${bienesActivos}`, 220, 90);
    doc.text(`Mantenimiento: ${enMantenimiento}`, 400, 90);
    doc.text(`Valor Total: ${moneyMx.format(valorTotal)}`, 560, 90);

    autoTable(doc, {
      startY: 110,
      head: [['Estado', 'Porcentaje']],
      body: statusDistribution.map((item) => [item.label, `${item.value.toFixed(1)}%`]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] },
      tableWidth: 260,
      margin: { left: 40 },
    });

    autoTable(doc, {
      startY: 110,
      head: [['Activo', 'Categoria', 'Responsable', 'Estado', 'Ultima vista', 'Accion']],
      body: recentActivities.map((item) => [
        item.activo,
        item.categoria,
        item.responsable,
        item.estado,
        `${item.fecha} - ${item.ubicacion}`,
        item.accion,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 320 },
      tableWidth: 470,
    });

    doc.save(`reporte_activos_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Análisis y Reportes
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${
              isDark
                ? 'bg-slate-700 border-slate-600 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <option value="30">Tras 30 días</option>
            <option value="90">Tras 90 días</option>
            <option value="365">Tras 1 año</option>
          </select>
          <button
            onClick={exportarPdfReporte}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition ${
            isDark
              ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}>
            <Download size={16} />
            Exportar PDF
          </button>
        
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`rounded-lg p-4 border transition ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatColor(stat.color)}`}>
                  <Icon className={`${getStatIconColor(stat.color)}`} size={20} />
                </div>
                <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                  <TrendingUp size={12} />
                  {stat.change}
                </span>
              </div>
              <p className={`text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {stat.label}
              </p>
              <h3 className={`text-2xl font-bold my-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {stat.value}
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 rounded-lg border p-6 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Adquisición de Activos
            </h3>
            <button className={`p-1 rounded hover:${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <MoreVertical size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
            </button>
          </div>

          <div className="relative h-72">
            <svg className="w-full h-full" viewBox="0 0 600 250">
              {[0, 20, 40].map((y) => (
                <line
                  key={y}
                  x1="40"
                  y1={50 + (y / 40) * 150}
                  x2="580"
                  y2={50 + (y / 40) * 150}
                  stroke={isDark ? '#475569' : '#e2e8f0'}
                  strokeWidth="1"
                />
              ))}

              <line x1="40" y1="50" x2="40" y2="200" stroke={isDark ? '#64748b' : '#cbd5e1'} strokeWidth="2" />
              <line x1="40" y1="200" x2="580" y2="200" stroke={isDark ? '#64748b' : '#cbd5e1'} strokeWidth="2" />

              {[0, 20, 40].map((y) => (
                <text key={`ylbl-${y}`} x="30" y={205 - (y / 40) * 150} textAnchor="end" fontSize="12" fill={isDark ? '#94a3b8' : '#64748b'}>
                  {y}
                </text>
              ))}

              <polyline
                points={acquisitionData.map((d, i) => {
                  const x = 40 + (i / (acquisitionData.length - 1)) * 540;
                  const y = 200 - (d.value / maxValue) * 150;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />

              <polygon
                points={[
                  '40,200',
                  ...acquisitionData.map((d, i) => {
                    const x = 40 + (i / (acquisitionData.length - 1)) * 540;
                    const y = 200 - (d.value / maxValue) * 150;
                    return `${x},${y}`;
                  }),
                  '580,200',
                ].join(' ')}
                fill="#3b82f6"
                fillOpacity="0.1"
              />

              {acquisitionData.map((d, i) => {
                const x = 40 + (i / (acquisitionData.length - 1)) * 540;
                const y = 200 - (d.value / maxValue) * 150;
                return (
                  <circle key={i} cx={x} cy={y} r="3.5" fill="#3b82f6" />
                );
              })}

              {acquisitionData.map((d, i) => (
                <text
                  key={`xlabel-${i}`}
                  x={40 + (i / (acquisitionData.length - 1)) * 540}
                  y="220"
                  textAnchor="middle"
                  fontSize="12"
                  fill={isDark ? '#94a3b8' : '#64748b'}
                >
                  {d.month}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Donut Chart */}
        <div className={`rounded-lg border p-6 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Estatus de Activos
            </h3>
            <button className={`p-1 rounded hover:${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <MoreVertical size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-6">
            <svg className="w-40 h-40" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke={statusDistribution[0].color} strokeWidth="20" strokeDasharray={`${statusDistribution[0].value * 3.14 / 100 * 50 * 2} ${314}`} transform="rotate(-90 60 60)" />
              <circle cx="60" cy="60" r="50" fill="none" stroke={statusDistribution[1].color} strokeWidth="20" strokeDasharray={`${statusDistribution[1].value * 3.14 / 100 * 50 * 2} ${314}`} strokeDashoffset={`${-statusDistribution[0].value * 3.14 / 100 * 50 * 2}`} transform="rotate(-90 60 60)" />
              <circle cx="60" cy="60" r="50" fill="none" stroke={statusDistribution[2].color} strokeWidth="20" strokeDasharray={`${statusDistribution[2].value * 3.14 / 100 * 50 * 2} ${314}`} strokeDashoffset={`${-(statusDistribution[0].value + statusDistribution[1].value) * 3.14 / 100 * 50 * 2}`} transform="rotate(-90 60 60)" />
              <circle cx="60" cy="60" r="35" fill={isDark ? '#1e293b' : '#ffffff'} />
            </svg>

            <div className="space-y-2 w-full">
              {statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="p-6 border-b" style={{ borderColor: isDark ? '#475569' : '#e2e8f0' }}>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Actividad Reciente
            </h3>
            <button className={`text-sm font-medium text-blue-600 hover:text-blue-700`}>
              Ver Todo
            </button>
          </div>
        </div>

        <div className="max-h-[28rem] overflow-auto">
          <table className="w-full">
            <thead className={`border-b ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ACTIVO
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  CATEGORIA
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  RESPONSABLE
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ESTADO
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ÚLTIMA VISTA
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ACCION
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {recentActivities.map((activity, index) => (
                <tr key={index} className={`transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className={isDark ? 'text-slate-500' : 'text-slate-400'} size={18} />
                      <div>
                        <p className={`font-medium text-sm ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                          {activity.activo}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          ID: {activity.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {activity.categoria}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {activity.responsable}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold ${estadoColorClass(activity.estadoColor)}`}>
                      {activity.estado}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {activity.fecha} <br />
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      En {activity.ubicacion}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {activity.accion}
                  </td>
                </tr>
              ))}
              {recentActivities.length === 0 && (
                <tr>
                  <td colSpan={6} className={`px-6 py-6 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    No hay actividad registrada para el rango seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
