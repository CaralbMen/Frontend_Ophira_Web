import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, QrCode, FileText, History, Settings, Users, Moon, Sun, LogOut, ClipboardCheck, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useMemo, useState } from 'react';
import OphiraLogo from '../assets/OphiraLogo.png';
import { clearToken, getToken } from '../services/authStorage';
import { api } from '../services/api';

const Slidebar = ({ isOpen = false, onClose = () => {} }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [usuarioSidebar, setUsuarioSidebar] = useState(null);

  const obtenerIdUsuarioDesdeToken = () => {
    try {
      const token = getToken();
      if (!token) return null;

      const payloadPart = token.split('.')[1];
      if (!payloadPart) return null;

      const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      const id = Number(payload?.id);
      return Number.isFinite(id) ? id : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const cargarUsuario = async () => {
      const idUsuario = obtenerIdUsuarioDesdeToken();
      if (!idUsuario) {
        setUsuarioSidebar(null);
        return;
      }

      try {
        const usuario = await api.get(`usuarios/${idUsuario}`);
        setUsuarioSidebar(usuario);
      } catch (error) {
        console.error('No se pudo cargar el usuario del sidebar:', error);
        setUsuarioSidebar(null);
      }
    };

    cargarUsuario();
  }, []);

  const nombreMostrado = useMemo(() => {
    const nombre = String(usuarioSidebar?.nombre_usuario || '').trim();
    const apPaterno = String(usuarioSidebar?.apellido_paterno || '').trim();
    const apMaterno = String(usuarioSidebar?.apellido_materno || '').trim();
    const nombreCompleto = [nombre, apPaterno, apMaterno].filter(Boolean).join(' ').trim();
    return nombreCompleto || 'Usuario';
  }, [usuarioSidebar]);

  const correoMostrado = useMemo(() => {
    const correo = String(usuarioSidebar?.correo || '').trim();
    return correo || 'correo@ejemplo.com';
  }, [usuarioSidebar]);

  const inicialAvatar = useMemo(() => {
    const inicial = String(usuarioSidebar?.nombre_usuario || '').trim().charAt(0).toUpperCase();
    return inicial || 'U';
  }, [usuarioSidebar]);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 transition-all duration-200 rounded-lg mx-3 mb-1 ${
      isActive 
        ? 'bg-ophira-primary text-white shadow-sm' 
        : isDark
          ? 'text-slate-300 hover:bg-ophira-bg-hover'
          : 'text-slate-600 hover:bg-slate-100'
    }`;

  const handleNavClick = () => {
    onClose();
  };

  return (
    <div className={`w-64 h-screen fixed left-0 top-0 flex flex-col shadow-lg border-r z-50 transition-all duration-200 md:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } ${
      isDark 
        ? 'bg-ophira-bg-card border-ophira-bg-hover' 
        : 'bg-white border-slate-200'
    }`}>
      <div className="px-6 py-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src={OphiraLogo} alt="Ophira" className="w-10 h-10 aspect-square object-cover" />
            <div>
              <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Ophira <span className="text-ophira-primary">QR</span>
              </h1>
              <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>v1.0</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Cerrar menú"
            className={`rounded-lg p-1.5 transition md:hidden ${
              isDark ? 'text-slate-300 hover:bg-ophira-bg-hover' : 'text-slate-600 hover:bg-slate-100'
            }`}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <nav className="flex-1 py-4">
        <NavLink to="/dashboard" className={linkClass} onClick={handleNavClick}>
          <LayoutDashboard size={18} />
          <span className="font-medium text-sm">Dashboard</span>
        </NavLink>
        <NavLink to="/activos" className={linkClass} onClick={handleNavClick}>
          <Package size={18} />
          <span className="font-medium text-sm">Activos</span>
        </NavLink>
        <NavLink to="/scanner" className={linkClass} onClick={handleNavClick}>
          <QrCode size={18} />
          <span className="font-medium text-sm">Leer QR</span>
        </NavLink>
        <NavLink to="/reportes" className={linkClass} onClick={handleNavClick}>
          <FileText size={18} />
          <span className="font-medium text-sm">Reportes</span>
        </NavLink>
        <NavLink to="/historial" className={linkClass} onClick={handleNavClick}>
          <History size={18} />
          <span className="font-medium text-sm">Historial</span>
        </NavLink>
        <NavLink to="/auditorias" className={linkClass} onClick={handleNavClick}>
          <ClipboardCheck size={18} />
          <span className="font-medium text-sm">Auditorias</span>
        </NavLink>
        <NavLink to="/usuarios" className={linkClass} onClick={handleNavClick}>
          <Users size={18} />
          <span className="font-medium text-sm">Usuarios</span>
        </NavLink>
      </nav>

      <div className={`p-4 border-t transition-colors duration-200 ${
        isDark ? 'border-ophira-bg-hover' : 'border-slate-200'
      }`}>
        <div 
          onClick={() => {
            onClose();
            navigate('/perfil');
          }}
          className={`flex items-center gap-3 mb-3 p-2 rounded-lg cursor-pointer transition ${
            isDark ? 'hover:bg-ophira-bg-hover' : 'hover:bg-slate-100'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ophira-primary to-ophira-primary flex items-center justify-center text-white font-semibold">
            {inicialAvatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>{nombreMostrado}</p>
            <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{correoMostrado}</p>
          </div>
        </div>
        <button 
          onClick={toggleTheme}
          className={`flex items-center gap-2 text-sm w-full px-3 py-2 rounded-lg transition ${
            isDark
              ? 'text-slate-300 hover:text-slate-100 hover:bg-ophira-bg-hover'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          <span>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
        </button>
        <button 
          onClick={() => {
            onClose();
            clearToken();
            navigate('/login_ophira');
          }}
          className={`flex items-center gap-2 text-sm w-full px-3 py-2 rounded-lg transition ${
            isDark
              ? 'text-slate-300 hover:text-slate-100 hover:bg-ophira-bg-hover'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}>
          <LogOut size={16} color={'red'}/>
          <span className='text-ophira-danger'>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Slidebar;