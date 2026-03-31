import React, { useEffect } from 'react';
import QRCode from 'qrcode';
import { useTheme } from '../context/ThemeContext';
import { Download } from 'lucide-react';
import { useRef } from 'react';

const QRCodeComponent = ({ value, size = 200, title = 'Código QR', showDownload = false }) => {
  const { isDark } = useTheme();
  const qrRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, String(value), {
        width: size,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    }
  }, [value, size]);

  const descargarQR = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr_${value}_${new Date().getTime()}.png`;
      link.click();
    }
  };

  return (
    <div className={`flex flex-col items-center gap-3 p-4 rounded-lg border ${
      isDark 
        ? 'bg-slate-800 border-slate-700' 
        : 'bg-white border-slate-200'
    }`}>
      {title && (
        <p className={`text-sm font-medium ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {title}
        </p>
      )}
      
      <div ref={qrRef} className="p-3 bg-white rounded-lg">
        <canvas ref={canvasRef} />
      </div>

      {showDownload && (
        <button
          onClick={descargarQR}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <Download size={16} />
          Descargar QR
        </button>
      )}
    </div>
  );
};

export default QRCodeComponent;
