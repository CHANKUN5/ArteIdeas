import React, { useEffect, useState } from "react";

import {
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

const Pedidos = () => {
  const [orders, setOrders] = useState([]);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Estado del formulario controlado para crear/editar pedidos
  const [formData, setFormData] = useState({
    cliente: "",
    servicio: "Impresión Minilab",
    estado: "Nuevo",
    fotografias: "",
    diseño: "",
    detalles: "",
  });

  // Modales de confirmación
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);

  // Cargar pedidos desde localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem("orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          setOrders(parsed);
        }
      }
    } catch (e) {
      console.error("Error cargando pedidos desde localStorage", e);
    }
  }, []);

  // Sincronizar pedidos con localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem("orders", JSON.stringify(orders));
    } catch (e) {
      console.error("Error guardando pedidos en localStorage", e);
    }
  }, [orders]);

  const statusColors = {
    Nuevo: "bg-blue-100 text-blue-800",
    Producción: "bg-yellow-100 text-yellow-800",
    Entregado: "bg-green-100 text-green-800",
  };

  const resetForm = () => {
    setFormData({
      cliente: "",
      servicio: "Impresión Minilab",
      estado: "Nuevo",
      fotografias: "",
      diseño: "",
      detalles: "",
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
      servicio: order.servicio || "Impresión Minilab",
      estado: order.estado || "Nuevo",
      fotografias: order.fotografias || "",
      diseño: order.diseño || "",
      detalles: order.detalles || "",
    });
    setShowOrderForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    if (selectedOrder) {
      // Editar existente
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, ...formData } : o))
      );
    } else {
      // Crear nuevo
      const newOrder = {
        id: generateNextOrderId(),
        ...formData,
      };
      setOrders((prev) => [newOrder, ...prev]);
    }

    setShowOrderForm(false);
    setSelectedOrder(null);
    resetForm();
  };

  const handleDeleteOrder = (orderId) => {
    // Eliminar sin window.confirm; el control se hace vía Modal
    setOrders(orders.filter((order) => order.id !== orderId));
    setConfirmDeleteOpen(false);
    setOrderToDelete(null);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.cliente
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesService =
      serviceFilter === "todos" || order.servicio === serviceFilter;
    const matchesStatus =
      statusFilter === "todos" || order.estado === statusFilter;
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
      <div className="mb-6">
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

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={openCreateOrder}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          Nuevo Pedido
        </button>
      </div>

      {/* Filtros */}
      <Card className="mb-6 border border-primary/10 bg-primary/10">
        <h3 className="font-semibold text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente
            </label>
            <input
              type="text"
              placeholder="Buscar por Cliente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Servicio
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
              <option value="Nuevo">Nuevo</option>
              <option value="Producción">Producción</option>
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
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-all"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </Card>

      {/* Listado de Clientes */}
      <Card className="border border-primary/10">
        <h3 className="font-semibold text-gray-900 mb-4">
          Listado de Clientes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-primary/10">
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Cliente/Colegio
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Tipo de Servicio
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Estado
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Fotografías Asociadas
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Diseño
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-800">
                  Detalles Adicionales
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
                    {order.cliente}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {order.servicio}
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
                    {order.fotografias}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {order.diseño}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {order.detalles}
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
                  Servicio
                </label>
                <p className="text-gray-900">{selectedOrder.servicio}</p>
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
                  Fotografías
                </label>
                <p className="text-gray-900">{selectedOrder.fotografias}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diseño
                </label>
                <p className="text-gray-900">{selectedOrder.diseño}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detalles Adicionales
              </label>
              <p className="text-gray-900">{selectedOrder.detalles}</p>
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
              <label className="form-label">Tipo de Servicio</label>
              <select
                name="servicio"
                value={formData.servicio}
                onChange={handleFormChange}
                className="form-select"
              >
                <option value="Impresión Minilab">Impresión Minilab</option>
                <option value="Enmarcado">Enmarcado</option>
                <option value="Recordatorio Escolar">
                  Recordatorio Escolar
                </option>
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
                <option value="Nuevo">Nuevo</option>
                <option value="Producción">Producción</option>
                <option value="Entregado">Entregado</option>
              </select>
            </div>
            <div>
              <label className="form-label">Fotografías Asociadas</label>
              <input
                type="text"
                name="fotografias"
                value={formData.fotografias}
                onChange={handleFormChange}
                className="form-input"
                placeholder="Ej: 25 fotos"
              />
            </div>
            <div>
              <label className="form-label">Diseño</label>
              <input
                type="text"
                name="diseño"
                value={formData.diseño}
                onChange={handleFormChange}
                className="form-input"
                placeholder="Tipo de diseño"
              />
            </div>
            <div>
              <label className="form-label">Detalles Adicionales</label>
              <input
                type="text"
                name="detalles"
                value={formData.detalles}
                onChange={handleFormChange}
                className="form-input"
                placeholder="Detalles específicos"
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
