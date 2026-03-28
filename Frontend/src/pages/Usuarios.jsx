import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {api} from '../services/api';

const formatearFecha = (fecha) => {
  if (!fecha) return '';

  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return String(fecha);

  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

const Usuarios = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(()=>{
    const getUsuarios= async()=>{
      try{
        const response = await api.get('usuarios');
        setUsuarios(response);
        console.log(response);
      } catch (error) {
        console.error('Error fetching usuarios:', error);
      }
    }
    getUsuarios();

  }, [])
  

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
                <tr key={usuario.id_usuario} className={`transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                  <td className="px-4 py-3">
                    <div>
                      <p 
                        onClick={() => navigate(`/perfil/${usuario.id_usuario}`)}
                        className={`font-medium text-sm cursor-pointer hover:text-blue-600 transition ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
                      >
                        {usuario.nombre_usuario} {usuario.apellido_paterno} {usuario.apellido_materno}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ID: {usuario.id_usuario}</p>
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
                    <span className={`text-xs font-semibold ${usuario.activo ? 'text-green-600' : 'text-red-600'}`}>
                      {usuario.activo? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {formatearFecha(usuario.fecha_registro ?? usuario.fecha_registro_usuario)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className={`p-2 rounded-lg transition ${
                        isDark
                          ? 'text-slate-500 hover:text-blue-400 hover:bg-blue-900/20'
                          : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                        onClick={()=>navigate(`/usuarios/editar/${usuario.id_usuario}`,{
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
                        onClick={()=>navigate(`/usuarios/eliminar/${usuario.id_usuario}`,{
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
