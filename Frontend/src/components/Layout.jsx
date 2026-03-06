import Slidebar from './Slidebar';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div className={`flex min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <Slidebar />
      <main className={`flex-1 ml-64 p-8 transition-colors duration-200 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;