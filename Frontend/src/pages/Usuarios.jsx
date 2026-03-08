import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Usuarios = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Datos de ejemplo
  const usuarios = [
    {
      id: '1',
      nombre_usuario: 'Carlos',
      apaterno_usuario: 'Mendoza',
      amaterno_usuario: 'García',
      correo_usuario: 'carlos.mendoza@institution.com',
      pwd_usuario: 'password123',
      telefono_usuario: '+34 912 345 678',
      fecha_registro_usuario: '2023-08-10',
      FK_id_rol: '1',
      FK_id_puesto: '1',
      nombre: 'Carlos Mendoza García',
      rol: 'Administrador',
      puesto: 'Director',
      email: 'carlos.mendoza@institution.com',
      telefono: '+34 912 345 678',
      estado: 'Activo',
      estadoColor: 'green',
      fecha: 'Aug 10, 2023',
    },
    {
      id: '2',
      nombre_usuario: 'Daniyel',
      apaterno_usuario: 'Paulín',
      amaterno_usuario: 'López',
      correo_usuario: 'daniyel.paulin@institution.com',
      pwd_usuario: 'password123',
      telefono_usuario: '+34 912 345 679',
      fecha_registro_usuario: '2023-09-15',
      FK_id_rol: '2',
      FK_id_puesto: '2',
      nombre: 'Daniyel Paulín López',
      rol: 'Auditor',
      puesto: 'Coordinador',
      email: 'daniyel.paulin@institution.com',
      telefono: '+34 912 345 679',
      estado: 'Activo',
      estadoColor: 'green',
      fecha: 'Sep 15, 2023',
    },
    {
      id: '3',
      nombre_usuario: 'María',
      apaterno_usuario: 'Rodríguez',
      amaterno_usuario: 'Fernández',
      correo_usuario: 'maria.rodriguez@institution.com',
      pwd_usuario: 'password123',
      telefono_usuario: '+34 912 345 680',
      fecha_registro_usuario: '2023-10-01',
      FK_id_rol: '3',
      FK_id_puesto: '3',
      nombre: 'María Rodríguez Fernández',
      rol: 'Usuario',
      puesto: 'Técnico',
      email: 'maria.rodriguez@institution.com',
      telefono: '+34 912 345 680',
      estado: 'Activo',
      estadoColor: 'green',
      fecha: 'Oct 01, 2023',
    },
    {
      id: '4',
      nombre_usuario: 'Juan',
      apaterno_usuario: 'Pérez',
      amaterno_usuario: 'Sánchez',
      correo_usuario: 'juan.perez@institution.com',
      pwd_usuario: 'password123',
      telefono_usuario: '+34 912 345 681',
      fecha_registro_usuario: '2023-11-12',
      FK_id_rol: '4',
      FK_id_puesto: '4',
      nombre: 'Juan Pérez Sánchez',
      rol: 'Supervisor',
      puesto: 'Asistente',
      email: 'juan.perez@institution.com',
      telefono: '+34 912 345 681',
      estado: 'Activo',
      estadoColor: 'green',
      fecha: 'Nov 12, 2023',
    },
    {
      id: '5',
      nombre_usuario: 'Ana',
      apaterno_usuario: 'Gómez',
      amaterno_usuario: 'Martínez',
      correo_usuario: 'ana.gomez@institution.com',
      pwd_usuario: 'password123',
      telefono_usuario: '+34 912 345 682',
      fecha_registro_usuario: '2023-12-05',
      FK_id_rol: '3',
      FK_id_puesto: '5',
      nombre: 'Ana Gómez Martínez',
      rol: 'Usuario',
      puesto: 'Consultor',
      email: 'ana.gomez@institution.com',
      telefono: '+34 912 345 682',
      estado: 'Inactivo',
      estadoColor: 'red',
      fecha: 'Dec 05, 2023',
    },
  ];

  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case 'Activo':
        return 'text-green-600 font-semibold';
      case 'Inactivo':
        return 'text-red-600 font-semibold';
      default:
        return 'text-slate-600 font-semibold';
    }
  };

  return (
    <div className="space-y-4">
      
      <div className="flex items-center justify-between pb-2">
        <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Gestión de Usuarios</h1>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Administra los perfiles y permisos de usuarios</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition" onClick={() => navigate('/usuarios/nuevo')}>
            <Plus size={16} />
            Nuevo Usuario
          </button>
        </div>
      </div>

      <div className={`rounded-lg p-4 border transition ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o email"
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
            <option>Todos los roles</option>
            <option>Administrador</option>
            <option>Auditor</option>
            <option>Usuario</option>
            <option>Supervisor</option>
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
                  USUARIO
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  EMAIL
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  TELÉFONO
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ROL
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  PUESTO
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ESTADO
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  FECHA REGISTRO
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className={`transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                  <td className="px-4 py-3">
                    <div>
                      <p className={`font-medium text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{usuario.nombre}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ID: {usuario.id}</p>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {usuario.email}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {usuario.telefono}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {usuario.rol}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {usuario.puesto}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold ${getEstadoBadgeColor(usuario.estado)}`}>
                      {usuario.estado}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {usuario.fecha}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className={`p-2 rounded-lg transition ${
                        isDark
                          ? 'text-slate-500 hover:text-blue-400 hover:bg-blue-900/20'
                          : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                        onClick={()=>navigate(`/usuarios/editar/${usuario.id}`,{
                          state:{
                            modo: 'editar',
                            usuario: usuario
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
                        onClick={()=>navigate(`/usuarios/eliminar/${usuario.id}`,{
                          state:{
                            modo: 'eliminar',
                            usuario: usuario
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

export default Usuarios;
