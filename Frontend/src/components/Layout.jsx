import Slidebar from './Slidebar';
import { useTheme } from '../context/ThemeContext';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const Layout = ({ children }) => {
  const { isDark } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`flex min-h-screen transition-colors duration-200 ${isDark ? 'bg-ophira-bg-dark' : 'bg-slate-50'}`}>
      <Slidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      <main className={`flex-1 md:ml-64 px-4 py-4 sm:px-6 sm:py-6 md:p-8 transition-colors duration-200 ${isDark ? 'bg-ophira-bg-dark' : 'bg-slate-50'}`}>
        <div className="mb-4 flex items-center gap-3 md:hidden">
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setIsSidebarOpen(true)}
            className={`inline-flex items-center justify-center rounded-lg border p-2 transition ${
              isDark
                ? 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Menu size={20} />
          </button>
          <p className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>Menu</p>
        </div>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;