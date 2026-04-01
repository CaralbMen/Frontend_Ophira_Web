import { Search, Plus, Download, Edit, Trash2, QrCode } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import {api} from '../services/api';
import { useEffect, useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toISOString().split('T')[0];
};

const Activos = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [activos, setActivos]= useState([]);
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('todos');
  // Datos de ejemplo
  // const activos = [
  //   {
  //     id: '10024',
  //     nombre_activo: 'Dell Latitude 5520',
  //     marca_activo: 'Dell',
  //     Modelo_activo: 'Latitude 5520',
  //     descripcion_activo: 'Laptop para desarrollo',
  //     precio_original: '1200.00',
  //     valor_residual: '800.00',
  //     vida_util: '5',
  //     fecha_compra_activo: '2023-10-24',
  //     FK_id_responsable_activo: '1',
  //     FK_id_categoria: '1',
  //     FK_id_estado: '1',
  //     FK_id_aula: '1',
  //     multiparte: false,
  //     nombre: 'Dell Latitude 5520',
  //     responsable: 'Carlos Mendoza',
  //     categoria: 'Electronicos',
  //     ubicacion: 'Aula C107',
  //     estado: 'Activo',
  //     estadoColor: 'green',
  //     fecha: 'Oct 24, 2023',
  //   },
  //   {
  //     id: '10025',
  //     nombre_activo: 'Herman Miller Aeron',
  //     marca_activo: 'Herman Miller',
  //     Modelo_activo: 'Aeron',
  //     descripcion_activo: 'Silla ergonómica de oficina',
  //     precio_original: '1500.00',
  //     valor_residual: '1200.00',
  //     vida_util: '10',
  //     fecha_compra_activo: '2023-10-22',
  //     FK_id_responsable_activo: '2',
  //     FK_id_categoria: '2',
  //     FK_id_estado: '1',
  //     FK_id_aula: '2',
  //     multiparte: false,
  //     nombre: 'Herman Miller Aeron',
  //     responsable: 'Daniyel Paulín',
  //     categoria: 'Muebles',
  //     ubicacion: 'Laboratorio B1',
  //     estado: 'Activo',
  //     estadoColor: 'green',
  //     fecha: 'Oct 22, 2023',
  //   },
  //   {
  //     id: '10031',
  //     nombre_activo: 'Industrial Printer HP',
  //     marca_activo: 'HP',
  //     Modelo_activo: 'LaserJet Enterprise',
  //     descripcion_activo: 'Impresora industrial de alta capacidad',
  //     precio_original: '3500.00',
  //     valor_residual: '2800.00',
  //     vida_util: '7',
  //     fecha_compra_activo: '2023-09-15',
  //     FK_id_responsable_activo: '1',
  //     FK_id_categoria: '1',
  //     FK_id_estado: '2',
  //     FK_id_aula: '3',
  //     multiparte: false,
  //     nombre: 'Industrial Printer HP',
  //     responsable: 'Carlos Mendoza',
  //     categoria: 'Electronicos',
  //     ubicacion: 'Audiovisual A',
  //     estado: 'Mantenimiento',
  //     estadoColor: 'yellow',
  //     fecha: 'Sep 15, 2023',
  //   },
  //   {
  //     id: '10042',
  //     nombre_activo: 'Forklift Toyota 8F',
  //     marca_activo: 'Toyota',
  //     Modelo_activo: '8FD25',
  //     descripcion_activo: 'Montacargas de 2.5 toneladas',
  //     precio_original: '25000.00',
  //     valor_residual: '20000.00',
  //     vida_util: '15',
  //     fecha_compra_activo: '2023-01-10',
  //     FK_id_responsable_activo: '1',
  //     FK_id_categoria: '3',
  //     FK_id_estado: '1',
  //     FK_id_aula: '4',
  //     multiparte: false,
  //     nombre: 'Forklift Toyota 8F',
  //     responsable: 'Carlos Mendoza',
  //     categoria: 'Vehiculos',
  //     ubicacion: 'Audiovisual LT1',
  //     estado: 'Activo',
  //     estadoColor: 'green',
  //     fecha: 'Jan 10, 2023',
  //   },
  //   {
  //     id: '10050',
  //     nombre_activo: 'Projector Epson 3000',
  //     marca_activo: 'Epson',
  //     Modelo_activo: 'PowerLite 3000',
  //     descripcion_activo: 'Proyector multimedia de alta resolución',
  //     precio_original: '1800.00',
  //     valor_residual: '200.00',
  //     vida_util: '5',
  //     fecha_compra_activo: '2022-11-05',
  //     FK_id_responsable_activo: '1',
  //     FK_id_categoria: '1',
  //     FK_id_estado: '4',
  //     FK_id_aula: '1',
  //     multiparte: false,
  //     nombre: 'Projector Epson 3000',
  //     responsable: 'Carlos Mendoza',
  //     categoria: 'Electronicos',
  //     ubicacion: 'Oficina 5, piso 2, edificio A',
  //     estado: 'Retirado',
  //     estadoColor: 'red',
  //     fecha: 'Nov 05, 2022',
  //   },
  // ];
  

  useEffect(()=>{
    const obtenerActivos= async()=>{
      try{
        const response= await api.get('assets/activos');
        setActivos(response);
        console.log('Activos obtenidos:', response);
        // console.log(activos);
      }catch(e){
        console.error('Error al obtener activos:', e);
      }
    }
    obtenerActivos();
  }, [location.state?.refreshActivos]);

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const response = await api.get('categorias');
        setCategorias(Array.isArray(response) ? response : []);
      } catch (e) {
        console.error('Error al obtener categorias:', e);
        setCategorias([]);
      }
    };

    obtenerCategorias();
  }, []);

  const estadosDisponibles = useMemo(() => {
    const unicos = Array.from(new Set(activos.map((a) => a.estado).filter(Boolean)));
    return ['todos', ...unicos];
  }, [activos]);

  const activosFiltrados = useMemo(() => {
    const termino = searchTerm.trim().toLowerCase();

    return activos.filter((activo) => {
      const coincideBusqueda = !termino || [
        String(activo.id_activo ?? ''),
        String(activo.nombre ?? ''),
        String(activo.responsable ?? ''),
      ].some((valor) => valor.toLowerCase().includes(termino));

      const coincideCategoria =
        categoriaSeleccionada === 'todas' ||
        String(activo.categoria || '').toLowerCase() === categoriaSeleccionada;

      const coincideEstado =
        estadoSeleccionado === 'todos' ||
        String(activo.estado || '').toLowerCase() === estadoSeleccionado;

      return coincideBusqueda && coincideCategoria && coincideEstado;
    });
  }, [activos, searchTerm, categoriaSeleccionada, estadoSeleccionado]);

  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case 'Activo':
        return 'text-green-600 font-semibold';
      case 'Mantenimiento':
        return 'text-yellow-600 font-semibold';
      case 'Retirado':
        return 'text-red-600 font-semibold';
      default:
        return 'text-slate-600 font-semibold';
    }
  };

  const exportarPdfActivos = () => {
    if (activosFiltrados.length === 0) {
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const fechaActual = new Date().toLocaleDateString('es-MX');

    doc.setFontSize(16);
    doc.text('Inventario de Activos', 40, 40);
    doc.setFontSize(10);
    doc.text(`Fecha de exportacion: ${fechaActual}`, 40, 58);
    doc.text(`Registros: ${activosFiltrados.length}`, 240, 58);

    const filas = activosFiltrados.map((activo) => {
      const responsable = [
        [activo.responsable, activo.responsable_apellido].filter(Boolean).join(' ').trim(),
        [activo.responsable_puesto, activo.responsable_area].filter(Boolean).join(' de ').trim()
      ].filter(Boolean).join(' - ') || 'Sin responsable';

      return [
        String(activo.id_activo ?? '-'),
        String(activo.nombre ?? '-'),
        String(activo.categoria ?? '-'),
        String(activo.aula ?? '-'),
        String(activo.estado ?? '-'),
        String(responsable),
        String(formatearFecha(activo.fecha_registro) || '-'),
      ];
    });

    autoTable(doc, {
      startY: 80,
      head: [['ID', 'Nombre', 'Categoria', 'Aula', 'Estado', 'Responsable', 'Fecha registro']],
      body: filas,
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`activos_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const obtenerActivosDelDia = () => {
    const hoy = new Date();
    const inicioDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);

    return activos.filter((activo) => {
      const fechaRegistro = new Date(activo.fecha_registro || activo.fecha_compra);
      if (Number.isNaN(fechaRegistro.getTime())) return false;
      return fechaRegistro >= inicioDelDia && fechaRegistro < finDelDia;
    });
  };

  const exportarQrActivosDelDia = async () => {
    const activosDia = obtenerActivosDelDia();

    if (activosDia.length === 0) {
      window.alert('No hay activos registrados en el día de hoy.');
      return;
    }

    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const fechaHoy = new Date().toLocaleDateString('es-MX');

      pdf.setFontSize(16);
      pdf.text('QR Activos del Día', 20, 20);
      pdf.setFontSize(10);
      pdf.text(`Fecha: ${fechaHoy}`, 20, 30);
      pdf.text(`Total de activos registrads hoy: ${activosDia.length}`, 20, 37);

      let yPosition = 50;
      const pageHeight = pdf.internal.pageSize.height;
      const maxYPosition = pageHeight - 20;

      for (let i = 0; i < activosDia.length; i += 1) {
        const activo = activosDia[i];

        if (yPosition > maxYPosition - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        const idActivo = String(activo.id_activo || activo.id || '');
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, idActivo, {
          width: 80,
          margin: 1,
        });

        const qrDataUrl = canvas.toDataURL('image/png');

        pdf.setFontSize(11);
        pdf.text(`ID: ${idActivo || 'N/A'}`, 20, yPosition);
        pdf.setFontSize(9);
        pdf.text(`Nombre: ${activo.nombre || 'N/A'}`, 20, yPosition + 8);
        pdf.text(`Aula: ${activo.aula || activo.id_aula || 'N/A'}`, 20, yPosition + 16);
        pdf.addImage(qrDataUrl, 'PNG', 120, yPosition - 5, 25, 25);

        // Separador visual entre registros
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.3);
        pdf.line(20, yPosition + 27, 190, yPosition + 27);

        yPosition += 35;
      }

      pdf.save(`qr_activos_dia_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF de QR del día:', error);
      window.alert('Error al generar el PDF. Intenta nuevamente.');
    }
  };

  return (
    <div className="space-y-4">
      
      <div className="flex items-center justify-between pb-2">
        <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Inventario de Activos</h1>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gestiona y monitorea todos tus activos</p>
        </div>
        <div className="flex items-center gap-2">
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition ${
            isDark 
              ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`} onClick={exportarPdfActivos}>
            <Download size={16} />
            Generar PDF
          </button>
          <button className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition ${
            isDark 
              ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`} onClick={exportarQrActivosDelDia}>
            <QrCode size={16} />
            QR Activos Registrados Hoy
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition" onClick={() => navigate('/activos/nuevo')}>
            <Plus size={16} />
            Nuevo Activo
          </button>
        </div>
      </div>

      <div className={`rounded-lg p-4 border transition ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
            <input
              type="text"
              placeholder="Buscar por ID o nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className={`px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${
            isDark
              ? 'bg-slate-700 border-slate-600 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <option value="todas">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option
                key={categoria.id_categoria}
                value={String(categoria.nombre || '').toLowerCase()}
              >
                {categoria.nombre}
              </option>
            ))}
          </select>

          <select
            value={estadoSeleccionado}
            onChange={(e) => setEstadoSeleccionado(e.target.value)}
            className={`px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${
            isDark
              ? 'bg-slate-700 border-slate-600 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <option value="todos">Todos los estados</option>
            {estadosDisponibles
              .filter((estado) => estado !== 'todos')
              .map((estado) => (
                <option key={estado} value={String(estado).toLowerCase()}>
                  {estado}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className={`rounded-lg border overflow-hidden transition ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="max-h-[28rem] overflow-auto">
          <table className="w-full">
            <thead className={`border-b transition ${
              isDark
                ? 'bg-slate-700 border-slate-600'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ACTIVO ID
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  NOMBRE
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  CATEGORIA
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  UBICACION
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ESTADO
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  FECHA REGISTRO
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {activosFiltrados.map((activo) => (
                <tr key={activo.id_activo ?? activo.id} className={`transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}>
                  <td className="px-4 py-3">
                    <span className={`font-semibold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{activo.id_activo}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className={`font-medium text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{activo.nombre}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Responsable: {[
                          [activo.responsable, activo.responsable_apellido].filter(Boolean).join(' ').trim(),
                          [activo.responsable_puesto, activo.responsable_area].filter(Boolean).join(' de ').trim()
                        ].filter(Boolean).join(' - ') || 'Sin responsable'}
                      </p>
                      {Array.isArray(activo.partes) && activo.partes.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {activo.partes.map((parte) => (
                            <p key={parte.id_parte} className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                              Parte {parte.numero_parte}: {parte.descripcion} | Aula: {parte.id_aula}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{activo.categoria}</td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{activo.aula}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold ${getEstadoBadgeColor(activo.estado)}`}>
                      {activo.estado}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{formatearFecha(activo.fecha_registro)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className={`p-2 rounded-lg transition ${
                        isDark
                          ? 'text-slate-500 hover:text-blue-400 hover:bg-blue-900/20'
                          : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                        onClick={()=>navigate(`/activos/editar/${activo.id_activo ?? activo.id}`,{
                          state:{
                            modo: 'editar',
                            activo: activo
                          }
                        })}
                      >
                        <Edit size={18} />
                      </button>
                      <button className={`p-2 rounded-lg transition ${
                        isDark
                          ? 'text-slate-500 hover:text-red-400 hover:bg-red-900/20'
                          : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                        onClick={()=>navigate(`/activos/eliminar/${activo.id_activo ?? activo.id}`,{
                          state:{
                            modo: 'eliminar',
                            activo: activo
                          }
                        })}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {activosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={7} className={`px-4 py-8 text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    No hay activos que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        
      </div>
    </div>
  );
};

export default Activos;