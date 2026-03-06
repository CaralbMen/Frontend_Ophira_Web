import { useNavigate } from "react-router-dom"
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import OphiraLogo from '../assets/OphiraLogo.png';

const Login = () => {
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const entrar = () => {
        navigate('/dashboard');
    }
    return (
        <div className={`min-h-screen flex items-center justify-center px-4 relative ${
            isDark ? 'bg-slate-900' : 'bg-slate-100'
        }`}>
            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className={`absolute top-6 right-6 p-2 rounded-lg transition ${
                    isDark
                        ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
                title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 ${
                isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
                {/* Left Side - Logo & Description */}
                <div className={`p-12 flex flex-col items-center justify-center md:min-h-full bg-gradient-to-b ${
                    isDark ? 'from-slate-700 to-slate-800' : 'from-blue-50 to-blue-100'
                }`}>
                    <img src={OphiraLogo} alt="Ophira QR" className="w-40 h-40 aspect-square object-cover mb-6 drop-shadow-lg" />
                    <h2 className={`text-3xl font-bold text-center mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>Ophira QR</h2>
                    <p className={`text-center text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        Gestión precisa de activos impulsada por tecnología QR de última generación.
                    </p>
                    <p className={`text-center text-xs mt-8 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>© 2024 Ophira Systems, v2.4.0</p>
                </div>

                {/* Right Side - Login Form */}
                <div className={`p-12 flex flex-col justify-center ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                    <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Bienvenido!!</h1>
                    <p className={`text-sm mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ingresa tus credenciales para continuar</p>

                    <form className="space-y-5">
                        <div>
                            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                Email o Usuario
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="user@ophira.com"
                                    className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                                        isDark 
                                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' 
                                            : 'border-slate-300 text-slate-800 placeholder-slate-400'
                                    }`}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                                    isDark 
                                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' 
                                        : 'border-slate-300 text-slate-800 placeholder-slate-400'
                                }`}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className={`w-4 h-4 rounded text-blue-600 focus:ring-blue-500 ${
                                        isDark ? 'bg-slate-700 border-slate-600' : 'border-slate-300'
                                    }`}
                                />
                                <span className={`ml-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Recuérdame</span>
                            </label>
                            <a href="#" className={`text-sm font-medium hover:underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        <button
                            onClick={entrar}
                            className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700 transition-colors mt-6"
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login