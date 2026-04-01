import {Outlet, Navigate} from 'react-router-dom';
import { clearToken, getToken, getTokenRole } from '../services/authStorage';

const ProtectedRoute = ({ children }) => {
    const token = getToken();
    if (!token) {
        return <Navigate to="/login_ophira" />;
    }

    const rol = getTokenRole();
    if (rol !== 1) {
        clearToken();
        return <Navigate to="/login_ophira" />;
    }

    return <Outlet />;
}

export default ProtectedRoute;