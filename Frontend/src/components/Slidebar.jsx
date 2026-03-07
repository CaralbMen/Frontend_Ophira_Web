import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, QrCode, FileText, History, Settings, Users, Moon, Sun, LogOut, ClipboardCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import OphiraLogo from '../assets/OphiraLogo.png';

const Slidebar = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 transition-all duration-200 rounded-lg mx-3 mb-1 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-sm' 
        : isDark
          ? 'text-slate-300 hover:bg-slate-800'
          : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div className={`w-64 h-screen fixed left-0 top-0 flex flex-col shadow-lg border-r z-50 transition-colors duration-200 ${
      isDark 
        ? 'bg-slate-900 border-slate-700' 
        : 'bg-white border-slate-200'
    }`}>
      <div className="px-6 py-6">
        <div className="flex items-center gap-2">
          <img src={OphiraLogo} alt="Ophira" className="w-10 h-10 aspect-square object-cover" />
          <div>
            <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Ophira <span className="text-blue-600">QR</span>
            </h1>
            <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>v1.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4">
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={18} />
          <span className="font-medium text-sm">Dashboard</span>
        </NavLink>
        <NavLink to="/activos" className={linkClass}>
          <Package size={18} />
          <span className="font-medium text-sm">Activos</span>
        </NavLink>
        <NavLink to="/scanner" className={linkClass}>
          <QrCode size={18} />
          <span className="font-medium text-sm">Leer QR</span>
        </NavLink>
        <NavLink to="/reportes" className={linkClass}>
          <FileText size={18} />
          <span className="font-medium text-sm">Reportes</span>
        </NavLink>
        <NavLink to="/historial" className={linkClass}>
          <History size={18} />
          <span className="font-medium text-sm">Historial</span>
        </NavLink>
        <NavLink to="/auditorias" className={linkClass}>
          <ClipboardCheck size={18} />
          <span className="font-medium text-sm">Auditorias</span>
        </NavLink>
        <NavLink to="/usuarios" className={linkClass}>
          <Users size={18} />
          <span className="font-medium text-sm">Usuarios</span>
        </NavLink>
      </nav>

      <div className={`p-4 border-t transition-colors duration-200 ${
        isDark ? 'border-slate-700' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>Nombre Usuario</p>
            <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>correo@gmail.com</p>
          </div>
        </div>
        <button 
          onClick={toggleTheme}
          className={`flex items-center gap-2 text-sm w-full px-3 py-2 rounded-lg transition ${
            isDark
              ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          <span>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
        </button>
        <button 
          onClick={() => navigate('/login')}
          className={`flex items-center gap-2 text-sm w-full px-3 py-2 rounded-lg transition ${
            isDark
              ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}>
          <LogOut size={16} color={'red'}/>
          <span className='text-red-500'>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Slidebar;