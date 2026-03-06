import { Search, Plus, ArrowUp, Wrench, TrendingUp, DollarSign, Laptop, Printer, Armchair, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { isDark } = useTheme();

  // Datos de ejemplo
  const stats = [
    { 
      label: 'TOTAL ACTIVOS', 
      value: '2,453', 
      change: '+42%', 
      icon: FileText, 
      color: 'blue',
      trend: 'up'
    },
    { 
      label: 'EN MANTENIMIENTO', 
      value: '18', 
      change: '3 overdue', 
      icon: Wrench, 
      color: 'orange',
      trend: 'warning'
    },
    { 
      label: 'AÑADIDOS RECIENTEMENTE', 
      value: '45', 
      change: 'Last 7 days', 
      icon: TrendingUp, 
      color: 'green',
      trend: 'up'
    },
    { 
      label: 'VALOR TOTAL', 
      value: '$1.2M', 
      change: '+4.5%', 
      icon: DollarSign, 
      color: 'purple',
      trend: 'up'
    },
  ];

  const actividades = [
    { nombre: 'MacBook Pro M2', codigo: 'OPH-8832', estado: 'Checked In', estadoColor: 'green', ubicacion: 'HQ - Server Room', piso: 'HQ - Floor 3', icon: Laptop },
    { nombre: 'HP LaserJet Pro', codigo: 'OPH-1820', estado: 'Maintenance', estadoColor: 'yellow', ubicacion: 'Warehouse B', piso: 'etc', icon: Printer },
    { nombre: 'Ergo Chair V2', codigo: 'OPH-4451', estado: 'Assigned', estadoColor: 'blue', ubicacion: 'Office 302', piso: 'etc', icon: Armchair },
    { nombre: 'iPad Pro 12.9', codigo: 'OPH-9921', estado: 'Lost', estadoColor: 'red', ubicacion: 'Last Seen: Lobby', piso: 'etc', icon: FileText },
  ];

  const distribucion = [
    { categoria: 'Electronics', porcentaje: 45, color: 'bg-blue-600' },
    { categoria: 'Furniture', porcentaje: 30, color: 'bg-slate-400' },
    { categoria: 'Vehicles', porcentaje: 25, color: 'bg-purple-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
            <Plus size={18} />
            Add New Asset
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`rounded-xl p-6 shadow-sm border transition ${
              isDark 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? isDark ? 'bg-blue-900/30' : 'bg-blue-100' :
                  stat.color === 'orange' ? isDark ? 'bg-orange-900/30' : 'bg-orange-100' :
                  stat.color === 'green' ? isDark ? 'bg-green-900/30' : 'bg-green-100' :
                  isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}>
                  <Icon className={
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'orange' ? 'text-orange-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    'text-purple-600'
                  } size={20} />
                </div>
              </div>
              <h3 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{stat.value}</h3>
              <p className={`text-sm flex items-center gap-1 ${
                stat.trend === 'warning' ? 'text-orange-600' : 'text-green-600'
              }`}>
                {stat.trend === 'up' && <ArrowUp size={14} />}
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución de Activos */}
        <div className={`rounded-xl p-6 shadow-sm border transition ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Distribución de Activos</h2>
            <button className={`${isDark ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}>•••</button>
          </div>
          
          {/* Donut Chart Placeholder */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#2563eb" strokeWidth="12" 
                  strokeDasharray="113 251" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={isDark ? '#64748b' : '#94a3b8'} strokeWidth="12" 
                  strokeDasharray="75 251" strokeDashoffset="-113" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#9333ea" strokeWidth="12" 
                  strokeDasharray="63 251" strokeDashoffset="-188" />
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {distribucion.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.categoria}</span>
                </div>
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.porcentaje}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className={`lg:col-span-2 rounded-xl p-6 shadow-sm border transition ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Actividad Reciente</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <tr>
                  <th className={`text-left text-xs font-semibold uppercase pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Nombre</th>
                  <th className={`text-left text-xs font-semibold uppercase pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>QR Código</th>
                  <th className={`text-left text-xs font-semibold uppercase pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Estado</th>
                  <th className={`text-left text-xs font-semibold uppercase pb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ubicación</th>
                </tr>
              </thead>
              <tbody>
                {actividades.map((actividad, index) => {
                  const Icon = actividad.icon;
                  return (
                    <tr key={index} className={`border-b ${isDark ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50'} last:border-0 transition`}>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                            <Icon size={16} className={isDark ? 'text-slate-300' : 'text-slate-600'} />
                          </div>
                          <div>
                            <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{actividad.nombre}</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{actividad.codigo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{actividad.codigo}</span>
                      </td>
                      <td className="py-4">
                        <span className={`text-xs font-medium ${
                          actividad.estadoColor === 'green' ? 'text-green-600' :
                          actividad.estadoColor === 'yellow' ? 'text-yellow-600' :
                          actividad.estadoColor === 'blue' ? 'text-blue-600' :
                          'text-red-600'
                        }`}>
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