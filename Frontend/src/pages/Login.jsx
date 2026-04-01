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
    
    // Estados para recuperación de contraseña
    const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: código, 3: nueva contraseña
    const [forgotEmail, setForgotEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [forgotError, setForgotError] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotSuccess, setForgotSuccess] = useState('');

    const openForgotModal = () => {
        setShowForgotModal(true);
        setForgotStep(1);
        setForgotEmail('');
        setResetCode('');
        setNewPassword('');
        setConfirmPassword('');
        setForgotError('');
        setForgotSuccess('');
    };

    const closeForgotModal = () => {
        setShowForgotModal(false);
        setForgotStep(1);
    };

    // Paso 1: Solicitar código
    const handleRequestCode = async (e) => {
        e.preventDefault();
        setForgotError('');
        setForgotSuccess('');

        if (!forgotEmail.trim()) {
            setForgotError('Por favor ingresa tu correo electrónico.');
            return;
        }

        setForgotLoading(true);
        try {
            const resultado = await api.post('auth/forgot-password', { correo: forgotEmail });
            if (resultado.codigo === 200) {
                setForgotSuccess('Se envió un código a tu correo. Válido por 15 minutos.');
                setForgotStep(2);
            } else {
                setForgotError(resultado.message || 'No se pudo procesar la solicitud.');
            }
        } catch (error) {
            setForgotError('Hubo un error al procesar tu solicitud.');
            console.error(error);
        } finally {
            setForgotLoading(false);
        }
    };

    // Paso 2: Verificar código
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setForgotError('');
        setForgotSuccess('');

        if (!resetCode.trim() || resetCode.length !== 4) {
            setForgotError('Por favor ingresa un código válido de 4 dígitos.');
            return;
        }

        setForgotLoading(true);
        try {
            const resultado = await api.post('auth/verify-reset-code', {
                correo: forgotEmail,
                codigo: resetCode
            });
            if (resultado.codigo === 200) {
                setForgotSuccess('Código verificado. Ahora ingresa tu nueva contraseña.');
                setForgotStep(3);
            } else {
                setForgotError(resultado.message || 'Código inválido o expirado.');
            }
        } catch (error) {
            setForgotError('Error al verificar el código.');
            console.error(error);
        } finally {
            setForgotLoading(false);
        }
    };

    // Paso 3: Cambiar contraseña
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setForgotError('');
        setForgotSuccess('');

        if (!newPassword.trim() || !confirmPassword.trim()) {
            setForgotError('Por favor completa ambos campos de contraseña.');
            return;
        }

        if (newPassword.length < 6) {
            setForgotError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setForgotError('Las contraseñas no coinciden.');
            return;
        }

        setForgotLoading(true);
        try {
            const resultado = await api.post('auth/reset-password', {
                correo: forgotEmail,
                codigo: resetCode,
                nuevaPassword: newPassword
            });
            if (resultado.codigo === 200) {
                setForgotSuccess('¡Contraseña actualizada correctamente! Puedes iniciar sesión ahora.');
                setTimeout(() => {
                    closeForgotModal();
                }, 2000);
            } else {
                setForgotError(resultado.message || 'No se pudo actualizar la contraseña.');
            }
        } catch (error) {
            setForgotError('Error al actualizar la contraseña.');
            console.error(error);
        } finally {
            setForgotLoading(false);
        }
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
                                    onClick={openForgotModal}
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
                            {forgotStep === 1 && 'Ingresa tu correo para recibir un código'}
                            {forgotStep === 2 && 'Ingresa el código de 4 dígitos que recibiste'}
                            {forgotStep === 3 && 'Define tu nueva contraseña'}
                        </p>

                        {/* Paso 1: Email */}
                        {forgotStep === 1 && (
                            <form onSubmit={handleRequestCode} className="space-y-4">
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
                                </div>
                                {forgotError && (
                                    <p className="text-red-500 text-xs">{forgotError}</p>
                                )}
                                {forgotSuccess && (
                                    <p className="text-green-500 text-xs">{forgotSuccess}</p>
                                )}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeForgotModal}
                                        className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${isDark
                                            ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                                            : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={forgotLoading}
                                        className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {forgotLoading ? 'Enviando...' : 'Enviar código'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Paso 2: Código */}
                        {forgotStep === 2 && (
                            <form onSubmit={handleVerifyCode} className="space-y-4">
                                <div>
                                    <label htmlFor="reset-code" className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                        Código de 4 dígitos
                                    </label>
                                    <input
                                        id="reset-code"
                                        type="text"
                                        placeholder="0000"
                                        maxLength="4"
                                        value={resetCode}
                                        onChange={(e) => {
                                            setResetCode(e.target.value.replace(/\D/g, ''));
                                            setForgotError('');
                                        }}
                                        className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-center text-2xl tracking-widest ${isDark
                                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                                            : 'border-slate-300 text-slate-800 placeholder-slate-400'
                                            }`}
                                    />
                                </div>
                                {forgotError && (
                                    <p className="text-red-500 text-xs">{forgotError}</p>
                                )}
                                {forgotSuccess && (
                                    <p className="text-green-500 text-xs">{forgotSuccess}</p>
                                )}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForgotStep(1);
                                            setResetCode('');
                                            setForgotError('');
                                            setForgotSuccess('');
                                        }}
                                        className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${isDark
                                            ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                                            : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        Atrás
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={forgotLoading}
                                        className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {forgotLoading ? 'Verificando...' : 'Verificar código'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Paso 3: Nueva contraseña */}
                        {forgotStep === 3 && (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div>
                                    <label htmlFor="new-password" className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                        Nueva contraseña
                                    </label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => { setNewPassword(e.target.value); setForgotError(''); }}
                                        className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${isDark
                                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                                            : 'border-slate-300 text-slate-800 placeholder-slate-400'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                        Confirmar contraseña
                                    </label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirmPassword(e.target.value); setForgotError(''); }}
                                        className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${isDark
                                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                                            : 'border-slate-300 text-slate-800 placeholder-slate-400'
                                            }`}
                                    />
                                </div>
                                {forgotError && (
                                    <p className="text-red-500 text-xs">{forgotError}</p>
                                )}
                                {forgotSuccess && (
                                    <p className="text-green-500 text-xs">{forgotSuccess}</p>
                                )}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForgotStep(2);
                                            setNewPassword('');
                                            setConfirmPassword('');
                                            setForgotError('');
                                            setForgotSuccess('');
                                        }}
                                        className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${isDark
                                            ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                                            : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        Atrás
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={forgotLoading}
                                        className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {forgotLoading ? 'Actualizando...' : 'Actualizar contraseña'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default Login