import { Search, Download, RefreshCw, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const Historial = () => {
  const { isDark } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('Todas las Acciones');

  // Datos de ejemplo del historial
  const historialData = [
    {
      id: 1,
      fecha: 'Oct 24, 2023',
      hora: '14:32 PM',
      usuario: 'Mark Smith',
      userInitials: 'MS',
      userColor: 'bg-green-600',
      assetId: 'ASSET-4921',
      accion: 'Mantenimiento',
      accionColor: 'yellow',
      cambios: 'Cambio de estado a mantenimiento',
      accionBoton: 'Ver'
    },
    {
      id: 2,
      fecha: 'Oct 24, 2023',
      hora: '09:18 AM',
      usuario: 'Jane Doe',
      userInitials: 'JD',
      userColor: 'bg-purple-600',
      assetId: 'ASSET-5002',
      accion: 'Activo',
      accionColor: 'green',
      cambios: 'Alta de activo',
      accionBoton: 'Ver'
    },
    {
      id: 3,
      fecha: 'Oct 23, 2023',
      hora: '16:45 PM',
      usuario: 'Alex Lee',
      userInitials: 'AL',
      userColor: 'bg-blue-600',
      assetId: 'ASSET-1024',
      accion: 'Mantenimiento',
      accionColor: 'yellow',
      cambios: 'Cambio de locación del activo',
      accionBoton: 'Ver'
    },
    {
      id: 4,
      fecha: 'Oct 22, 2023',
      hora: '10:20 AM',
      usuario: 'Sarah Ross',
      userInitials: 'SR',
      userColor: 'bg-red-600',
      assetId: 'ASSET-0092',
      accion: 'Retirado',
      accionColor: 'red',
      cambios: 'Baja del activo',
      subcambios: 'Autorizado por encargado con ID: 213',
      accionBoton: 'Restaurar'
    },
    {
      id: 5,
      fecha: 'Oct 21, 2023',
      hora: '09:00 AM',
      usuario: 'System Auto',
      userInitials: 'SYS',
      userColor: 'bg-orange-600',
      assetId: 'ASSET-3310',
      accion: 'Reporte generado',
      accionColor: 'blue',
      cambios: 'Se generó un reporte con la valoración de la',
      subcambios: 'presentación del semestre',
      accionBoton: 'Descargar'
    },
  ];

  const totalResults = 248;
  const resultsPerPage = 5;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const getAccionBadgeColor = (color) => {
    switch (color) {
      case 'green':
        return isDark 
          ? 'bg-green-900/30 text-green-400 border-green-800' 
          : 'bg-green-100 text-green-700 border-green-200';
      case 'yellow':
        return isDark 
          ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' 
          : 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'red':
        return isDark 
          ? 'bg-red-900/30 text-red-400 border-red-800' 
          : 'bg-red-100 text-red-700 border-red-200';
      case 'blue':
        return isDark 
          ? 'bg-blue-900/30 text-blue-400 border-blue-800' 
          : 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return isDark 
          ? 'bg-slate-700 text-slate-300 border-slate-600' 
          : 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getActionButtonStyle = (accionBoton) => {
    if (accionBoton === 'Restaurar') {
      return 'text-orange-600 hover:text-orange-700 hover:underline';
    } else if (accionBoton === 'Descargar') {
      return 'text-purple-600 hover:text-purple-700 hover:underline';
    }
    return 'text-blue-600 hover:text-blue-700 hover:underline';
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  const handleExport = () => {
    console.log('Exporting log...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
          Historial de Modificación de Activos
        </h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition ${
              isDark 
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Download size={16} />
            Export Log
          </button>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className={`rounded-xl p-6 border transition ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-slate-400' : 'text-slate-400'
            }`} size={18} />
            <input 
              type="text"
              placeholder="Búsqueda por ID o tipo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition text-sm ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-blue-500' 
                  : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <select 
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border transition text-sm appearance-none cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' 
                  : 'bg-white border-slate-300 text-slate-800 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              <option>Todas las Acciones</option>
              <option>Mantenimiento</option>
              <option>Activo</option>
              <option>Retirado</option>
              <option>Reporte generado</option>
            </select>
          </div>

          {/* Date Picker */}
          <div className="relative">
            <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-slate-400' : 'text-slate-400'
            }`} size={18} />
            <input 
              type="text"
              placeholder="Fecha DD/MM/AAAA"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition text-sm ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-blue-500' 
                  : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>
        </div>

        {/* Clear Filters */}
        <div className="mt-4 flex justify-end">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className={`rounded-xl border overflow-hidden transition ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        {/* Table Header */}
        <div className={`grid grid-cols-12 gap-4 px-6 py-4 border-b text-xs font-semibold uppercase tracking-wider ${
          isDark 
            ? 'bg-slate-900/50 border-slate-700 text-slate-400' 
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <div className="col-span-2">Fecha/Hora</div>
          <div className="col-span-2">Usuario</div>
          <div className="col-span-2">ID del Activo</div>
          <div className="col-span-2">Acción</div>
          <div className="col-span-3">Cambios</div>
          <div className="col-span-1 text-right">Acciones</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {historialData.map((item) => (
            <div 
              key={item.id} 
              className={`grid grid-cols-12 gap-4 px-6 py-4 transition ${
                isDark 
                  ? 'hover:bg-slate-700/50' 
                  : 'hover:bg-slate-50'
              }`}
            >
              {/* Fecha/Hora */}
              <div className="col-span-2 flex flex-col justify-center">
                <div className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {item.fecha}
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.hora}
                </div>
              </div>

              {/* Usuario */}
              <div className="col-span-2 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${item.userColor} flex items-center justify-center text-white text-xs font-semibold`}>
                  {item.userInitials}
                </div>
                <div className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {item.usuario}
                </div>
              </div>

              {/* ID del Activo */}
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer hover:underline">
                  {item.assetId}
                </span>
              </div>

              {/* Acción */}
              <div className="col-span-2 flex items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getAccionBadgeColor(item.accionColor)}`}>
                  {item.accion}
                </span>
              </div>

              {/* Cambios */}
              <div className="col-span-3 flex flex-col justify-center">
                <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {item.cambios}
                </div>
                {item.subcambios && (
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.subcambios}
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="col-span-1 flex items-center justify-end">
                <button className={`text-sm font-medium ${getActionButtonStyle(item.accionBoton)}`}>
                  {item.accionBoton}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className={`flex items-center justify-between px-6 py-4 border-t ${
          isDark 
            ? 'border-slate-700 bg-slate-900/50' 
            : 'border-slate-200 bg-slate-50'
        }`}>
          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Showing 1 to 5 of {totalResults} results
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border transition ${
                currentPage === 1
                  ? isDark 
                    ? 'border-slate-700 text-slate-600 cursor-not-allowed' 
                    : 'border-slate-200 text-slate-400 cursor-not-allowed'
                  : isDark 
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-700' 
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            {[1, 2, 3, '...', totalPages].map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === '...'}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : page === '...'
                    ? isDark 
                      ? 'text-slate-500 cursor-default' 
                      : 'text-slate-400 cursor-default'
                    : isDark 
                      ? 'text-slate-300 hover:bg-slate-700' 
                      : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border transition ${
                currentPage === totalPages
                  ? isDark 
                    ? 'border-slate-700 text-slate-600 cursor-not-allowed' 
                    : 'border-slate-200 text-slate-400 cursor-not-allowed'
                  : isDark 
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-700' 
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historial;
