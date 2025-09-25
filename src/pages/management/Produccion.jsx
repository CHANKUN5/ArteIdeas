import {
  Clock,
  Edit,
  Eye,
  FileText,
  Frame,
  Package,
  Search,
  Send,
  Settings,
  Trash2,
  Truck,
  Wrench
} from 'lucide-react';
import { useState } from 'react';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';

const Produccion = () => {
  const [activeMainTab, setActiveMainTab] = useState('Enmarcados');
  const [activeSubTab, setActiveSubTab] = useState('Orden de Enmarcado');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [itemToSave, setItemToSave] = useState(null);
  const [saveAction, setSaveAction] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveChangesDialog, setShowSaveChangesDialog] = useState(false);
  const [itemToSaveChanges, setItemToSaveChanges] = useState(null);
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  // Configuración de pestañas principales
  const mainTabs = [
    { id: 'Enmarcados', label: 'Enmarcados', icon: Frame },
    { id: 'Minilab', label: 'Minilab', icon: Truck },
    { id: 'Recordatorios', label: 'Recordatorios', icon: Clock },
    { id: 'Corte Láser', label: 'Corte Láser', icon: Wrench },
    { id: 'Accesorios', label: 'Accesorios', icon: Package },
    { id: 'Edición Digital', label: 'Edición Digital', icon: Edit }
  ];

  // Configuración de sub-pestañas
  const subTabs = {
    'Enmarcados': [
      { id: 'Orden de Enmarcado', label: 'Orden de Enmarcado' },
      { id: 'En Proceso', label: 'En Proceso' },
      { id: 'Terminados', label: 'Terminados' },
      { id: 'Entregados', label: 'Entregados' }
    ],
    'Minilab': [
      { id: 'Orden de Impresión', label: 'Orden de Impresión' },
      { id: 'Mantenimiento', label: 'Mantenimiento' },
      { id: 'En Proceso', label: 'En Proceso' },
      { id: 'Completados', label: 'Completados' }
    ],
    'Recordatorios': [
      { id: 'Orden de Producción', label: 'Orden de Producción' },
      { id: 'Control de Avance', label: 'Control de Avance' },
      { id: 'En Proceso', label: 'En Proceso' },
      { id: 'Completados', label: 'Completados' }
    ],
    'Corte Láser': [
      { id: 'Orden de Corte', label: 'Orden de Corte' },
      { id: 'Registro de Productos', label: 'Registro de Productos' },
      { id: 'Mermas', label: 'Mermas' },
      { id: 'En Proceso', label: 'En Proceso' }
    ],
    'Accesorios': [
      { id: 'Consumo Automático', label: 'Consumo Automático' },
      { id: 'Registro Manual', label: 'Registro Manual' },
      { id: 'Stock', label: 'Stock' }
    ],
    'Edición Digital': [
      { id: 'Órdenes de Edición', label: 'Órdenes de Edición' },
      { id: 'Archivo Original', label: 'Archivo Original' },
      { id: 'Archivo Editado', label: 'Archivo Editado' },
      { id: 'Entrega', label: 'Entrega' }
    ]
  };

  // Datos de muestra iniciales
  const initialData = {
    'Enmarcados': {
      'Orden de Enmarcado': [
        {
          id: 1,
          cliente: 'María García',
          moldura: 'Clásica Negra',
          vidrio: 'Cristal 30x40',
          mdf: 'MDF Blanco',
          paspartu: 'Beige',
          accesorios: '4 colgadores',
          mermas: 0.5,
          fechaInicio: '2024-09-10',
          estadoEnvio: 'En proceso'
        },
        {
          id: 2,
          cliente: 'José Martínez',
          moldura: 'Moderna Blanca',
          vidrio: 'Cristal 20x30',
          mdf: 'MDF Negro',
          paspartu: 'Blanco',
          accesorios: '4 colgadores',
          mermas: 0.3,
          fechaInicio: '2024-09-11',
          estadoEnvio: 'Pendiente'
        }
      ],
      'En Proceso': [
        {
          id: 1,
          cliente: 'Carlos López',
          descripcion: 'Cuadro óleo 40x50',
          moldura: 'Dorada Antigua',
          mermas: 0.2,
          progreso: '60%',
          fechaInicio: '2024-09-11',
          estadoEnvio: 'En proceso'
        }
      ],
      'Terminados': [
        {
          id: 1,
          cliente: 'Ana Rodríguez',
          descripcion: 'Certificado 30x40',
          moldura: 'Clásica Negra',
          fechaTerminado: '2024-09-09',
          estadoEnvio: 'Listo para entrega'
        }
      ],
      'Entregados': [
        {
          id: 1,
          cliente: 'Pedro Sánchez',
          descripcion: 'Foto familiar 15x20',
          fechaEntrega: '2024-09-08',
          recibidoPor: 'Cliente',
          estadoEnvio: 'Entregado'
        }
      ]
    },
    'Minilab': {
      'Orden de Impresión': [
        {
          id: 1,
          cliente: 'Pedro Sánchez',
          tipoImpresion: 'Fotos 10x15',
          cantidad: 20,
          papel: 'Papel Brillante',
          quimicos: 'Revelador C-41',
          mermas: 0.1,
          prioridad: 'Normal',
          fechaSolicitud: '2024-09-11',
          estadoEnvio: 'En cola'
        },
        {
          id: 2,
          cliente: 'Carmen Vega',
          tipoImpresion: 'Poster A2',
          cantidad: 1,
          papel: 'Papel Mate',
          quimicos: 'Fijador Universal',
          mermas: 0.05,
          prioridad: 'Alta',
          fechaSolicitud: '2024-09-11',
          estadoEnvio: 'En cola'
        }
      ],
      'Mantenimiento': [
        {
          id: 1,
          equipo: 'Reveladora Kodak',
          repuesto: 'Engranaje principal',
          costo: 150.00,
          fecha: '2024-09-10',
          tecnico: 'Miguel Torres',
          estadoEnvio: 'Completado'
        }
      ],
      'En Proceso': [
        {
          id: 1,
          cliente: 'Laura Vega',
          tipoImpresion: 'Poster A3',
          cantidad: 2,
          operador: 'Miguel Torres',
          horaInicio: '14:30',
          estadoEnvio: 'Imprimiendo'
        }
      ],
      'Completados': [
        {
          id: 1,
          cliente: 'Roberto Díaz',
          tipoImpresion: 'Fotos 15x20',
          cantidad: 12,
          fechaCompletado: '2024-09-11',
          estadoEnvio: 'Listo para entrega'
        }
      ]
    },
    'Recordatorios': {
      'Orden de Producción': [
        {
          id: 1,
          colegio: 'Colegio San José',
          promocion: '2024',
          plantillas: 'Plantilla estándar',
          mdf: 'MDF Blanco 20x30',
          fotosImpresas: 50,
          mermas: 0.8,
          fechaInicio: '2024-09-10',
          estadoEnvio: 'En proceso'
        },
        {
          id: 2,
          colegio: 'Colegio María Auxiliadora',
          promocion: '2024',
          plantillas: 'Plantilla personalizada',
          mdf: 'MDF Negro 15x20',
          fotosImpresas: 30,
          mermas: 1.2,
          fechaInicio: '2024-09-11',
          estadoEnvio: 'Pendiente'
        }
      ],
      'Control de Avance': [
        {
          id: 1,
          orden: 'ORD-001',
          sesion: 'Completada',
          edicion: 'En proceso',
          impresion: 'Pendiente',
          entrega: 'Pendiente',
          progreso: '40%',
          estadoEnvio: 'En proceso'
        }
      ],
      'En Proceso': [
        {
          id: 1,
          colegio: 'Colegio San Martín',
          promocion: '2024',
          progreso: '60%',
          responsable: 'Ana García',
          fechaInicio: '2024-09-09',
          estadoEnvio: 'En proceso'
        }
      ],
      'Completados': [
        {
          id: 1,
          colegio: 'Colegio San Pedro',
          promocion: '2024',
          fechaCompletado: '2024-09-08',
          completadoPor: 'Carlos Ruiz',
          estadoEnvio: 'Completado'
        }
      ]
    },
    'Corte Láser': {
      'Orden de Corte': [
        {
          id: 1,
          cliente: 'Empresa XYZ',
          material: 'MDF Blanco',
          diseño: 'Letras corporativas',
          cantidad: 50,
          mermas: 0.5,
          fechaSolicitud: '2024-09-11',
          estadoEnvio: 'Pendiente'
        },
        {
          id: 2,
          cliente: 'Tienda ABC',
          material: 'Acrílico transparente',
          diseño: 'Señalización',
          cantidad: 20,
          mermas: 0.2,
          fechaSolicitud: '2024-09-10',
          estadoEnvio: 'En proceso'
        }
      ],
      'Registro de Productos': [
        {
          id: 1,
          producto: 'Letras MDF "BIENVENIDOS"',
          material: 'MDF Blanco',
          cantidad: 1,
          fechaCorte: '2024-09-10',
          estadoEnvio: 'Completado'
        }
      ],
      'Mermas': [
        {
          id: 1,
          material: 'MDF Blanco',
          desperdicio: '0.5 m²',
          costo: 25.00,
          fecha: '2024-09-10',
          estadoEnvio: 'Registrado'
        }
      ],
      'En Proceso': [
        {
          id: 1,
          cliente: 'Oficina Central',
          material: 'Cartón corrugado',
          diseño: 'Prototipo',
          progreso: '40%',
          fechaInicio: '2024-09-11',
          estadoEnvio: 'En proceso'
        }
      ]
    },
    'Accesorios': {
      'Consumo Automático': [
        {
          id: 1,
          orden: 'ORD-001',
          accesorio: 'Colgadores',
          cantidad: 4,
          mermas: 0,
          descuento: 'Automático',
          fecha: '2024-09-10',
          estadoEnvio: 'Descontado'
        }
      ],
      'Registro Manual': [
        {
          id: 1,
          accesorio: 'Tornillos',
          cantidad: 20,
          mermas: 0,
          motivo: 'Mantenimiento',
          responsable: 'Juan Pérez',
          fecha: '2024-09-11',
          estadoEnvio: 'Registrado'
        }
      ],
      'Stock': [
        {
          id: 1,
          accesorio: 'Grapas',
          stock: 500,
          stockMinimo: 100,
          proveedor: 'Ferretería Central',
          estadoEnvio: 'Disponible'
        }
      ]
    },
    'Edición Digital': {
      'Órdenes de Edición': [
        {
          id: 1,
          cliente: 'Studio Fotográfico ABC',
          tipoTrabajo: 'Retoque de retrato',
          cantidadFotos: 15,
          mermas: 0,
          fechaSolicitud: '2024-09-11',
          deadline: '2024-09-15',
          especialista: 'Diego Morales',
          estadoEnvio: 'En espera'
        }
      ],
      'Archivo Original': [
        {
          id: 1,
          cliente: 'Boda González-Martín',
          archivo: 'IMG_001.jpg',
          tamaño: '15.2 MB',
          fechaSubida: '2024-09-10',
          estadoEnvio: 'Recibido'
        }
      ],
      'Archivo Editado': [
        {
          id: 1,
          cliente: 'Evento Corporativo XYZ',
          archivo: 'IMG_001_editado.jpg',
          tamaño: '18.5 MB',
          fechaEdicion: '2024-09-11',
          estadoEnvio: 'Listo'
        }
      ],
      'Entrega': [
        {
          id: 1,
          cliente: 'Familia Rodríguez',
          archivos: 25,
          fechaEntrega: '2024-09-10',
          metodo: 'Descarga digital',
          estadoEnvio: 'Entregado'
        }
      ]
    }
  };

  // Inicializar datos si están vacíos
  const getCurrentData = () => {
    if (!data[activeMainTab] || !data[activeMainTab][activeSubTab]) {
      return initialData[activeMainTab]?.[activeSubTab] || [];
    }
    return data[activeMainTab][activeSubTab];
  };

  // Obtener configuración de columnas según la sección
  const getTableColumns = () => {
    if (activeMainTab === 'Enmarcados') {
      if (activeSubTab === 'Orden de Enmarcado') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'moldura', label: 'MOLDURA' },
          { key: 'vidrio', label: 'VIDRIO' },
          { key: 'mdf', label: 'MDF' },
          { key: 'paspartu', label: 'PASPARTÚ' },
          { key: 'accesorios', label: 'ACCESORIOS' },
          { key: 'mermas', label: 'MERMAS' },
          { key: 'fechaInicio', label: 'FECHA INICIO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'En Proceso') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'descripcion', label: 'DESCRIPCIÓN' },
          { key: 'moldura', label: 'MOLDURA' },
          { key: 'mermas', label: 'MERMAS' },
          { key: 'progreso', label: 'PROGRESO' },
          { key: 'fechaInicio', label: 'FECHA INICIO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'Terminados') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'descripcion', label: 'DESCRIPCIÓN' },
          { key: 'moldura', label: 'MOLDURA' },
          { key: 'fechaTerminado', label: 'FECHA TERMINADO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'Entregados') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'descripcion', label: 'DESCRIPCIÓN' },
          { key: 'fechaEntrega', label: 'FECHA ENTREGA' },
          { key: 'recibidoPor', label: 'RECIBIDO POR' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      }
    } else if (activeMainTab === 'Minilab') {
      if (activeSubTab === 'Orden de Impresión') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'tipoImpresion', label: 'TIPO IMPRESIÓN' },
          { key: 'cantidad', label: 'CANTIDAD' },
          { key: 'papel', label: 'PAPEL' },
          { key: 'quimicos', label: 'QUÍMICOS' },
          { key: 'mermas', label: 'MERMAS' },
          { key: 'prioridad', label: 'PRIORIDAD' },
          { key: 'fechaSolicitud', label: 'FECHA SOLICITUD' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'Mantenimiento') {
        return [
          { key: 'equipo', label: 'EQUIPO' },
          { key: 'repuesto', label: 'REPUESTO' },
          { key: 'costo', label: 'COSTO' },
          { key: 'fecha', label: 'FECHA' },
          { key: 'tecnico', label: 'TÉCNICO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'En Proceso') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'tipoImpresion', label: 'TIPO IMPRESIÓN' },
          { key: 'cantidad', label: 'CANTIDAD' },
          { key: 'operador', label: 'OPERADOR' },
          { key: 'horaInicio', label: 'HORA INICIO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'Completados') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'tipoImpresion', label: 'TIPO IMPRESIÓN' },
          { key: 'cantidad', label: 'CANTIDAD' },
          { key: 'fechaCompletado', label: 'FECHA COMPLETADO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      }
    } else if (activeMainTab === 'Recordatorios') {
      if (activeSubTab === 'Orden de Producción') {
        return [
          { key: 'colegio', label: 'COLEGIO' },
          { key: 'promocion', label: 'PROMOCIÓN' },
          { key: 'plantillas', label: 'PLANTILLAS' },
          { key: 'mdf', label: 'MDF' },
          { key: 'fotosImpresas', label: 'FOTOS IMPRESAS' },
          { key: 'mermas', label: 'MERMAS' },
          { key: 'fechaInicio', label: 'FECHA INICIO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'Control de Avance') {
        return [
          { key: 'orden', label: 'ORDEN' },
          { key: 'sesion', label: 'SESIÓN' },
          { key: 'edicion', label: 'EDICIÓN' },
          { key: 'impresion', label: 'IMPRESIÓN' },
          { key: 'entrega', label: 'ENTREGA' },
          { key: 'progreso', label: 'PROGRESO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'En Proceso') {
        return [
          { key: 'colegio', label: 'COLEGIO' },
          { key: 'promocion', label: 'PROMOCIÓN' },
          { key: 'progreso', label: 'PROGRESO' },
          { key: 'responsable', label: 'RESPONSABLE' },
          { key: 'fechaInicio', label: 'FECHA INICIO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'Completados') {
        return [
          { key: 'colegio', label: 'COLEGIO' },
          { key: 'promocion', label: 'PROMOCIÓN' },
          { key: 'fechaCompletado', label: 'FECHA COMPLETADO' },
          { key: 'completadoPor', label: 'COMPLETADO POR' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      }
    } else if (activeMainTab === 'Corte Láser') {
      if (activeSubTab === 'Orden de Corte') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'material', label: 'MATERIAL' },
          { key: 'diseño', label: 'DISEÑO' },
          { key: 'cantidad', label: 'CANTIDAD' },
          { key: 'mermas', label: 'MERMAS' },
          { key: 'fechaSolicitud', label: 'FECHA SOLICITUD' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'Registro de Productos') {
        return [
          { key: 'producto', label: 'PRODUCTO' },
          { key: 'material', label: 'MATERIAL' },
          { key: 'cantidad', label: 'CANTIDAD' },
          { key: 'fechaCorte', label: 'FECHA CORTE' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'Mermas') {
        return [
          { key: 'material', label: 'MATERIAL' },
          { key: 'desperdicio', label: 'DESPERDICIO' },
          { key: 'costo', label: 'COSTO' },
          { key: 'fecha', label: 'FECHA' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'En Proceso') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'material', label: 'MATERIAL' },
          { key: 'diseño', label: 'DISEÑO' },
          { key: 'progreso', label: 'PROGRESO' },
          { key: 'fechaInicio', label: 'FECHA INICIO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      }
    } else if (activeMainTab === 'Accesorios') {
      if (activeSubTab === 'Consumo Automático') {
        return [
          { key: 'orden', label: 'ORDEN' },
          { key: 'accesorio', label: 'ACCESORIO' },
          { key: 'cantidad', label: 'CANTIDAD' },
          { key: 'mermas', label: 'MERMAS' },
          { key: 'descuento', label: 'DESCUENTO' },
          { key: 'fecha', label: 'FECHA' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'Registro Manual') {
        return [
          { key: 'accesorio', label: 'ACCESORIO' },
          { key: 'cantidad', label: 'CANTIDAD' },
          { key: 'mermas', label: 'MERMAS' },
          { key: 'motivo', label: 'MOTIVO' },
          { key: 'responsable', label: 'RESPONSABLE' },
          { key: 'fecha', label: 'FECHA' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'Stock') {
        return [
          { key: 'accesorio', label: 'ACCESORIO' },
          { key: 'stock', label: 'STOCK' },
          { key: 'stockMinimo', label: 'STOCK MÍNIMO' },
          { key: 'proveedor', label: 'PROVEEDOR' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      }
    } else if (activeMainTab === 'Edición Digital') {
      if (activeSubTab === 'Órdenes de Edición') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'tipoTrabajo', label: 'TIPO TRABAJO' },
          { key: 'cantidadFotos', label: 'CANTIDAD FOTOS' },
          { key: 'mermas', label: 'MERMAS' },
          { key: 'fechaSolicitud', label: 'FECHA SOLICITUD' },
          { key: 'deadline', label: 'DEADLINE' },
          { key: 'especialista', label: 'ESPECIALISTA' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'Archivo Original') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'archivo', label: 'ARCHIVO' },
          { key: 'tamaño', label: 'TAMAÑO' },
          { key: 'fechaSubida', label: 'FECHA SUBIDA' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'Archivo Editado') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'archivo', label: 'ARCHIVO' },
          { key: 'tamaño', label: 'TAMAÑO' },
          { key: 'fechaEdicion', label: 'FECHA EDICIÓN' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'Entrega') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'archivos', label: 'ARCHIVOS' },
          { key: 'fechaEntrega', label: 'FECHA ENTREGA' },
          { key: 'metodo', label: 'MÉTODO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      }
    }
    
    return [];
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(getCurrentData().map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditItem = (item) => {
    setItemToSave(item);
    setSaveAction('edit');
    setShowSaveDialog(true);
  };

  const handleSwitchToEdit = () => {
    setModalType('edit');
  };

  const handleDeleteItem = (item) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      // Actualizar los datos eliminando el elemento
      setData(prevData => {
        const newData = { ...prevData };
        if (!newData[activeMainTab]) newData[activeMainTab] = {};
        if (!newData[activeMainTab][activeSubTab]) {
          newData[activeMainTab][activeSubTab] = [...initialData[activeMainTab][activeSubTab]];
        }
        newData[activeMainTab][activeSubTab] = newData[activeMainTab][activeSubTab].filter(i => i.id !== itemToDelete.id);
        return newData;
      });
      
      // Quitar de seleccionados si estaba seleccionado
      setSelectedItems(prev => prev.filter(id => id !== itemToDelete.id));
      
      setShowDeleteDialog(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error during deletion:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const handleSaveItem = (updatedItem) => {
    setItemToSaveChanges(updatedItem);
    setShowSaveChangesDialog(true);
  };

  const handleSaveConfirm = async () => {
    if (!itemToSave) return;
    
    setIsSaving(true);
    try {
      if (saveAction === 'edit') {
        setSelectedItem(itemToSave);
        setModalType('edit');
        setShowModal(true);
      } else if (saveAction === 'add') {
        setData(prevData => {
          const newData = { ...prevData };
          if (!newData[activeMainTab]) newData[activeMainTab] = {};
          if (!newData[activeMainTab][activeSubTab]) {
            newData[activeMainTab][activeSubTab] = [...(initialData[activeMainTab]?.[activeSubTab] || [])];
          }
          
          newData[activeMainTab][activeSubTab].push(itemToSave);
          return newData;
        });
      }
      
      setShowSaveDialog(false);
      setItemToSave(null);
      setSaveAction('');
    } catch (error) {
      console.error('Error during save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCancel = () => {
    setShowSaveDialog(false);
    setItemToSave(null);
    setSaveAction('');
  };

  const handleSaveChangesConfirm = async () => {
    if (!itemToSaveChanges) return;
    
    setIsSavingChanges(true);
    try {
      setData(prevData => {
        const newData = { ...prevData };
        if (!newData[activeMainTab]) newData[activeMainTab] = {};
        if (!newData[activeMainTab][activeSubTab]) {
          newData[activeMainTab][activeSubTab] = [...initialData[activeMainTab][activeSubTab]];
        }
        
        const index = newData[activeMainTab][activeSubTab].findIndex(item => item.id === itemToSaveChanges.id);
        if (index !== -1) {
          newData[activeMainTab][activeSubTab][index] = itemToSaveChanges;
        }
        
        return newData;
      });
      
      setShowModal(false);
      setSelectedItem(null);
      setShowSaveChangesDialog(false);
      setItemToSaveChanges(null);
    } catch (error) {
      console.error('Error during save changes:', error);
    } finally {
      setIsSavingChanges(false);
    }
  };

  const handleSaveChangesCancel = () => {
    setShowSaveChangesDialog(false);
    setItemToSaveChanges(null);
  };

  const handleAddNew = () => {
    const newId = Math.max(...getCurrentData().map(item => item.id), 0) + 1;
    const columns = getTableColumns();
    
    // Crear un nuevo elemento con campos básicos según las columnas
    const newItem = { id: newId };
    columns.forEach(col => {
      if (col.key !== 'acciones' && col.key !== 'inventario') {
        switch (col.key) {
          case 'estadoEnvio':
            newItem[col.key] = 'Pendiente';
            break;
          case 'progreso':
            newItem[col.key] = '0%';
            break;
          case 'cantidad':
          case 'cantidadFotos':
            newItem[col.key] = 1;
            break;
          case 'prioridad':
            newItem[col.key] = 'Normal';
            break;
          case 'mermas':
          case 'desperdicio':
            newItem[col.key] = 0;
            break;
          default:
            newItem[col.key] = '';
        }
      }
    });
    
    setSelectedItem(newItem);
    setModalType('add');
    setShowModal(true);
  };

  const handleSaveNewItem = (newItem) => {
    setItemToSave(newItem);
    setSaveAction('add');
    setShowSaveDialog(true);
  };

  const handleSendToProductos = () => {
    if (selectedItems.length === 0) {
      alert('Por favor selecciona al menos un elemento para enviar');
      return;
    }

    const selectedRecetas = getCurrentData().filter(item => selectedItems.includes(item.id));
    
    // Convertir objetos a productos terminados
    const productosTerminados = selectedRecetas.map(objeto => ({
      id: Math.max(...(data['Producción Interna']?.['Productos Terminados'] || initialData['Producción Interna']['Productos Terminados']).map(p => p.id), 0) + objeto.id,
      producto: objeto.productoTerminado,
      cantidad: 1,
      fechaTerminado: new Date().toISOString().split('T')[0],
      calidad: 'Pendiente de revisión',
      estadoEnvio: 'Producido'
    }));

    // Agregar a productos terminados
    setData(prevData => {
      const newData = { ...prevData };
      if (!newData['Producción Interna']) newData['Producción Interna'] = {};
      if (!newData['Producción Interna']['Productos Terminados']) {
        newData['Producción Interna']['Productos Terminados'] = [...initialData['Producción Interna']['Productos Terminados']];
      }
      
      newData['Producción Interna']['Productos Terminados'].push(...productosTerminados);
      
      // Actualizar estado de los objetos enviados
      if (!newData['Producción Interna']['Objetos']) {
        newData['Producción Interna']['Objetos'] = [...initialData['Producción Interna']['Objetos']];
      }
      
      newData['Producción Interna']['Objetos'] = newData['Producción Interna']['Objetos'].map(objeto => 
        selectedItems.includes(objeto.id) 
          ? { ...objeto, estadoEnvio: 'Enviado a Productos' }
          : objeto
      );
      
      return newData;
    });

    setSelectedItems([]);
    alert(`${selectedRecetas.length} objeto(s) enviado(s) a Productos Terminados`);
  };

  const handleInventoryDiscount = (item) => {
    // Obtener inventario desde localStorage
    const inventoryData = JSON.parse(localStorage.getItem('inventoryData') || '[]');
    
    // Simular consumo de materiales según el tipo de orden
    const materialsToConsume = getMaterialsForOrder(item);
    
    // Descontar materiales del inventario
    const updatedInventory = inventoryData.map(invItem => {
      const consumed = materialsToConsume.find(m => m.nombre === invItem.nombre);
      if (consumed) {
        const newStock = Math.max(0, invItem.stock - consumed.cantidad);
        return {
          ...invItem,
          stock: newStock,
          ultimaVenta: new Date().toISOString().split('T')[0]
        };
      }
      return invItem;
    });
    
    // Guardar inventario actualizado
    localStorage.setItem('inventoryData', JSON.stringify(updatedInventory));
    
    alert(`Materiales descontados del inventario para: ${item.productoTerminado || item.producto || 'producto'}`);
  };

  // Función para obtener materiales necesarios según el tipo de orden
  const getMaterialsForOrder = (item) => {
    const materials = [];
    
    // Simular consumo de materiales según categoría
    if (activeMainTab === 'Enmarcados') {
      materials.push(
        { nombre: 'Moldura Clásica', cantidad: 1 },
        { nombre: 'Vidrio Cristal', cantidad: 1 },
        { nombre: 'MDF Blanco', cantidad: 1 },
        { nombre: 'Colgadores', cantidad: 4 }
      );
    } else if (activeMainTab === 'Minilab') {
      materials.push(
        { nombre: 'Papel Fotográfico', cantidad: item.cantidad || 1 },
        { nombre: 'Revelador C-41', cantidad: 0.1 }
      );
    } else if (activeMainTab === 'Corte Láser') {
      materials.push(
        { nombre: 'MDF Blanco', cantidad: 0.5 },
        { nombre: 'Acrílico', cantidad: 0.3 }
      );
    }
    
    return materials;
  };

  const getEstadoEnvioColor = (estado) => {
    switch (estado) {
      case 'No enviado':
      case 'Pendiente':
      case 'En cola':
      case 'En espera':
      case 'Boceto en proceso':
      case 'En diseño':
        return 'text-yellow-600 bg-yellow-100';
      case 'Enviado':
      case 'Listo para entrega':
      case 'Aprobado para envío':
      case 'Enviado a Productos':
      case 'Producido':
        return 'text-blue-600 bg-blue-100';
      case 'Entregado':
      case 'Completado':
      case 'Aprobado':
        return 'text-green-600 bg-green-100';
      case 'En proceso':
      case 'Imprimiendo':
      case 'En retoque':
      case 'Pintura en proceso':
      case 'En edición':
        return 'text-purple-600 bg-purple-100';
      case 'Alta':
        return 'text-red-600 bg-red-100';
      case 'Media':
        return 'text-orange-600 bg-orange-100';
      case 'Normal':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredData = getCurrentData().filter(item => 
    Object.values(item).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const columns = getTableColumns();

  return (
    <div className="responsive-mobile">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#E0F9FD] rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-[#1DD1E3]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Producción</h1>
            <p className="text-sm text-gray-500">Seguimiento de trabajos en proceso</p>
          </div>
        </div>
      </div>

      {/* Pestañas principales */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveMainTab(tab.id);
                  setActiveSubTab(subTabs[tab.id]?.[0]?.id || '');
                  setSelectedItems([]);
                }}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                  activeMainTab === tab.id
                    ? 'bg-[#1DD1E3] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Título de la sección */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeMainTab} - {activeSubTab}
          </h2>
        </div>

        {/* Sub-pestañas */}
        {subTabs[activeMainTab] && (
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex space-x-1 overflow-x-auto">
              {subTabs[activeMainTab].map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => {
                    setActiveSubTab(subTab.id);
                    setSelectedItems([]);
                  }}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                    activeSubTab === subTab.id
                      ? 'bg-[#1DD1E3] text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Herramientas */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleAddNew}
                className="flex items-center space-x-2 px-3 py-2 bg-[#1DD1E3] text-white rounded-lg hover:bg-[#19BED1] transition-colors text-sm"
              >
                <Settings className="w-4 h-4" />
                <span>Registrar Artículo</span>
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Buscar ${activeSubTab.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1DD1E3] focus:border-transparent outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 focus:ring-[#1DD1E3]"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                {columns.map((col) => (
                  <th key={col.key} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300 focus:ring-[#1DD1E3]"
                    />
                  </td>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-4">
                      {col.key === 'acciones' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewItem(item)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-yellow-600 hover:text-yellow-800"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : col.key === 'inventario' && activeMainTab === 'Producción Interna' && activeSubTab === 'Objetos' ? (
                        <button
                          onClick={() => handleInventoryDiscount(item)}
                          className="text-red-600 hover:text-red-800 cursor-pointer text-sm font-medium"
                        >
                          — Descontar
                        </button>
                      ) : col.key === 'estadoEnvio' || col.key === 'prioridad' ? (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoEnvioColor(item[col.key])}`}>
                          {item[col.key]}
                        </span>
                      ) : col.key === 'progreso' ? (
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-[#1DD1E3] h-2 rounded-full" 
                              style={{width: item[col.key]}}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{item[col.key]}</span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900 break-words">
                          {item[col.key]}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mensaje si no hay datos */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {searchTerm ? 'No se encontraron resultados' : `No hay ${activeSubTab.toLowerCase()} registrados`}
            </div>
          </div>
        )}

        {/* Paginación */}
        {filteredData.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Página 1 de 1
              </span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                  Anterior
                </button>
                <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Botón de enviar seleccionados abajo de la tabla */}
        {selectedItems.length > 0 && activeMainTab === 'Producción Interna' && activeSubTab === 'Objetos' && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-center">
              <button 
                onClick={handleSendToProductos}
                className="flex items-center space-x-2 px-4 py-3 bg-[#1DD1E3] text-white rounded-lg hover:bg-[#19BED1] transition-colors shadow-sm text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Enviar seleccionados a Productos Terminados</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para ver/editar/agregar */}
      {showModal && selectedItem && (
        <ModalForm
          item={selectedItem}
          modalType={modalType}
          activeSubTab={activeSubTab}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
          onSave={modalType === 'add' ? handleSaveNewItem : handleSaveItem}
          onSwitchToEdit={modalType === 'view' ? handleSwitchToEdit : undefined}
        />
      )}

      {/* Confirmation Dialog para eliminar */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Elemento"
        message="¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Confirmation Dialog para guardar */}
      <ConfirmationDialog
        isOpen={showSaveDialog}
        onClose={handleSaveCancel}
        onConfirm={handleSaveConfirm}
        title={saveAction === 'add' ? "Agregar Elemento" : "Editar Elemento"}
        message={saveAction === 'add' ? "¿Estás seguro de que quieres agregar este elemento?" : "¿Estás seguro de que quieres editar este elemento?"}
        confirmText={saveAction === 'add' ? "Sí, agregar" : "Sí, editar"}
        cancelText="Cancelar"
        type="info"
        isLoading={isSaving}
      />

      {/* Confirmation Dialog para guardar cambios */}
      <ConfirmationDialog
        isOpen={showSaveChangesDialog}
        onClose={handleSaveChangesCancel}
        onConfirm={handleSaveChangesConfirm}
        title="Guardar Cambios"
        message="¿Estás seguro de que quieres guardar los cambios realizados?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        type="warning"
        isLoading={isSavingChanges}
      />
    </div>
  );
};

// Componente Modal separado para mejor organización
const ModalForm = ({ item, modalType, activeSubTab, onClose, onSave, onSwitchToEdit }) => {
  const [formData, setFormData] = useState(item);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Validación obligatoria de mermas
    if (formData.mermas === undefined || formData.mermas === '' || formData.mermas === null) {
      alert('Las mermas son obligatorias. Debe registrar el desperdicio (mínimo 0)');
      return;
    }
    
    // Validar que las mermas sean un número válido
    const mermasValue = parseFloat(formData.mermas);
    if (isNaN(mermasValue) || mermasValue < 0) {
      alert('Las mermas deben ser un número válido mayor o igual a 0');
      return;
    }
    
    onSave(formData);
  };

  const getFieldLabel = (key) => {
    const labels = {
      'productoTerminado': 'Producto Terminado',
      'materialesUsados': 'Materiales Usados',
      'mermas': 'Mermas (Obligatorio)',
      'desperdicio': 'Desperdicio (Obligatorio)',
      'estadoEnvio': 'Estado Envío',
      'producto': 'Producto',
      'cantidad': 'Cantidad',
      'fechaTerminado': 'Fecha Terminado',
      'calidad': 'Calidad',
      'inspector': 'Inspector',
      'fechaInspeccion': 'Fecha Inspección',
      'resultado': 'Resultado',
      'observaciones': 'Observaciones',
      'cliente': 'Cliente',
      'descripcion': 'Descripción',
      'moldura': 'Moldura',
      'fechaInicio': 'Fecha Inicio',
      'progreso': 'Progreso',
      'fechaEntrega': 'Fecha Entrega',
      'recibidoPor': 'Recibido Por',
      'tipoImpresion': 'Tipo Impresión',
      'prioridad': 'Prioridad',
      'fechaSolicitud': 'Fecha Solicitud',
      'operador': 'Operador',
      'horaInicio': 'Hora Inicio',
      'fechaCompletado': 'Fecha Completado',
      'titulo': 'Título',
      'fechaVencimiento': 'Fecha Vencimiento',
      'asignado': 'Asignado',
      'responsable': 'Responsable',
      'completadoPor': 'Completado Por',
      'tipoTrabajo': 'Tipo Trabajo',
      'cantidadFotos': 'Cantidad Fotos',
      'deadline': 'Deadline',
      'especialista': 'Especialista',
      'fechaFinalizacion': 'Fecha Finalización',
      'tipoObra': 'Tipo Obra',
      'dimensiones': 'Dimensiones',
      'artista': 'Artista',
      'referencia': 'Referencia',
      'tipoProyecto': 'Tipo Proyecto',
      'diseñador': 'Diseñador',
      'revision': 'Revisión',
      'fechaAprobacion': 'Fecha Aprobación'
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {modalType === 'view' && 'Ver Detalles'}
              {modalType === 'edit' && 'Editar'}
              {modalType === 'add' && 'Agregar Nuevo'}
              {' - ' + (activeSubTab === 'Objetos' ? 'Objeto' : activeSubTab)}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => {
              if (key === 'id') return null;
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getFieldLabel(key)}
                  </label>
                  {modalType === 'view' ? (
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                      {value}
                    </div>
                  ) : key === 'estadoEnvio' ? (
                    <select
                      value={value}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1DD1E3] focus:border-transparent"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Completado">Completado</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                  ) : key === 'prioridad' ? (
                    <select
                      value={value}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1DD1E3] focus:border-transparent"
                    >
                      <option value="Baja">Baja</option>
                      <option value="Normal">Normal</option>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                    </select>
                  ) : key.includes('fecha') || key === 'deadline' ? (
                    <input
                      type="date"
                      value={value}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1DD1E3] focus:border-transparent"
                    />
                  ) : key === 'cantidad' || key === 'cantidadFotos' ? (
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1DD1E3] focus:border-transparent"
                      min="1"
                    />
                  ) : key === 'descripcion' || key === 'observaciones' ? (
                    <textarea
                      value={value}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1DD1E3] focus:border-transparent"
                      rows="3"
                    />
                  ) : key === 'mermas' || key === 'desperdicio' ? (
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1DD1E3] focus:border-transparent"
                      min="0"
                      step="0.01"
                      placeholder="Ej: 0.5"
                      required
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1DD1E3] focus:border-transparent"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {modalType === 'view' ? 'Cerrar' : 'Cancelar'}
          </button>
          {modalType === 'view' && onSwitchToEdit && (
            <button
              onClick={onSwitchToEdit}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1DD1E3] border border-transparent rounded-md hover:bg-[#19BED1]"
            >
              Editar
            </button>
          )}
          {(modalType === 'edit' || modalType === 'add') && (
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1DD1E3] border border-transparent rounded-md hover:bg-[#19BED1]"
            >
              {modalType === 'add' ? 'Agregar' : 'Guardar Cambios'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Produccion;
