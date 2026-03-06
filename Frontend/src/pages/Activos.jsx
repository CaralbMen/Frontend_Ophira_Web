import { Search, Plus, Download, Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Activos = () => {
  const { isDark } = useTheme();
  // Datos de ejemplo
  const activos = [
    {
      id: 'OPH-10024',
      nombre: 'Dell Latitude 5520',
      descripcion: 'Office Laptop',
      categoria: 'Electronics',
      ubicacion: 'HQ - Floor 3',
      estado: 'Active',
      estadoColor: 'green',
      fecha: 'Oct 24, 2023',
    },
    {
      id: 'OPH-10025',
      nombre: 'Herman Miller Aeron',
      descripcion: 'Ergonomic Chair',
      categoria: 'Furniture',
      ubicacion: 'HQ - Conf Room A',
      estado: 'Active',
      estadoColor: 'green',
      fecha: 'Oct 22, 2023',
    },
    {
      id: 'OPH-10031',
      nombre: 'Industrial Printer HP',
      descripcion: 'Large Format',
      categoria: 'Electronics',
      ubicacion: 'Warehouse B',
      estado: 'Mantenimiento',
      estadoColor: 'yellow',
      fecha: 'Sep 15, 2023',
    },
    {
      id: 'OPH-09882',
      nombre: 'Forklift Toyota 8F',
      descripcion: 'Heavy Duty',
      categoria: 'Machinery',
      ubicacion: 'Distribution Center',
      estado: 'Active',
      estadoColor: 'green',
      fecha: 'Jan 10, 2023',
    },
    {
      id: 'OPH-08110',
      nombre: 'Projector Epson 3000',
      descripcion: 'Meeting Room 2',
      categoria: 'Electronics',
      ubicacion: 'Storage',
      estado: 'Retirado',
      estadoColor: 'red',
      fecha: 'Nov 05, 2022',
    },
  ];

  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case 'Active':
        return 'text-green-600 font-semibold';
      case 'Mantenimiento':
        return 'text-yellow-600 font-semibold';
      case 'Retirado':
        return 'text-red-600 font-semibold';
      default:
        return 'text-slate-600 font-semibold';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Inventario de Activos</h1>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gestiona y monitorea todos tus activos</p>
        </div>
        <div className="flex items-center gap-2">
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition ${
            isDark 
              ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}>
            <Download size={16} />
            Export
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            <Plus size={16} />
            Add New Asset
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className={`rounded-lg p-4 border transition ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Búsqueda */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
            <input
              type="text"
              placeholder="Buscar por ID o nombre"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Categoría */}
          <select className={`px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${
            isDark
              ? 'bg-slate-700 border-slate-600 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <option>Todas las categorías</option>
            <option>Electronics</option>
            <option>Furniture</option>
            <option>Machinery</option>
            <option>Vehicles</option>
          </select>

          {/* Estado */}
          <select className={`px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${
            isDark
              ? 'bg-slate-700 border-slate-600 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <option>Todos los estados</option>
            <option>Active</option>
            <option>Mantenimiento</option>
            <option>Retirado</option>
          </select>
        </div>
      </div>

      {/* Tabla de activos */}
      <div className={`rounded-lg border overflow-hidden transition ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b transition ${
              isDark
                ? 'bg-slate-700 border-slate-600'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ACTIVO ID
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  NOMBRE
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  CATEGORIA
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  UBICACION
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ESTADO
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  FECHA
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {activos.map((activo) => (
                <tr key={activo.id} className={`transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                  <td className="px-4 py-3">
                    <span className={`font-semibold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{activo.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className={`font-medium text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{activo.nombre}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{activo.descripcion}</p>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{activo.categoria}</td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{activo.ubicacion}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold ${getEstadoBadgeColor(activo.estado)}`}>
                      {activo.estado}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{activo.fecha}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className={`p-2 rounded-lg transition ${
                        isDark
                          ? 'text-slate-500 hover:text-blue-400 hover:bg-blue-900/20'
                          : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                      }`}>
                        <Edit size={18} />
                      </button>
                      <button className={`p-2 rounded-lg transition ${
                        isDark
                          ? 'text-slate-500 hover:text-red-400 hover:bg-red-900/20'
                          : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                      }`}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className={`px-4 py-3 border-t flex items-center justify-between transition ${
          isDark
            ? 'bg-slate-700 border-slate-600'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Showing 1 to 5 of 42 results</p>
          <div className="flex items-center gap-1">
            <button className={`px-2 py-1 rounded border text-xs transition ${
              isDark
                ? 'border-slate-600 text-slate-300 hover:bg-slate-600'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}>
              &lt;
            </button>
            <button className="px-2 py-1 rounded bg-blue-600 text-white text-xs">1</button>
            <button className={`px-2 py-1 rounded border text-xs transition ${
              isDark
                ? 'border-slate-600 text-slate-300 hover:bg-slate-600'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}>
              2
            </button>
            <button className={`px-2 py-1 rounded border text-xs transition ${
              isDark
                ? 'border-slate-600 text-slate-300 hover:bg-slate-600'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}>
              3
            </button>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>...</span>
            <button className={`px-2 py-1 rounded border text-xs transition ${
              isDark
                ? 'border-slate-600 text-slate-300 hover:bg-slate-600'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}>
              8
            </button>
            <button className={`px-2 py-1 rounded border text-xs transition ${
              isDark
                ? 'border-slate-600 text-slate-300 hover:bg-slate-600'
                : 'border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}>
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activos;