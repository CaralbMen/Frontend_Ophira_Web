import {Outlet, Navigate} from 'react-router-dom';
import { getToken } from '../services/authStorage';

const ProtectedRoute = ({ children }) => {
    const token = getToken();
    if (!token) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
}

export default ProtectedRoute;