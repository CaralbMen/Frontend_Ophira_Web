import { useState } from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Activos from './pages/Activos';
import Scanner from './pages/Scanner';
import Reportes from './pages/Reportes';
import Historial from './pages/Historial';
import Auditorias from './pages/Auditorias';
import VerActivo from './pages/crudActivos/verActivo';
// Páginas placeholder
//Remplaza estas funciones con los componentes importados desde arribita de aqui
// Agregas los archivos de cada pagina en src/pages
// const Assets = () => <div className="p-6"><h1 className="text-2xl font-bold text-slate-800">Assets</h1></div>;
// const QRScanner = () => <div className="p-6"><h1 className="text-2xl font-bold text-slate-800">QR Scanner</h1></div>;
// const Reports = () => <div className="p-6"><h1 className="text-2xl font-bold text-slate-800">Reports</h1></div>;
// const History = () => <div className="p-6"><h1 className="text-2xl font-bold text-slate-800">History</h1></div>;
const Settings = () => <div className="p-6"><h1 className="text-2xl font-bold text-slate-800">Settings</h1></div>;
const Usuarios = () => <div className="p-6"><h1 className="text-2xl font-bold text-slate-800">Usuarios</h1></div>;

function App() {

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path='/*' element={
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/activos" element={<Activos />} />
                <Route path="/activos/nuevo" element={<VerActivo />} />
                <Route path="/activos/editar/:id" element={<VerActivo />} />
                <Route path="/activos/eliminar/:id" element={<VerActivo />} />
                <Route path="/scanner" element={<Scanner />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/historial" element={<Historial />} />
                <Route path="/auditorias" element={<Auditorias />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          }/>
          
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
