import { useEffect, useState } from "react";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Filter,
  Plus,
  Search,
  ShoppingCart,
  Trash2
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import { useApp } from "../../context/AppContext";

const Pedidos = () => {
  const { notifyNewOrder, notifyOrderAction } = useApp();
  
  // Datos de prueba para mostrar en la tabla
  const datosPrueba = [
    {
      id: "P001",
      cliente: "Colegio San Agustín",
      productoTipo: "Recordatorio Escolar",
      estado: "En producción",
      subestado: "Corte láser",
      fechaPedido: "2024-01-15",
      fechaCompromiso: "2024-01-25",
      costoEstimado: 1200,
      precioVenta: 1800,
      utilidad: 600,
      avance: 65,
      notas: "Recordatorios para promoción 2024"
    },
    {
      id: "P002",
      cliente: "María Rodríguez",
      productoTipo: "Impresión Minilab",
      estado: "Pendiente de confirmación",
      subestado: "Esperando confirmación",
      fechaPedido: "2024-01-16",
      fechaCompromiso: "2024-01-22",
      costoEstimado: 350,
      precioVenta: 500,
      utilidad: 150,
      avance: 0,
      notas: "Fotos familiares"
    },
    {
      id: "P003",
      cliente: "Empresa Constructora XYZ",
      productoTipo: "Enmarcado",
      estado: "Listo para entrega",
      subestado: "Embalaje",
      fechaPedido: "2024-01-10",
      fechaCompromiso: "2024-01-20",
      costoEstimado: 2500,
      precioVenta: 3800,
      utilidad: 1300,
      avance: 100,
      notas: "Catálogo de proyectos"
    },
    {
      id: "P004",
      cliente: "Colegio Santa María",
      productoTipo: "Recordatorio Escolar",
      estado: "Entregado",
      subestado: "Completado",
      fechaPedido: "2024-01-05",
      fechaCompromiso: "2024-01-15",
      costoEstimado: 1800,
      precioVenta: 2700,
      utilidad: 900,
      avance: 100,
      notas: "Anuario escolar 2023"
    },
    {
      id: "P005",
      cliente: "Juan Pérez",
      productoTipo: "Retoque Fotográfico",
      estado: "En producción",
      subestado: "Impresión",
      fechaPedido: "2024-01-17",
      fechaCompromiso: "2024-01-24",
      costoEstimado: 420,
      precioVenta: 650,
      utilidad: 230,
      avance: 40,
      notas: "Fotos de boda"
    }
  ];
  
  // Cargar pedidos desde localStorage o usar datos de prueba si no hay datos guardados
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        return JSON.parse(savedOrders);
      }
    } catch (error) {
      console.error("Error al cargar pedidos desde localStorage:", error);
    }
    return datosPrueba;
  });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 5;

  // Estado del formulario controlado para crear/editar pedidos
  const todayISO = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    cliente: "",
    contrato: "",
    contratoId: "",
    productoTipo: "Impresión Minilab",
    fechaPedido: todayISO,
    fechaCompromiso: "",
    costoEstimado: 0,
    precioVenta: 0,
    utilidad: 0,
    avance: 0,
    notas: "",
    estado: "Pendiente de confirmación",
    subestado: "",
  });

  // Estado para almacenar la lista de contratos disponibles
  const [availableContracts, setAvailableContracts] = useState([]);

  // Cargar contratos disponibles desde localStorage
  useEffect(() => {
    const loadContracts = () => {
      try {
        // Usar la misma clave que usa el componente Contratos.jsx
        const savedContracts = localStorage.getItem('arteIdeas_contracts');
        if (savedContracts) {
          const contracts = JSON.parse(savedContracts);
          setAvailableContracts(contracts);
          console.log('Contratos cargados:', contracts);
        } else {
          console.log('No se encontraron contratos en localStorage');
        }
      } catch (error) {
        console.error('Error al cargar contratos:', error);
      }
    };

    loadContracts();
    
    // Escuchar cambios en localStorage para actualizar contratos
    const handleStorageChange = (e) => {
      if (e.key === 'arteIdeas_contracts') {
        loadContracts();
      }
    };

    // También verificar localStorage cada segundo para asegurar sincronización
    const intervalId = setInterval(loadContracts, 1000);

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  // Modales de confirmación
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);
  
  // Sincronizar pedidos con localStorage cuando cambien
  // Nota: Ya no es necesario este useEffect porque guardamos inmediatamente en handleSubmitOrder
  // Lo mantenemos como respaldo por si hay otros lugares donde se modifiquen los pedidos
  useEffect(() => {
    try {
      localStorage.setItem("orders", JSON.stringify(orders));
      console.log("Pedidos sincronizados en localStorage (respaldo):", orders);
      
      // Disparar un evento personalizado para notificar a otros componentes
      const event = new Event('ordersUpdated');
      window.dispatchEvent(event);
    } catch (e) {
      console.error("Error guardando pedidos en localStorage", e);
    }
  }, [orders]);

  const statusColors = {
    "Pendiente de confirmación": "bg-blue-100 text-blue-800",
    "En producción": "bg-yellow-100 text-yellow-800",
    "Listo para entrega": "bg-emerald-100 text-emerald-800",
    Entregado: "bg-green-100 text-green-800",
    "edición digital": "bg-indigo-100 text-indigo-800",
    "impresión": "bg-orange-100 text-orange-800",
    "enmarcado": "bg-purple-100 text-purple-800",
  };

  const computeUtilidad = (precio, costo) => {
    const p = parseFloat(precio) || 0;
    const c = parseFloat(costo) || 0;
    return +(p - c).toFixed(2);
  };

  const calcularCostoMateriales = (productoTipo) => {
    const tabla = {
      "Impresión Minilab": 25,
      "Enmarcado": 40,
      "Recordatorio Escolar": 15,
      "Retoque Fotográfico": 20,
    };
    return tabla[productoTipo] ?? 0;
  };

  const resetForm = () => {
    setFormData({
      cliente: "",
      contrato: "",
      contratoId: "",
      productoTipo: "Impresión Minilab",
      fechaPedido: todayISO,
      fechaCompromiso: "",
      costoEstimado: 0,
      precioVenta: 0,
      utilidad: 0,
      avance: 0,
      notas: "",
      estado: "Pendiente de confirmación",
      subestado: "",
    });
  };

  const openCreateOrder = () => {
    setSelectedOrder(null);
    resetForm();
    setShowOrderForm(true);
  };

  const openEditOrder = (order) => {
    setSelectedOrder(order);
    setFormData({
      cliente: order.cliente || "",
      contrato: order.contrato || "",
      contratoId: order.contratoId || "",
      productoTipo: order.productoTipo || order.servicio || "Impresión Minilab",
      fechaPedido: order.fechaPedido || todayISO,
      fechaCompromiso: order.fechaCompromiso || "",
      costoEstimado: order.costoEstimado ?? calcularCostoMateriales(order.productoTipo || order.servicio || "Impresión Minilab"),
      precioVenta: order.precioVenta ?? 0,
      utilidad: computeUtilidad(order.precioVenta, order.costoEstimado),
      avance: order.avance ?? 0,
      notas: order.notas || order.detalles || "",
      estado: order.estado || "Pendiente de confirmación",
      subestado: order.subestado || "",
    });
    setShowOrderForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "productoTipo") {
        next.costoEstimado = calcularCostoMateriales(value);
      }
      if (name === "precioVenta" || name === "costoEstimado") {
        next.utilidad = computeUtilidad(
          name === "precioVenta" ? value : next.precioVenta,
          name === "costoEstimado" ? value : next.costoEstimado
        );
      }
      return next;
    });
  };

  const generateNextOrderId = () => {
    // Encuentra el mayor número en los IDs existentes tipo P### y suma 1
    const maxNum = orders.reduce((max, o) => {
      const match = /P(\d+)/.exec(o.id);
      const num = match ? parseInt(match[1], 10) : 0;
      return Math.max(max, num);
    }, 0);
    const next = maxNum + 1;
    return `P${String(next).padStart(3, "0")}`;
  };

  const handleSubmitOrder = () => {
    if (!formData.cliente.trim()) {
      alert("El cliente es requerido");
      return;
    }

    const utilidadCalc = computeUtilidad(formData.precioVenta, formData.costoEstimado);
    const payload = { 
      ...formData, 
      utilidad: utilidadCalc,
      contratoId: formData.contratoId,
      contrato: formData.contrato
    };

    let updatedOrders;
    
    if (selectedOrder) {
      // Editar existente
      updatedOrders = orders.map((o) => (o.id === selectedOrder.id ? { ...o, ...payload } : o));
      setOrders(updatedOrders);
      
      // Notificación persistente para edición
      notifyOrderAction('edit', { ...selectedOrder, ...payload });
      console.log('Pedido editado:', { ...selectedOrder, ...payload });
    } else {
      // Crear nuevo
      const newOrder = {
        id: generateNextOrderId(),
        ...payload,
      };
      updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      
      // Notificación persistente para nuevo pedido
      notifyNewOrder(newOrder, formData.cliente);
      console.log('Nuevo pedido creado:', newOrder);
    }
    
    // Guardar inmediatamente en localStorage
    try {
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      console.log('Pedidos guardados en localStorage:', updatedOrders);
      
      // Disparar evento para notificar a otros componentes
      const event = new Event('ordersUpdated');
      window.dispatchEvent(event);
      
      // Mostrar confirmación visual
      alert(selectedOrder ? "Pedido actualizado correctamente" : "Nuevo pedido creado correctamente");
    } catch (error) {
      console.error("Error al guardar pedidos en localStorage:", error);
      alert("Error al guardar el pedido. Por favor, inténtalo de nuevo.");
    }

    setShowOrderForm(false);
    setSelectedOrder(null);
    resetForm();
  };

  const handleDeleteOrder = (orderId) => {
    // Eliminar sin window.confirm; el control se hace vía Modal
    const orderToRemove = orders.find(order => order.id === orderId);
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    
    // Guardar inmediatamente en localStorage
    try {
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      console.log('Pedidos actualizados después de eliminar:', updatedOrders);
      
      // Disparar evento para notificar a otros componentes
      const event = new Event('ordersUpdated');
      window.dispatchEvent(event);
      
      // Notificación persistente para eliminación de pedido
      if (orderToRemove) {
        notifyOrderAction('delete', orderToRemove);
      }
      
      // Mostrar confirmación visual
      alert("Pedido eliminado correctamente");
    } catch (error) {
      console.error("Error al guardar pedidos en localStorage:", error);
    }
    
    setConfirmDeleteOpen(false);
    setOrderToDelete(null);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = (order.cliente || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const tipo = order.productoTipo || order.servicio;
    const matchesService = serviceFilter === "todos" || tipo === serviceFilter;
    const matchesStatus =
      statusFilter === "todos" || order.estado === statusFilter || order.subestado === statusFilter;
    return matchesSearch && matchesService && matchesStatus;
  });

  // Ordenar por ID ascendente (P001, P002, ...)
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const na = parseInt((a.id || "").replace(/\D+/g, ""), 10) || 0;
    const nb = parseInt((b.id || "").replace(/\D+/g, ""), 10) || 0;
    return na - nb;
  });

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = sortedOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="-mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
            <p className="text-sm text-gray-500">
              Gestiona las órdenes de trabajo
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center mb-6">
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={openCreateOrder}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Nuevo Pedido
        </Button>
      </div>

      {/* Barra de búsqueda y botón de filtros */}
      <div className="mb-6 flex items-center space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar por cliente, número de pedido o detalles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-1"
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Panel de filtros desplegable */}
      {showFilters && (
        <Card className="mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Producto
              </label>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="todos">Todos</option>
                <option value="Impresión Minilab">Impresión Minilab</option>
                <option value="Enmarcado">Enmarcado</option>
                <option value="Recordatorio Escolar">Recordatorio Escolar</option>
                <option value="Retoque Fotográfico">Retoque Fotográfico</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="todos">Todos</option>
                <option value="Pendiente de confirmación">Pendiente de confirmación</option>
                <option value="En producción">En producción</option>
                <option value="edición digital">Subestado: edición digital</option>
                <option value="impresión">Subestado: impresión</option>
                <option value="enmarcado">Subestado: enmarcado</option>
                <option value="Listo para entrega">Listo para entrega</option>
                <option value="Entregado">Entregado</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setServiceFilter("todos");
                  setStatusFilter("todos");
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-all"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Listado de Pedidos */}
      <Card className="border border-primary/10">
        <h3 className="font-semibold text-gray-900 mb-4">
          Listado de Pedidos
        </h3>
        <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
          <table className="min-w-[12px] w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-primary/10">
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Cliente/Colegio
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Tipo de Producto
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Estado
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Subestado
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Fecha Pedido
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Fecha Compromiso
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Costo Estimado
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Precio Venta
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Utilidad
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Avance (%)
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={`border-b border-gray-100 ${
                    idx % 2 === 0 ? "bg-white" : "bg-primary/5"
                  } hover:bg-primary/10`}
                >
                  <td className="py-3 px-4 text-sm font-medium">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {order.id}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div>
                      {order.cliente}
                      {order.contratoId && (
                        <div className="text-xs text-primary-600 mt-1">
                          📋 Contrato: {order.contratoId}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {order.productoTipo || order.servicio}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.estado]
                      }`}
                    >
                      {order.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {order.subestado || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {order.fechaPedido || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {order.fechaCompromiso || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    S/ {(parseFloat(order.costoEstimado ?? 0)).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    S/ {(parseFloat(order.precioVenta ?? 0)).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <span className={(order.utilidad ?? 0) >= 0 ? 'text-green-700' : 'text-red-600'}>
                      S/ {(parseFloat(order.utilidad ?? (parseFloat(order.precioVenta ?? 0) - parseFloat(order.costoEstimado ?? 0)))).toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="w-full max-w-[120px]">
                      <div className="w-full h-2 bg-gray-200 rounded">
                        <div
                          className="h-2 bg-primary rounded"
                          style={{ width: `${Math.max(0, Math.min(100, Number(order.avance ?? 0)))}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{Math.max(0, Math.min(100, Number(order.avance ?? 0)))}%</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="p-1 hover:bg-primary/10 rounded text-primary hover:text-primary"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setOrderToEdit(order);
                          setConfirmEditOpen(true);
                        }}
                        className="p-1 hover:bg-secondary/10 rounded text-secondary hover:text-secondary"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setOrderToDelete(order);
                          setConfirmDeleteOpen(true);
                        }}
                        className="p-1 hover:bg-red-100 rounded text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Mostrando {sortedOrders.length === 0 ? 0 : startIndex + 1} a{" "}
            {Math.min(startIndex + itemsPerPage, sortedOrders.length)} de{" "}
            {sortedOrders.length} resultados
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded text-sm ${
                  page === currentPage
                    ? "bg-primary text-white border-primary"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Order Detail Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          setSelectedOrder(null);
        }}
        title={`Pedido ${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID
                </label>
                <p className="text-gray-900">{selectedOrder.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <p className="text-gray-900">{selectedOrder.cliente}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Producto
                </label>
                <p className="text-gray-900">{selectedOrder.productoTipo || selectedOrder.servicio}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[selectedOrder.estado]
                  }`}
                >
                  {selectedOrder.estado}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subestado
                </label>
                <p className="text-gray-900">{selectedOrder.subestado || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contrato
                </label>
                <p className="text-gray-900">
                  {selectedOrder.contrato || '-'}
                  {selectedOrder.contratoId && (
                    <span className="ml-2 text-xs text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                      ID: {selectedOrder.contratoId}
                    </span>
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Pedido
                </label>
                <p className="text-gray-900">{selectedOrder.fechaPedido || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Compromiso
                </label>
                <p className="text-gray-900">{selectedOrder.fechaCompromiso || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo Estimado
                </label>
                <p className="text-gray-900">S/ {(parseFloat(selectedOrder.costoEstimado ?? 0)).toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Venta
                </label>
                <p className="text-gray-900">S/ {(parseFloat(selectedOrder.precioVenta ?? 0)).toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Utilidad
                </label>
                <p className="text-gray-900">S/ {(parseFloat(selectedOrder.utilidad ?? (parseFloat(selectedOrder.precioVenta ?? 0) - parseFloat(selectedOrder.costoEstimado ?? 0)))).toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avance
                </label>
                <p className="text-gray-900">{Math.max(0, Math.min(100, Number(selectedOrder.avance ?? 0)))}%</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas Internas
              </label>
              <p className="text-gray-900">{selectedOrder.notas || '-'}</p>
            </div>

            <Modal.Footer>
              <Button
                variant="outline"
                onClick={() => setShowOrderModal(false)}
              >
                Cerrar
              </Button>
              <Button
                variant="secondary"
                icon={<Edit className="w-4 h-4" />}
                onClick={() => {
                  // Abrir confirmación antes de editar desde el modal de detalle
                  setOrderToEdit(selectedOrder);
                  setConfirmEditOpen(true);
                  setShowOrderModal(false);
                }}
              >
                Editar
              </Button>
            </Modal.Footer>
          </div>
        )}
      </Modal>

      {/* Order Form Modal */}
      <Modal
        isOpen={showOrderForm}
        onClose={() => {
          setShowOrderForm(false);
          setSelectedOrder(null);
          resetForm();
        }}
        title={selectedOrder ? "Editar Pedido" : "Nuevo Pedido"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Cliente y contrato */}
            <div>
              <label className="form-label">Cliente/Colegio</label>
              <input
                type="text"
                name="cliente"
                value={formData.cliente}
                onChange={handleFormChange}
                className="form-input"
                placeholder="Nombre del cliente"
              />
            </div>
            <div>
              <label className="form-label">Contrato vinculado</label>
              <div className="space-y-2">
                <div>
                   <select
                     name="contratoId"
                     value={formData.contratoId}
                     onChange={(e) => {
                       const selectedContractId = e.target.value;
                       const selectedContract = availableContracts.find(c => c.id === selectedContractId);
                       
                       if (selectedContract) {
                         // Solo guardar la referencia al contrato, sin modificar el cliente
                         setFormData(prev => ({
                           ...prev,
                           contratoId: selectedContractId,
                           contrato: `${selectedContract.id} - ${selectedContract.cliente} - ${selectedContract.servicio}`,
                           // Ya no sobreescribimos el cliente automáticamente
                           // cliente: selectedContract.cliente || prev.cliente,
                         }));
                       } else {
                         setFormData(prev => ({
                           ...prev,
                           contratoId: selectedContractId,
                           contrato: ""
                         }));
                       }
                     }}
                     className="form-select w-full"
                   >
                     <option value="">Seleccionar contrato...</option>
                     {availableContracts.map(contract => (
                       <option key={contract.id} value={contract.id}>
                         {contract.id} - {contract.cliente} - {contract.servicio}
                       </option>
                     ))}
                   </select>
                 </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autocompletarCliente"
                    className="mr-2"
                    onChange={(e) => {
                      if (e.target.checked && formData.contratoId) {
                        const selectedContract = availableContracts.find(c => c.id === formData.contratoId);
                        if (selectedContract) {
                          setFormData(prev => ({
                            ...prev,
                            cliente: selectedContract.cliente
                          }));
                        }
                      }
                    }}
                  />
                  <label htmlFor="autocompletarCliente" className="text-xs text-gray-600">
                    Autocompletar datos del cliente desde el contrato
                  </label>
                </div>
              </div>
              {formData.contratoId && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded-md">
                  <p className="text-xs text-blue-700">
                    <strong>Contrato seleccionado:</strong> {formData.contrato}
                  </p>
                </div>
              )}
            </div>

            {/* Producto y estado */}
            <div>
              <label className="form-label">Tipo de producto</label>
              <select
                name="productoTipo"
                value={formData.productoTipo}
                onChange={handleFormChange}
                className="form-select"
              >
                <option value="Impresión Minilab">Impresión Minilab</option>
                <option value="Enmarcado">Enmarcado</option>
                <option value="Recordatorio Escolar">Recordatorio Escolar</option>
                <option value="Retoque Fotográfico">Retoque Fotográfico</option>
              </select>
            </div>
            <div>
              <label className="form-label">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleFormChange}
                className="form-select"
              >
                <option value="Pendiente de confirmación">Pendiente de confirmación</option>
                <option value="En producción">En producción</option>
                <option value="Listo para entrega">Listo para entrega</option>
                <option value="Entregado">Entregado</option>
              </select>
            </div>

            {/* Subestado visible solo si En producción */}
            {formData.estado === 'En producción' && (
              <div>
                <label className="form-label">Subestado</label>
                <select
                  name="subestado"
                  value={formData.subestado}
                  onChange={handleFormChange}
                  className="form-select"
                >
                  <option value="">Seleccione...</option>
                  <option value="edición digital">Edición digital</option>
                  <option value="impresión">Impresión</option>
                  <option value="enmarcado">Enmarcado</option>
                </select>
              </div>
            )}

            {/* Fechas */}
            <div>
              <label className="form-label">Fecha del pedido</label>
              <input
                type="date"
                name="fechaPedido"
                value={formData.fechaPedido}
                onChange={handleFormChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Fecha compromiso entrega</label>
              <input
                type="date"
                name="fechaCompromiso"
                value={formData.fechaCompromiso}
                onChange={handleFormChange}
                className="form-input"
              />
            </div>

            {/* Costo/Precio/Utilidad */}
            <div>
              <label className="form-label">Costo calculado automático (materiales)</label>
              <input
                type="number"
                step="0.01"
                name="costoEstimado"
                value={formData.costoEstimado}
                onChange={handleFormChange}
                className="form-input"
                placeholder="S/ 0.00"
              />
            </div>
            <div>
              <label className="form-label">Precio final al cliente</label>
              <input
                type="number"
                step="0.01"
                name="precioVenta"
                value={formData.precioVenta}
                onChange={handleFormChange}
                className="form-input"
                placeholder="S/ 0.00"
              />
            </div>
            <div>
              <label className="form-label">Utilidad (automática)</label>
              <input
                type="text"
                value={`S/ ${computeUtilidad(formData.precioVenta, formData.costoEstimado).toFixed(2)}`}
                readOnly
                className="form-input bg-gray-50"
              />
            </div>

            {/* Avance y notas */}
            <div>
              <label className="form-label">Avance de producción (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                name="avance"
                value={formData.avance}
                onChange={handleFormChange}
                className="form-input"
                placeholder="0 - 100"
              />
            </div>
            <div className="col-span-2">
              <label className="form-label">Notas internas</label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleFormChange}
                className="form-textarea"
                rows={3}
                placeholder="Notas internas del pedido"
              />
            </div>
          </div>

          <Modal.Footer>
            <Button variant="outline" onClick={() => setShowOrderForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitOrder}>
              {selectedOrder ? "Actualizar" : "Crear"} Pedido
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      {/* Confirmación Eliminar Pedido */}
      <Modal
        isOpen={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setOrderToDelete(null);
        }}
        title="Eliminar Pedido"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            ¿Estás seguro de que deseas eliminar el pedido
            {orderToDelete ? (
              <>
                {" "}
                <span className="font-semibold">{orderToDelete.id}</span> del
                cliente{" "}
                <span className="font-semibold">{orderToDelete.cliente}</span>?
              </>
            ) : (
              " seleccionado?"
            )}
            <br />
            <span className="text-red-500">
              Esta acción no se puede deshacer.
            </span>
          </p>

          <Modal.Footer>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDeleteOpen(false);
                setOrderToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() =>
                orderToDelete && handleDeleteOrder(orderToDelete.id)
              }
            >
              Eliminar
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      {/* Confirmación Editar Pedido */}
      <Modal
        isOpen={confirmEditOpen}
        onClose={() => {
          setConfirmEditOpen(false);
          setOrderToEdit(null);
        }}
        title="Editar Pedido"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            ¿Deseas editar el pedido
            {orderToEdit ? (
              <>
                {" "}
                <span className="font-semibold">{orderToEdit.id}</span> del
                cliente{" "}
                <span className="font-semibold">{orderToEdit.cliente}</span>?
              </>
            ) : (
              " seleccionado?"
            )}
          </p>

          <Modal.Footer>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmEditOpen(false);
                setOrderToEdit(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="secondary"
              icon={<Edit className="w-4 h-4" />}
              onClick={() => {
                if (orderToEdit) {
                  openEditOrder(orderToEdit);
                }
                setConfirmEditOpen(false);
                setOrderToEdit(null);
              }}
            >
              Continuar
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

export default Pedidos;
