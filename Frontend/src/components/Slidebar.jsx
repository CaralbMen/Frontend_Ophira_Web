import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, QrCode, FileText, History, Settings, Users, Moon } from 'lucide-react';

const Slidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 transition-all duration-200 rounded-lg mx-3 mb-1 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-sm' 
        : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div className="w-64 h-screen bg-white fixed left-0 top-0 flex flex-col shadow-lg border-r border-slate-200 z-50">
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <QrCode size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              Ophira <span className="text-blue-600">QR</span>
            </h1>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Assets</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 py-4">
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={18} />
          <span className="font-medium text-sm">Dashboard</span>
        </NavLink>
        <NavLink to="/assets" className={linkClass}>
          <Package size={18} />
          <span className="font-medium text-sm">Assets</span>
        </NavLink>
        <NavLink to="/qr-scanner" className={linkClass}>
          <QrCode size={18} />
          <span className="font-medium text-sm">QR Scanner</span>
        </NavLink>
        <NavLink to="/reports" className={linkClass}>
          <FileText size={18} />
          <span className="font-medium text-sm">Reports</span>
        </NavLink>
        <NavLink to="/history" className={linkClass}>
          <History size={18} />
          <span className="font-medium text-sm">History</span>
        </NavLink>
        <NavLink to="/settings" className={linkClass}>
          <Settings size={18} />
          <span className="font-medium text-sm">Settings</span>
        </NavLink>
        <NavLink to="/usuarios" className={linkClass}>
          <Users size={18} />
          <span className="font-medium text-sm">Usuarios</span>
        </NavLink>
      </nav>

      {/* Footer - User Profile */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">Admin User</p>
            <p className="text-xs text-slate-400 truncate">admin@ophira.com</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm w-full px-3 py-2 rounded-lg hover:bg-slate-50 transition">
          <Moon size={16} />
          <span>Toggle Theme</span>
        </button>
      </div>
    </div>
  );
};

export default Slidebar;