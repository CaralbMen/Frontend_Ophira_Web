import { Camera, CameraOff, Flashlight, Search, Package, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import  {api} from '../services/api';
import { getToken } from '../services/authStorage';
import { useNavigate } from 'react-router-dom';

const capitalizarPrimera = (valor) => {
  const limpio = String(valor || '').trim();
  if (!limpio) return '';
  return limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase();
};

const Scanner = () => {
  
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [cameraActive, setCameraActive] = useState(true);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [codigoDetectado, setCodigoDetectado] = useState('');
  const [codigoManual, setCodigoManual] = useState('');
  const [assetData, setAssetData] = useState({});
  const [movimientos, setMovimientos] = useState([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const rafRef = useRef(null);
  const canvasRef = useRef(null);

  const obtenerIdUsuarioDesdeToken = () => {
    try {
      const token = getToken();
      if (!token) return null;

      const payloadPart = token.split('.')[1];
      if (!payloadPart) return null;

      const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(window.atob(base64));
      const id = Number(decoded?.id);
      return Number.isFinite(id) ? id : null;
    } catch {
      return null;
    }
  };

  const cargarEscaneosRecientes = async () => {
    try {
      const response = await api.get('movimientos/tipo/escaneo');
      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.rows)
          ? response.rows
          : [];

      const escaneos = data.slice(0, 5).map((mov) => ({
        id_movimiento: mov.id_movimiento,
        id_activo: mov.id_activo,
        nombre: mov.nombre_activo || `Activo #${mov.id_activo}`,
        estado: capitalizarPrimera(mov.tipo_movimiento),
        tipo: mov.nombre_usuario || `Usuario #${mov.id_usuario}`,
        id_aula: new Date(mov.fecha_movimiento).toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

      setMovimientos(escaneos);
    } catch (error) {
      console.error('Error al cargar escaneos recientes:', error);
      setMovimientos([]);
    }
  };

  const registrarEscaneoMovimiento = async (activo) => {
    const idActivo = Number(activo?.id_activo);
    if (!Number.isFinite(idActivo)) return;

    const idUsuarioToken = obtenerIdUsuarioDesdeToken();
    const idUsuarioActivo = Number(activo?.id_usuario);
    const idUsuario = Number.isFinite(idUsuarioToken) ? idUsuarioToken : (Number.isFinite(idUsuarioActivo) ? idUsuarioActivo : null);

    if (!idUsuario) return;

    try {
      await api.post('movimientos', {
        tipo_movimiento: 'Escaneo',
        fecha_movimiento: new Date().toISOString(),
        descripcion: `Escaneo de activo #${idActivo}`,
        id_usuario: idUsuario,
        id_activo: idActivo,
      });
      await cargarEscaneosRecientes();
    } catch (error) {
      console.error('No se pudo registrar movimiento de escaneo:', error);
    }
  };

  useEffect(()=>{

      if(codigoDetectado){
        
        const fetchAsset= async()=>{
          try {
            const idBuscado = String(codigoDetectado).trim();
            if (!idBuscado) {
              setAssetData({});
              return;
            }

            console.log('Buscando activo con ID:', idBuscado);
            const response = await api.get(`assets/activo/${idBuscado}`);
            console.log('Activo encontrado:', response);
            
            if (Array.isArray(response) && response.length > 0) {
              setAssetData(response[0]);
              await registrarEscaneoMovimiento(response[0]);
            } else if (response && typeof response === 'object') {
              setAssetData(response);
              await registrarEscaneoMovimiento(response);
            } else {
              setAssetData({});
            }
            //console.log('Datos del activo:', assetData);
            
          } catch (error) {
            console.error('No se pudo obtener el activo:', error);
            setAssetData({});
          }
        };
        fetchAsset();
      }
  }, [codigoDetectado]);
  

  const detenerEscaneo = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const iniciarEscaneo = () => {
    if (!videoRef.current) {
      return;
    }

    const escanearFrame = async () => {
      if (!cameraActive || !videoRef.current) {
        return;
      }

      try {
        if (videoRef.current.readyState >= 2) {
          if (detectorRef.current) {
            const codigos = await detectorRef.current.detect(videoRef.current);
            if (Array.isArray(codigos) && codigos.length > 0) {
              const texto = codigos[0].rawValue || '';
              if (texto) {
                setCodigoDetectado(texto);
                setCameraActive(false);
                return;
              }
            }
          } else {
            if (!canvasRef.current) {
              canvasRef.current = document.createElement('canvas');
            }

            const width = videoRef.current.videoWidth;
            const height = videoRef.current.videoHeight;

            if (width > 0 && height > 0) {
              const canvas = canvasRef.current;
              canvas.width = width;
              canvas.height = height;

              const context = canvas.getContext('2d', { willReadFrequently: true });
              if (context) {
                context.drawImage(videoRef.current, 0, 0, width, height);
                const imageData = context.getImageData(0, 0, width, height);
                const codigo = jsQR(imageData.data, width, height);

                if (codigo?.data) {
                  setCodigoDetectado(codigo.data);
                  setCameraActive(false);
                  return;
                }
              }
            }
          }
        }
      } catch {
      }

      rafRef.current = requestAnimationFrame(escanearFrame);
    };

    rafRef.current = requestAnimationFrame(escanearFrame);
  };

  const stopCameraStream = () => {
    detenerEscaneo();

    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];

      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities?.();
        if (capabilities?.torch) {
          videoTrack
            .applyConstraints({ advanced: [{ torch: false }] })
            .catch(() => {
            });
        }
      }

      streamRef.current.getTracks().forEach(track => {
        track.enabled = false;
        track.stop();
      });
      streamRef.current = null;
    }

    setFlashlightOn(false);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
  };

  useEffect(() => {
    let cancelled = false;

    const initCamera = async () => {
      try {
        if (window.BarcodeDetector) {
          detectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] });
        } else {
          detectorRef.current = null;
        }

        if (!cameraActive) {
          stopCameraStream();
          return;
        }

        const constraints = {
          video: { facingMode: 'environment' },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        
        if (cancelled || !cameraActive) {
          stream.getTracks().forEach(track => {
            track.enabled = false;
            track.stop();
          });
          return;
        }

        stopCameraStream();
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          iniciarEscaneo();
        }

        setCameraError(null);
      } catch (error) {
        setCameraError('No se puede acceder a la cámara');
        console.error('Error al acceder a la cámara:', error);
      }
    };

    initCamera();

    return () => {
      cancelled = true;
      stopCameraStream();
    };
  }, [cameraActive]);

  useEffect(() => {
    cargarEscaneosRecientes();
  }, []);

  const activoSeleccionado = assetData ?? {};
  const estadoColorClass = {
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600'
  }[activoSeleccionado.color] || 'text-slate-500';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Camera className="text-white" size={20} />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                Lector de QR
              </h2>
              {cameraActive && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Cámara Activa
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`rounded-lg border overflow-hidden ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="relative bg-black aspect-video flex items-center justify-center">
            {!cameraActive ? (
              <div className="w-full h-full bg-black"></div>
            ) : cameraError ? (
              <div className="text-center">
                <p className="text-red-500 text-sm mb-4">{cameraError}</p>
                <p className="text-slate-300 text-xs">Por favor, verifica los permisos de cámara</p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-2xl"></div>
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-2xl"></div>
                  </div>
                </div>
              </>
            )}

            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button 
                onClick={() => setCameraActive(!cameraActive)}
                className="w-10 h-10 bg-slate-800/80 hover:bg-slate-700 rounded-lg flex items-center justify-center transition backdrop-blur-sm"
                title={cameraActive ? 'Desactivar cámara' : 'Activar cámara'}
              >
                {cameraActive ? (
                  <Camera className="text-white" size={18} />
                ) : (
                  <CameraOff className="text-white" size={18} />
                )}
              </button>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white text-sm flex items-center gap-2">
                  <Package size={16} />
                  {codigoDetectado ? `Codigo detectado: ${codigoDetectado}` : 'Alinea el código QR dentro del marco'}
                </p>
              </div>
            </div>
          </div>

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
                onChange={(e) => setCodigoManual(e.target.value)}
              />
              <button
                onClick={() => setCodigoDetectado(codigoManual)} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
                <Search size={16} />
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
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
              {assetData? assetData.nombre : 'Sin activo seleccionado'}
            </h4>

            <p className={`text-xs mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              ID: {assetData?.id_activo || 'N/A'}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Categoría
                </span>
                <span className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {assetData?.categoria || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Encargado
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                    {assetData?.encargado?.charAt(0) || 'N/A'}
                  </div>
                  <span className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {assetData?.encargado || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Estado
                </span>
                <span className={`inline-block text-xs font-semibold ${estadoColorClass}`}>
                  ● {assetData?.estado || 'N/A'}
                </span>
              </div>
            </div>

            <button onClick={()=> navigate(`/activos/editar/${assetData?.id_activo}`)} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition mb-2">
              Ver Detalles
            </button>

            <div className="flex items-center justify-center gap-2 text-xs">
              <Clock size={12} className="text-green-600" />
              <span className="text-green-600 font-medium">
                Historial {assetData?.historial || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            ESCANEOS RECIENTES
          </h3>

          <div className="space-y-2">
            {movimientos.length > 0 ? (
              movimientos.map((mov, index) => (
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
                        {mov.nombre}
                      </h5>
                    </div>
                    <span className={`text-xs ${
                      String(mov.estado).toLowerCase() === 'escaneo' ? 'text-blue-600' : 'text-yellow-600'
                    }`}>
                      {mov.estado}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      ID: {mov.id_activo}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {mov.tipo} {mov.id_aula}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className={`rounded-lg border p-3 text-center ${
                isDark 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-slate-200'
              }`}>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  No hay escaneos registrados
                </p>
              </div>
            )}
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