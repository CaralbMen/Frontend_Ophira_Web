import { Camera, Flashlight, Search, Package, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';

const Scanner = () => {
  const { isDark } = useTheme();
  const [cameraActive, setCameraActive] = useState(true);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        if (!cameraActive) {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
          return;
        }

        const constraints = {
          video: { facingMode: 'environment' },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraError(null);
      } catch (error) {
        setCameraError('No se puede acceder a la cámara');
        console.error('Error al acceder a la cámara:', error);
      }
    };

    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [cameraActive]);

  // Datos de ejemplo
  const currentAsset = {
    nombre: 'Dell Precision 5570',
    id: 'OPH-A21-19421',
    categoria: 'Laptop / Tecnología',
    encargado: 'John Smith',
    estado: 'Activo',
    historial: 'Activo',
  };

  const recentScans = [
    {
      nombre: 'HP LaserJet Pro',
      id: 'OPH-A21-19421',
      tiempo: '10:32 AM',
      estado: 'Mantenimiento',
    },
    {
      nombre: 'Herman Miller Aeron',
      id: 'OPH-A21-10332',
      tiempo: '10:30 AM',
      estado: 'Activo',
    },
    {
      nombre: 'HP LaserJet Pro',
      id: 'OPH-A21-10331',
      tiempo: '06:48 AM',
      estado: 'Mantenimiento',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Side - Scanner */}
      <div className="lg:col-span-2 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Camera className="text-white" size={20} />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                Asset Scanner
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Cámara Activa
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Camera View */}
        <div className={`rounded-lg border overflow-hidden ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="relative bg-black aspect-video flex items-center justify-center">
            {cameraError ? (
              <div className="text-center">
                <p className="text-red-500 text-sm mb-4">{cameraError}</p>
                <p className="text-slate-300 text-xs">Por favor, verifica los permisos de cámara</p>
              </div>
            ) : (
              <>
                {/* Video element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />

                {/* QR Frame overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-2xl"></div>
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-2xl"></div>
                  </div>
                </div>
              </>
            )}

            {/* Camera Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button 
                onClick={() => setCameraActive(!cameraActive)}
                className="w-10 h-10 bg-slate-800/80 hover:bg-slate-700 rounded-lg flex items-center justify-center transition backdrop-blur-sm"
                title={cameraActive ? 'Desactivar cámara' : 'Activar cámara'}
              >
                <Camera className="text-white" size={18} />
              </button>
            </div>

            {/* Bottom instruction */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white text-sm flex items-center gap-2">
                  <Package size={16} />
                  Align the QR code within the frame
                </p>
              </div>
            </div>
          </div>

          {/* Manual Input */}
          <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              ¿La cámara no funciona? Inserta el ID del activo de manera manual
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ID del activo"
                className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
                <Search size={16} />
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Results */}
      <div className="space-y-4">
        {/* Current Scan */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              AHORA
            </h3>
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              10:42 AM
            </span>
          </div>

          <div className={`rounded-lg border p-4 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <h4 className={`font-bold text-lg mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {currentAsset.nombre}
            </h4>
            <p className={`text-xs mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              ID: {currentAsset.id}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Categoría
                </span>
                <span className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {currentAsset.categoria}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Encargado
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                    J
                  </div>
                  <span className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {currentAsset.encargado}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Estado
                </span>
                <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  ● {currentAsset.estado}
                </span>
              </div>
            </div>

            <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition mb-2">
              Ver Detalles
            </button>

            <div className="flex items-center justify-center gap-2 text-xs">
              <Clock size={12} className="text-green-600" />
              <span className="text-green-600 font-medium">
                Historial {currentAsset.historial}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Scans */}
        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            RECIENTES
          </h3>

          <div className="space-y-2">
            {recentScans.map((scan, index) => (
              <div
                key={index}
                className={`rounded-lg border p-3 cursor-pointer transition ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Package size={14} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                    <h5 className={`font-medium text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {scan.nombre}
                    </h5>
                  </div>
                  <span className={`text-xs ${
                    scan.estado === 'Activo' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {scan.estado}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {scan.id}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {scan.tiempo}
                  </p>
                </div>
              </div>
            ))}
            <button className={`w-full py-2 rounded-lg text-xs font-medium transition ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}>
              Ver Historial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;