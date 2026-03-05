import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Slidebar = () => {

  const navigate = useNavigate();
//   const salir = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 transition-all duration-200 rounded-lg mx-2 mb-1 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="w-64 h-screen bg-slate-900 text-white fixed left-0 top-0 flex flex-col shadow-xl z-50">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold tracking-wider">
          Oph<span className="text-blue-500">ira</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">V 1.0</p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 mt-6">
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/login" className={linkClass}>
          <ShoppingBag size={20} /> Login
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <button  className="flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-slate-800 w-full px-4 py-3 rounded-lg transition">
          <LogOut size={20} /> Salir
        </button>

      </div>
    </div>
  );
};

export default Slidebar;