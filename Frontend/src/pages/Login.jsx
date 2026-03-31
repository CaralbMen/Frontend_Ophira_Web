import { useNavigate } from "react-router-dom"
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import OphiraLogo from '../assets/OphiraLogo.png';
import { useState } from "react";
//Llamamos a la desta para las peticiones al back
import { api } from '../services/api';
import { saveToken } from '../services/authStorage';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotError, setForgotError] = useState('');

    const handleForgotPassword = (e) => {
        e.preventDefault();
        if (!forgotEmail.trim()) {
            setForgotError('Por favor ingresa tu correo electrónico.');
            return;
        }
        const subject = encodeURIComponent('Recuperacion de contraseña');
        const body = encodeURIComponent(`Hola,\n\nSolicito la recuperación de contraseña para la cuenta: ${forgotEmail}\n\nGracias.`);
        window.open(`mailto:124051193@upq.edu.mx?subject=${subject}&body=${body}`, '_blank');
        setShowForgotModal(false);
        setForgotEmail('');
        setForgotError('');
    };

    // Cosos para manejar el tema oscuro o claro
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const entrar = async (e) => {
        e.preventDefault();
        console.log("Correo:", correo);
        console.log("Contraseña:", password);

        const resultado = await api.post('auth/login', { correo, password });
        if (resultado.codigo === 200) {
            saveToken(resultado.token, rememberMe);
            navigate('/dashboard');
        }
    }
    return (
        <>
            <div className={`min-h-screen flex items-center justify-center px-4 relative ${isDark ? 'bg-slate-900' : 'bg-slate-100'
                }`}>
                <button
                    onClick={toggleTheme}
                    className={`absolute top-6 right-6 p-2 rounded-lg transition ${isDark
                        ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                        }`}
                    title={isDark ? 'Modo claro' : 'Modo oscuro'}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 ${isDark ? 'bg-slate-800' : 'bg-white'
                    }`}>
                    <div className={`p-12 flex flex-col items-center justify-center md:min-h-full bg-gradient-to-b ${isDark ? 'from-slate-700 to-slate-800' : 'from-blue-50 to-blue-100'
                        }`}>
                        <img src={OphiraLogo} alt="Ophira QR" className="w-40 h-40 aspect-square object-cover mb-6 drop-shadow-lg" />
                        <h2 className={`text-3xl font-bold text-center mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>Ophira QR</h2>
                        <p className={`text-center text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Gestión de activos con tecnología QR
                        </p>
                        <p className={`text-center text-xs mt-8 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>© 2026 Ophira System, v1.0.0</p>
                    </div>

                    <div className={`p-12 flex flex-col justify-center ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Bienvenido!!</h1>
                        <p className={`text-sm mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ingresa tus credenciales para continuar</p>

                        <form onSubmit={entrar} className="space-y-5">
                            <div>
                                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="correo@gmail.com"
                                        className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${isDark
                                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                                            : 'border-slate-300 text-slate-800 placeholder-slate-400'
                                            }`}
                                        onChange={(e) => setCorreo(e.target.value)}
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
                                    className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${isDark
                                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                                        : 'border-slate-300 text-slate-800 placeholder-slate-400'
                                        }`}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className={`w-4 h-4 rounded text-blue-600 focus:ring-blue-500 ${isDark ? 'bg-slate-700 border-slate-600' : 'border-slate-300'
                                            }`}
                                    />
                                    <span className={`ml-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Recuérdame</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => { setShowForgotModal(true); setForgotError(''); setForgotEmail(''); }}
                                    className={`text-sm font-medium hover:underline bg-transparent border-none cursor-pointer p-0 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700 transition-colors mt-6"
                            >
                                Iniciar Sesión
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal: Recuperar contraseña */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className={`w-full max-w-md rounded-2xl shadow-2xl p-8 ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'
                        }`}>
                        <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Recuperar contraseña
                        </h2>
                        <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Ingresa tu correo y te enviaremos un mensaje de recuperación.
                        </p>
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <label htmlFor="forgot-email" className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                    Correo electrónico
                                </label>
                                <input
                                    id="forgot-email"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={forgotEmail}
                                    onChange={(e) => { setForgotEmail(e.target.value); setForgotError(''); }}
                                    className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${isDark
                                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                                        : 'border-slate-300 text-slate-800 placeholder-slate-400'
                                        }`}
                                />
                                {forgotError && (
                                    <p className="text-red-500 text-xs mt-1">{forgotError}</p>
                                )}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotModal(false)}
                                    className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${isDark
                                        ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                                        : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Enviar correo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default Login