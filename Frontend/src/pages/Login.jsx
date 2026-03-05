import { useNavigate } from "react-router-dom"
const Login = () => {
    const navigate = useNavigate();
    const entrar=()=>{
        navigate('/dashboard');
    }
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-slate-800 text-center">Iniciar Sesion</h1>
                <p className="text-sm text-slate-500 text-center mt-2">Ingresa tus credenciales para continuar</p>

                <form className="mt-8 space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                            Correo electronico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="tu@correo.com"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                            Contrasena
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="********"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                        />
                    </div>

                    <button
                        onClick={entrar}
                        className="w-full rounded-lg bg-slate-800 text-white py-2.5 font-medium hover:bg-slate-900 transition-colors"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login