const URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/';
import { clearToken, getToken } from './authStorage';

let sesionExpiradaNotificada = false;

const leerMensajeBackend = (payload) => {
    if (!payload) return '';

    if (typeof payload === 'string') return payload;

    const escogerTexto = (valor) => {
        if (!valor) return '';
        if (typeof valor === 'string') return valor.trim();
        if (typeof valor === 'number' || typeof valor === 'boolean') return String(valor);
        if (typeof valor === 'object') {
            return String(
                valor.message ||
                valor.mensaje ||
                valor.detail ||
                valor.msg ||
                valor.error ||
                ''
            ).trim();
        }
        return '';
    };

    const candidatos = [
        payload.message,
        payload.mensaje,
        payload.msg,
        payload.detail,
        payload.error?.message,
        payload.err?.message,
        payload.error?.detail,
        payload.err?.detail,
        payload.error,
        payload.err,
    ];

    for (const candidato of candidatos) {
        const texto = escogerTexto(candidato);
        if (texto && texto.toLowerCase() !== '[object object]') {
            return texto;
        }
    }

    return '';
};

const normalizarMensajeError = ({ status, backendMessage }) => {
    const raw = String(backendMessage || '').toLowerCase();

    if (raw.includes('duplicate key value') || raw.includes('ya est') || raw.includes('already exists')) {
        return 'Ya existe un registro con esos datos.';
    }

    if (raw.includes('foreign key') || raw.includes('violates foreign key')) {
        return 'No se pudo guardar: hay datos relacionados invalidos o inexistentes.';
    }

    if (raw.includes('null value') || raw.includes('not-null') || raw.includes('requerido') || raw.includes('obligatorio')) {
        return 'Faltan campos obligatorios. Verifica los datos e intenta de nuevo.';
    }

    if (raw.includes('invalid input syntax') || raw.includes('formato')) {
        return 'Hay datos con formato invalido. Corrigelos e intenta de nuevo.';
    }

    if (status === 400) return backendMessage || 'Solicitud invalida. Verifica los datos.';
    if (status === 401) return backendMessage || 'No autorizado. Inicia sesion nuevamente.';
    if (status === 403) return backendMessage || 'No tienes permisos para esta accion.';
    if (status === 404) return backendMessage || 'No se encontro la informacion solicitada.';
    if (status === 409) return backendMessage || 'Ya existe un registro con esos datos.';
    if (status >= 500) return backendMessage || 'Ocurrio un error en el servidor. Intenta de nuevo.';

    return backendMessage || 'Ocurrio un error inesperado.';
};

const alertarError = (message) => {
    if (typeof window !== 'undefined' && message) {
        window.alert(message);
    }
};

const manejarSesionExpirada = (backendMessage) => {
    if (sesionExpiradaNotificada || typeof window === 'undefined') {
        return;
    }

    sesionExpiradaNotificada = true;
    clearToken();

    const mensaje = backendMessage || 'Tu sesion expiro. Vuelve a iniciar sesion.';
    window.alert(mensaje);

    if (window.location.pathname !== '/login_ophira') {
        window.location.href = '/login_ophira';
    }
};

const construirErrorHttp = async (response, hadAuthToken = false) => {
    let payload = null;

    try {
        payload = await response.json();
    } catch {
        try {
            payload = await response.text();
        } catch {
            payload = null;
        }
    }

    const backendMessage = leerMensajeBackend(payload);
    const message = normalizarMensajeError({
        status: response.status,
        backendMessage,
    });

    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    error.alreadyAlerted = true;

    if (response.status === 401 && hadAuthToken) {
        manejarSesionExpirada(backendMessage);
        return error;
    }

    alertarError(message);

    return error;
};

const manejarErrorDeRed = (error, endpoint = '') => {
    if (error?.alreadyAlerted) {
        throw error;
    }

    const raw = String(error?.message || '').toLowerCase();
    const urlObjetivo = `${URL_BASE || ''}${endpoint || ''}`;
    const message = raw.includes('failed to fetch')
        ? `No hay conexion con el servidor. URL: ${urlObjetivo || 'desconocida'}`
        : (error?.message || 'Error de conexion. Intenta de nuevo.');

    alertarError(message);

    const nextError = new Error(message);
    nextError.alreadyAlerted = true;
    throw nextError;
};

export const api = {
    get: async (endpoint) => {
        const token = getToken();
        try {
            const response = await fetch(`${URL_BASE}${endpoint}`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw await construirErrorHttp(response, Boolean(token));
            }
            return await response.json();
        } catch (error) {
            manejarErrorDeRed(error, endpoint);
        }
    },
    post: async (endpoint, data) => {
        const token = getToken();
        try {
            const response = await fetch(`${URL_BASE}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw await construirErrorHttp(response, Boolean(token));
            }
            return await response.json();
        } catch (error) {
            manejarErrorDeRed(error, endpoint);
        }
    },
    put: async (endpoint, data) => {
        const token = getToken();
        try {
            const response = await fetch(`${URL_BASE}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw await construirErrorHttp(response, Boolean(token));
            }
            return await response.json();
        } catch (error) {
            manejarErrorDeRed(error, endpoint);
        }
    },
    delete: async (endpoint) => {
        const token = getToken();
        try {
            const response = await fetch(`${URL_BASE}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw await construirErrorHttp(response, Boolean(token));
            }
            return await response.json();
        } catch (error) {
            manejarErrorDeRed(error, endpoint);
        }
    }
}