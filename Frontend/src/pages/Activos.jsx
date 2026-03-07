import { Search, Plus, Download, Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
const Activos = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  // Datos de ejemplo
  const activos = [
    {
      id: '10024',
      nombre_activo: 'Dell Latitude 5520',
      marca_activo: 'Dell',
      Modelo_activo: 'Latitude 5520',
      descripcion_activo: 'Laptop para desarrollo',
      precio_original: '1200.00',
      valor_residual: '800.00',
      vida_util: '5',
      fecha_compra_activo: '2023-10-24',
      FK_id_responsable_activo: '1',
      FK_id_categoria: '1',
      FK_id_estado: '1',
      FK_id_aula: '1',
      multiparte: false,
      nombre: 'Dell Latitude 5520',
      responsable: 'Carlos Mendoza',
      categoria: 'Electronicos',
      ubicacion: 'Aula C107',
      estado: 'Activo',
      estadoColor: 'green',
      fecha: 'Oct 24, 2023',
    },
    {
      id: '10025',
      nombre_activo: 'Herman Miller Aeron',
      marca_activo: 'Herman Miller',
      Modelo_activo: 'Aeron',
      descripcion_activo: 'Silla ergonómica de oficina',
      precio_original: '1500.00',
      valor_residual: '1200.00',
      vida_util: '10',
      fecha_compra_activo: '2023-10-22',
      FK_id_responsable_activo: '2',
      FK_id_categoria: '2',
      FK_id_estado: '1',
      FK_id_aula: '2',
      multiparte: false,
      nombre: 'Herman Miller Aeron',
      responsable: 'Daniyel Paulín',
      categoria: 'Muebles',
      ubicacion: 'Laboratorio B1',
      estado: 'Activo',
      estadoColor: 'green',
      fecha: 'Oct 22, 2023',
    },
    {
      id: '10031',
      nombre_activo: 'Industrial Printer HP',
      marca_activo: 'HP',
      Modelo_activo: 'LaserJet Enterprise',
      descripcion_activo: 'Impresora industrial de alta capacidad',
      precio_original: '3500.00',
      valor_residual: '2800.00',
      vida_util: '7',
      fecha_compra_activo: '2023-09-15',
      FK_id_responsable_activo: '1',
      FK_id_categoria: '1',
      FK_id_estado: '2',
      FK_id_aula: '3',
      multiparte: false,
      nombre: 'Industrial Printer HP',
      responsable: 'Carlos Mendoza',
      categoria: 'Electronicos',
      ubicacion: 'Audiovisual A',
      estado: 'Mantenimiento',
      estadoColor: 'yellow',
      fecha: 'Sep 15, 2023',
    },
    {
      id: '10042',
      nombre_activo: 'Forklift Toyota 8F',
      marca_activo: 'Toyota',
      Modelo_activo: '8FD25',
      descripcion_activo: 'Montacargas de 2.5 toneladas',
      precio_original: '25000.00',
      valor_residual: '20000.00',
      vida_util: '15',
      fecha_compra_activo: '2023-01-10',
      FK_id_responsable_activo: '1',
      FK_id_categoria: '3',
      FK_id_estado: '1',
      FK_id_aula: '4',
      multiparte: false,
      nombre: 'Forklift Toyota 8F',
      responsable: 'Carlos Mendoza',
      categoria: 'Vehiculos',
      ubicacion: 'Audiovisual LT1',
      estado: 'Activo',
      estadoColor: 'green',
      fecha: 'Jan 10, 2023',
    },
    {
      id: '10050',
      nombre_activo: 'Projector Epson 3000',
      marca_activo: 'Epson',
      Modelo_activo: 'PowerLite 3000',
      descripcion_activo: 'Proyector multimedia de alta resolución',
      precio_original: '1800.00',
      valor_residual: '200.00',
      vida_util: '5',
      fecha_compra_activo: '2022-11-05',
      FK_id_responsable_activo: '1',
      FK_id_categoria: '1',
      FK_id_estado: '4',
      FK_id_aula: '1',
      multiparte: false,
      nombre: 'Projector Epson 3000',
      responsable: 'Carlos Mendoza',
      categoria: 'Electronicos',
      ubicacion: 'Oficina 5, piso 2, edificio A',
      estado: 'Retirado',
      estadoColor: 'red',
      fecha: 'Nov 05, 2022',
    },
  ];

  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case 'Activo':
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
            Exportar
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition" onClick={() => navigate('/activos/nuevo')}>
            <Plus size={16} />
            Nuevo Activo
          </button>
        </div>
      </div>

      <div className={`rounded-lg p-4 border transition ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Responsable: {activo.responsable}</p>
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
                      }`}
                        onClick={()=>navigate(`/activos/editar/${activo.id}`,{
                          state:{
                            modo: 'editar',
                            activo: activo
                          }
                        })}
                      >
                        <Edit size={18} />
                      </button>
                      <button className={`p-2 rounded-lg transition ${
                        isDark
                          ? 'text-slate-500 hover:text-red-400 hover:bg-red-900/20'
                          : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                        onClick={()=>navigate(`/activos/eliminar/${activo.id}`,{
                          state:{
                            modo: 'eliminar',
                            activo: activo
                          }
                        })}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
      </div>
    </div>
  );
};

export default Activos;