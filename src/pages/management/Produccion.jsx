import {
  Clock,
  Edit,
  Eye,
  FileText,
  Frame,
  Palette,
  Search,
  Send,
  Settings,
  Trash2,
  Truck
} from 'lucide-react';
import { useState } from 'react';

const Produccion = () => {
  const [activeMainTab, setActiveMainTab] = useState('Producción Interna');
  const [activeSubTab, setActiveSubTab] = useState('Objetos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState({});

  // Configuración de pestañas principales
  const mainTabs = [
    { id: 'Producción Interna', label: 'Producción Interna', icon: Settings },
    { id: 'Enmarcado', label: 'Enmarcado', icon: Frame },
    { id: 'Minilab', label: 'Minilab', icon: Truck },
    { id: 'Recordatorios', label: 'Recordatorios', icon: Clock },
    { id: 'Retoque Digital', label: 'Retoque Digital', icon: Edit },
    { id: 'Pintura al Óleo', label: 'Pintura al Óleo', icon: Palette },
    { id: 'Edición Gráfica', label: 'Edición Gráfica', icon: FileText }
  ];

  // Configuración de sub-pestañas
  const subTabs = {
    'Producción Interna': [
      { id: 'Objetos', label: 'Objetos' },
      { id: 'Productos Terminados', label: 'Productos Terminados' },
      { id: 'Control de Calidad', label: 'Control de Calidad' }
    ],
    'Enmarcado': [
      { id: 'En Proceso', label: 'En Proceso' },
      { id: 'Terminados', label: 'Terminados' },
      { id: 'Entregados', label: 'Entregados' }
    ],
    'Minilab': [
      { id: 'Cola de Impresión', label: 'Cola de Impresión' },
      { id: 'En Proceso', label: 'En Proceso' },
      { id: 'Completados', label: 'Completados' }
    ],
    'Recordatorios': [
      { id: 'Pendientes', label: 'Pendientes' },
      { id: 'En Proceso', label: 'En Proceso' },
      { id: 'Completados', label: 'Completados' }
    ],
    'Retoque Digital': [
      { id: 'Por Iniciar', label: 'Por Iniciar' },
      { id: 'En Retoque', label: 'En Retoque' },
      { id: 'Finalizados', label: 'Finalizados' }
    ],
    'Pintura al Óleo': [
      { id: 'Bocetos', label: 'Bocetos' },
      { id: 'En Proceso', label: 'En Proceso' },
      { id: 'Terminados', label: 'Terminados' }
    ],
    'Edición Gráfica': [
      { id: 'Diseños', label: 'Diseños' },
      { id: 'En Edición', label: 'En Edición' },
      { id: 'Aprobados', label: 'Aprobados' }
    ]
  };

  // Datos de muestra iniciales
  const initialData = {
    'Producción Interna': {
      'Objetos': [
        {
          id: 1,
          productoTerminado: 'Marco 30x40',
          materialesUsados: 'Madera, Vidrio',
          mermas: '0.5 cm',
          estadoEnvio: 'No enviado'
        },
        {
          id: 2,
          productoTerminado: 'Marco 20x30',
          materialesUsados: 'Madera, Vidrio',
          mermas: '0.3 cm',
          estadoEnvio: 'No enviado'
        },
        {
          id: 3,
          productoTerminado: 'Marco 40x50',
          materialesUsados: 'Madera, Vidrio',
          mermas: '0.7 cm',
          estadoEnvio: 'No enviado'
        },
        {
          id: 4,
          productoTerminado: 'Marco 15x20',
          materialesUsados: 'Madera, Vidrio',
          mermas: '0.2 cm',
          estadoEnvio: 'No enviado'
        }
      ],
      'Productos Terminados': [
        {
          id: 1,
          producto: 'Marco Clásico 30x40',
          cantidad: 5,
          fechaTerminado: '2024-09-10',
          calidad: 'Excelente',
          estadoEnvio: 'Enviado'
        },
        {
          id: 2,
          producto: 'Marco Moderno 20x30',
          cantidad: 8,
          fechaTerminado: '2024-09-11',
          calidad: 'Buena',
          estadoEnvio: 'Pendiente'
        }
      ],
      'Control de Calidad': [
        {
          id: 1,
          producto: 'Marco 30x40',
          inspector: 'Juan Pérez',
          fechaInspeccion: '2024-09-11',
          resultado: 'Aprobado',
          observaciones: 'Sin defectos',
          estadoEnvio: 'Aprobado para envío'
        }
      ]
    },
    'Enmarcado': {
      'En Proceso': [
        {
          id: 1,
          cliente: 'María García',
          descripcion: 'Foto familiar 20x30',
          moldura: 'Clásica Negra',
          fechaInicio: '2024-09-10',
          progreso: '60%',
          estadoEnvio: 'En proceso'
        },
        {
          id: 2,
          cliente: 'José Martínez',
          descripcion: 'Cuadro abstracto 40x60',
          moldura: 'Moderna Blanca',
          fechaInicio: '2024-09-11',
          progreso: '25%',
          estadoEnvio: 'En proceso'
        }
      ],
      'Terminados': [
        {
          id: 1,
          cliente: 'Carlos López',
          descripcion: 'Cuadro óleo 40x50',
          moldura: 'Dorada Antigua',
          fechaTerminado: '2024-09-11',
          estadoEnvio: 'Listo para entrega'
        }
      ],
      'Entregados': [
        {
          id: 1,
          cliente: 'Ana Rodríguez',
          descripcion: 'Certificado 30x40',
          fechaEntrega: '2024-09-09',
          recibidoPor: 'Cliente',
          estadoEnvio: 'Entregado'
        }
      ]
    },
    'Minilab': {
      'Cola de Impresión': [
        {
          id: 1,
          cliente: 'Pedro Sánchez',
          tipoImpresion: 'Fotos 10x15',
          cantidad: 20,
          prioridad: 'Normal',
          fechaSolicitud: '2024-09-11',
          estadoEnvio: 'En cola'
        },
        {
          id: 2,
          cliente: 'Carmen Vega',
          tipoImpresion: 'Poster A2',
          cantidad: 1,
          prioridad: 'Alta',
          fechaSolicitud: '2024-09-11',
          estadoEnvio: 'En cola'
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
      'Pendientes': [
        {
          id: 1,
          titulo: 'Llamar a proveedor de madera',
          descripcion: 'Revisar disponibilidad de molduras clásicas',
          fechaVencimiento: '2024-09-12',
          prioridad: 'Alta',
          asignado: 'Juan Pérez',
          estadoEnvio: 'Pendiente'
        },
        {
          id: 2,
          titulo: 'Revisión de inventario',
          descripcion: 'Contar stock de vidrios de diferentes tamaños',
          fechaVencimiento: '2024-09-13',
          prioridad: 'Media',
          asignado: 'María López',
          estadoEnvio: 'Pendiente'
        }
      ],
      'En Proceso': [
        {
          id: 1,
          titulo: 'Mantenimiento de máquina de corte',
          descripcion: 'Calibración y limpieza mensual',
          fechaInicio: '2024-09-11',
          responsable: 'Carlos Ruiz',
          progreso: '50%',
          estadoEnvio: 'En proceso'
        }
      ],
      'Completados': [
        {
          id: 1,
          titulo: 'Pedido de materiales',
          descripcion: 'Compra de adhesivos y herrajes',
          fechaCompletado: '2024-09-10',
          completadoPor: 'Ana García',
          estadoEnvio: 'Completado'
        }
      ]
    },
    'Retoque Digital': {
      'Por Iniciar': [
        {
          id: 1,
          cliente: 'Studio Fotográfico ABC',
          tipoTrabajo: 'Retrato profesional',
          cantidadFotos: 15,
          fechaSolicitud: '2024-09-11',
          deadline: '2024-09-15',
          especialista: 'Sin asignar',
          estadoEnvio: 'En espera'
        },
        {
          id: 2,
          cliente: 'Boda González-Martín',
          tipoTrabajo: 'Álbum de boda',
          cantidadFotos: 120,
          fechaSolicitud: '2024-09-10',
          deadline: '2024-09-20',
          especialista: 'Sin asignar',
          estadoEnvio: 'En espera'
        }
      ],
      'En Retoque': [
        {
          id: 1,
          cliente: 'Evento Corporativo XYZ',
          tipoTrabajo: 'Fotos de evento',
          cantidadFotos: 80,
          especialista: 'Diego Morales',
          fechaInicio: '2024-09-11',
          progreso: '30%',
          estadoEnvio: 'En proceso'
        }
      ],
      'Finalizados': [
        {
          id: 1,
          cliente: 'Familia Rodríguez',
          tipoTrabajo: 'Sesión familiar',
          cantidadFotos: 25,
          especialista: 'Laura Vega',
          fechaFinalizacion: '2024-09-10',
          estadoEnvio: 'Listo para entrega'
        }
      ]
    },
    'Pintura al Óleo': {
      'Bocetos': [
        {
          id: 1,
          cliente: 'María Fernández',
          tipoObra: 'Retrato',
          dimensiones: '40x60 cm',
          artista: 'Elena Castro',
          fechaInicio: '2024-09-11',
          referencia: 'Fotografía familiar',
          estadoEnvio: 'Boceto en proceso'
        },
        {
          id: 2,
          cliente: 'Galería Arte Moderno',
          tipoObra: 'Paisaje',
          dimensiones: '80x120 cm',
          artista: 'Roberto Silva',
          fechaInicio: '2024-09-10',
          referencia: 'Paisaje montañoso',
          estadoEnvio: 'Boceto en proceso'
        }
      ],
      'En Proceso': [
        {
          id: 1,
          cliente: 'Hotel Boutique',
          tipoObra: 'Abstracto',
          dimensiones: '60x80 cm',
          artista: 'Carmen López',
          fechaInicio: '2024-09-08',
          progreso: '60%',
          estadoEnvio: 'Pintura en proceso'
        }
      ],
      'Terminados': [
        {
          id: 1,
          cliente: 'Colección Privada',
          tipoObra: 'Naturaleza muerta',
          dimensiones: '50x70 cm',
          artista: 'Miguel Torres',
          fechaTerminado: '2024-09-09',
          estadoEnvio: 'Listo para entrega'
        }
      ]
    },
    'Edición Gráfica': {
      'Diseños': [
        {
          id: 1,
          cliente: 'Empresa ABC',
          tipoProyecto: 'Logo corporativo',
          diseñador: 'Ana Martínez',
          fechaSolicitud: '2024-09-11',
          deadline: '2024-09-18',
          revision: 'Primera versión',
          estadoEnvio: 'En diseño'
        },
        {
          id: 2,
          cliente: 'Restaurante El Buen Sabor',
          tipoProyecto: 'Menú digital',
          diseñador: 'Carlos Vega',
          fechaSolicitud: '2024-09-10',
          deadline: '2024-09-17',
          revision: 'Esperando feedback',
          estadoEnvio: 'En diseño'
        }
      ],
      'En Edición': [
        {
          id: 1,
          cliente: 'Editorial Conocimiento',
          tipoProyecto: 'Portada de libro',
          diseñador: 'Laura Ruiz',
          fechaInicio: '2024-09-09',
          progreso: '75%',
          revision: 'Segunda revisión',
          estadoEnvio: 'En edición'
        }
      ],
      'Aprobados': [
        {
          id: 1,
          cliente: 'Tienda de Moda StylePlus',
          tipoProyecto: 'Catálogo de productos',
          diseñador: 'Diego Moreno',
          fechaAprobacion: '2024-09-10',
          revision: 'Versión final',
          estadoEnvio: 'Aprobado'
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
    if (activeMainTab === 'Producción Interna') {
      if (activeSubTab === 'Objetos') {
        return [
          { key: 'productoTerminado', label: 'PRODUCTO TERMINADO' },
          { key: 'materialesUsados', label: 'MATERIALES USADOS' },
          { key: 'mermas', label: 'MERMAS' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'inventario', label: 'INVENTARIO' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'Productos Terminados') {
        return [
          { key: 'producto', label: 'PRODUCTO' },
          { key: 'cantidad', label: 'CANTIDAD' },
          { key: 'fechaTerminado', label: 'FECHA TERMINADO' },
          { key: 'calidad', label: 'CALIDAD' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      } else if (activeSubTab === 'Control de Calidad') {
        return [
          { key: 'producto', label: 'PRODUCTO' },
          { key: 'inspector', label: 'INSPECTOR' },
          { key: 'fechaInspeccion', label: 'FECHA INSPECCIÓN' },
          { key: 'resultado', label: 'RESULTADO' },
          { key: 'observaciones', label: 'OBSERVACIONES' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO ENVÍO' }
        ];
      }
    } else if (activeMainTab === 'Enmarcado') {
      if (activeSubTab === 'En Proceso') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'descripcion', label: 'DESCRIPCIÓN' },
          { key: 'moldura', label: 'MOLDURA' },
          { key: 'fechaInicio', label: 'FECHA INICIO' },
          { key: 'progreso', label: 'PROGRESO' },
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
      if (activeSubTab === 'Cola de Impresión') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'tipoImpresion', label: 'TIPO IMPRESIÓN' },
          { key: 'cantidad', label: 'CANTIDAD' },
          { key: 'prioridad', label: 'PRIORIDAD' },
          { key: 'fechaSolicitud', label: 'FECHA SOLICITUD' },
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
      if (activeSubTab === 'Pendientes') {
        return [
          { key: 'titulo', label: 'TÍTULO' },
          { key: 'descripcion', label: 'DESCRIPCIÓN' },
          { key: 'fechaVencimiento', label: 'FECHA VENCIMIENTO' },
          { key: 'prioridad', label: 'PRIORIDAD' },
          { key: 'asignado', label: 'ASIGNADO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO' }
        ];
      } else if (activeSubTab === 'En Proceso') {
        return [
          { key: 'titulo', label: 'TÍTULO' },
          { key: 'descripcion', label: 'DESCRIPCIÓN' },
          { key: 'fechaInicio', label: 'FECHA INICIO' },
          { key: 'responsable', label: 'RESPONSABLE' },
          { key: 'progreso', label: 'PROGRESO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO' }
        ];
      } else if (activeSubTab === 'Completados') {
        return [
          { key: 'titulo', label: 'TÍTULO' },
          { key: 'descripcion', label: 'DESCRIPCIÓN' },
          { key: 'fechaCompletado', label: 'FECHA COMPLETADO' },
          { key: 'completadoPor', label: 'COMPLETADO POR' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO' }
        ];
      }
    } else if (activeMainTab === 'Retoque Digital') {
      if (activeSubTab === 'Por Iniciar') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'tipoTrabajo', label: 'TIPO TRABAJO' },
          { key: 'cantidadFotos', label: 'CANTIDAD FOTOS' },
          { key: 'fechaSolicitud', label: 'FECHA SOLICITUD' },
          { key: 'deadline', label: 'DEADLINE' },
          { key: 'especialista', label: 'ESPECIALISTA' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO' }
        ];
      } else if (activeSubTab === 'En Retoque') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'tipoTrabajo', label: 'TIPO TRABAJO' },
          { key: 'cantidadFotos', label: 'CANTIDAD FOTOS' },
          { key: 'especialista', label: 'ESPECIALISTA' },
          { key: 'fechaInicio', label: 'FECHA INICIO' },
          { key: 'progreso', label: 'PROGRESO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO' }
        ];
      } else if (activeSubTab === 'Finalizados') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'tipoTrabajo', label: 'TIPO TRABAJO' },
          { key: 'cantidadFotos', label: 'CANTIDAD FOTOS' },
          { key: 'especialista', label: 'ESPECIALISTA' },
          { key: 'fechaFinalizacion', label: 'FECHA FINALIZACIÓN' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO' }
        ];
      }
    } else if (activeMainTab === 'Pintura al Óleo') {
      if (activeSubTab === 'Bocetos') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'tipoObra', label: 'TIPO OBRA' },
          { key: 'dimensiones', label: 'DIMENSIONES' },
          { key: 'artista', label: 'ARTISTA' },
          { key: 'fechaInicio', label: 'FECHA INICIO' },
          { key: 'referencia', label: 'REFERENCIA' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO' }
        ];
      } else if (activeSubTab === 'En Proceso') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'tipoObra', label: 'TIPO OBRA' },
          { key: 'dimensiones', label: 'DIMENSIONES' },
          { key: 'artista', label: 'ARTISTA' },
          { key: 'fechaInicio', label: 'FECHA INICIO' },
          { key: 'progreso', label: 'PROGRESO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO' }
        ];
      } else if (activeSubTab === 'Terminados') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'tipoObra', label: 'TIPO OBRA' },
          { key: 'dimensiones', label: 'DIMENSIONES' },
          { key: 'artista', label: 'ARTISTA' },
          { key: 'fechaTerminado', label: 'FECHA TERMINADO' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO' }
        ];
      }
    } else if (activeMainTab === 'Edición Gráfica') {
      if (activeSubTab === 'Diseños') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'tipoProyecto', label: 'TIPO PROYECTO' },
          { key: 'diseñador', label: 'DISEÑADOR' },
          { key: 'fechaSolicitud', label: 'FECHA SOLICITUD' },
          { key: 'deadline', label: 'DEADLINE' },
          { key: 'revision', label: 'REVISIÓN' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO' }
        ];
      } else if (activeSubTab === 'En Edición') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'tipoProyecto', label: 'TIPO PROYECTO' },
          { key: 'diseñador', label: 'DISEÑADOR' },
          { key: 'fechaInicio', label: 'FECHA INICIO' },
          { key: 'progreso', label: 'PROGRESO' },
          { key: 'revision', label: 'REVISIÓN' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO' }
        ];
      } else if (activeSubTab === 'Aprobados') {
        return [
          { key: 'cliente', label: 'CLIENTE' },
          { key: 'tipoProyecto', label: 'TIPO PROYECTO' },
          { key: 'diseñador', label: 'DISEÑADOR' },
          { key: 'fechaAprobacion', label: 'FECHA APROBACIÓN' },
          { key: 'revision', label: 'REVISIÓN' },
          { key: 'acciones', label: 'ACCIONES' },
          { key: 'estadoEnvio', label: 'ESTADO' }
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
    setSelectedItem(item);
    setModalType('edit');
    setShowModal(true);
  };

  const handleSwitchToEdit = () => {
    setModalType('edit');
  };

  const handleDeleteItem = (item) => {
    if (window.confirm('¿Estás seguro de eliminar este elemento?')) {
      // Actualizar los datos eliminando el elemento
      setData(prevData => {
        const newData = { ...prevData };
        if (!newData[activeMainTab]) newData[activeMainTab] = {};
        if (!newData[activeMainTab][activeSubTab]) {
          newData[activeMainTab][activeSubTab] = [...initialData[activeMainTab][activeSubTab]];
        }
        newData[activeMainTab][activeSubTab] = newData[activeMainTab][activeSubTab].filter(i => i.id !== item.id);
        return newData;
      });
      
      // Quitar de seleccionados si estaba seleccionado
      setSelectedItems(prev => prev.filter(id => id !== item.id));
      alert('Elemento eliminado correctamente');
    }
  };

  const handleSaveItem = (updatedItem) => {
    setData(prevData => {
      const newData = { ...prevData };
      if (!newData[activeMainTab]) newData[activeMainTab] = {};
      if (!newData[activeMainTab][activeSubTab]) {
        newData[activeMainTab][activeSubTab] = [...initialData[activeMainTab][activeSubTab]];
      }
      
      const index = newData[activeMainTab][activeSubTab].findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        newData[activeMainTab][activeSubTab][index] = updatedItem;
      }
      
      return newData;
    });
    
    setShowModal(false);
    setSelectedItem(null);
    alert('Cambios guardados correctamente');
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
    setData(prevData => {
      const newData = { ...prevData };
      if (!newData[activeMainTab]) newData[activeMainTab] = {};
      if (!newData[activeMainTab][activeSubTab]) {
        newData[activeMainTab][activeSubTab] = [...(initialData[activeMainTab]?.[activeSubTab] || [])];
      }
      
      newData[activeMainTab][activeSubTab].push(newItem);
      return newData;
    });
    
    setShowModal(false);
    setSelectedItem(null);
    alert('Elemento agregado correctamente');
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
    alert(`Descontando materiales del inventario para: ${item.productoTerminado || item.producto || 'producto'}`);
    // Aquí iría la lógica para descontar del inventario
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
    <div className="p-6 bg-gray-50 min-h-screen">
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
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
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
            <div className="flex space-x-1">
              {subTabs[activeMainTab].map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => {
                    setActiveSubTab(subTab.id);
                    setSelectedItems([]);
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleAddNew}
                className="flex items-center space-x-2 px-4 py-2 bg-[#1DD1E3] text-white rounded-lg hover:bg-[#19BED1] transition-colors"
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
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1DD1E3] focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 focus:ring-[#1DD1E3]"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                {columns.map((col) => (
                  <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300 focus:ring-[#1DD1E3]"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap">
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
                        <div className="text-sm text-gray-900">
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
                className="flex items-center space-x-2 px-6 py-3 bg-[#1DD1E3] text-white rounded-lg hover:bg-[#19BED1] transition-colors shadow-sm"
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
    onSave(formData);
  };

  const getFieldLabel = (key) => {
    const labels = {
      'productoTerminado': 'Producto Terminado',
      'materialesUsados': 'Materiales Usados',
      'mermas': 'Mermas',
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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