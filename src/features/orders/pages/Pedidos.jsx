import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  X,
  Plus,
  ShoppingCart,
  Calendar,
  User,
  Building2,
  School,
  FileText,
  DollarSign,
} from "lucide-react";
import { useApp } from "@context/AppContext.jsx";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Pedidos = () => {
  const { showSuccess, showError } = useApp();
  const [vistaActual, setVistaActual] = useState("lista");
  const [tipoDocumento, setTipoDocumento] = useState("nota_venta");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [modalObservar, setModalObservar] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [productos, setProductos] = useState([]);
  const [fechasSesiones, setFechasSesiones] = useState([{ fecha: "", hora: "" }]);
  const [fechasEntregas, setFechasEntregas] = useState([{ fecha: "", hora: "" }]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoDocumentoFilter, setTipoDocumentoFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pedidoToEdit, setPedidoToEdit] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    nombreCompleto: "",
    dni: "",
    telefono: "",
    email: "",
    direccion: "",
    nombreColegio: "",
    contactoColegio: "",
    telefonoColegio: "",
    emailColegio: "",
    direccionColegio: "",
    nivelEducativo: "Inicial",
    grado: "",
    seccion: "",
    razonSocial: "",
    ruc: "",
    representante: "",
    telefonoEmpresa: "",
    emailEmpresa: "",
    direccionEmpresa: "",
    detallesAdicionales: "",
    aCuenta: 0,
    fechaCompromiso: "",
    total: 0,
    estado: "",
  });

  const [pedidos, setPedidos] = useState([
    {
      numero: "V001-24",
      fecha: "14/03/24",
      cliente: "María González",
      tipo: "V",
      estado: "Completado",
      fechaEntrega: "19/03/24",
      total: 450.0,
      aCuenta: 450.0,
      saldo: 0.0,
    },
    {
      numero: "C005-24",
      fecha: "15/03/24",
      cliente: "I.E. San Martín",
      tipo: "C",
      estado: "En Proceso",
      fechaEntrega: "20/03/24",
      total: 1200.0,
      aCuenta: 600.0,
      saldo: 600.0,
    },
    {
      numero: "P012-24",
      fecha: "16/03/24",
      cliente: "Carlos Ruiz",
      tipo: "P",
      estado: "Pendiente",
      fechaEntrega: "21/03/24",
      total: 800.0,
      aCuenta: 0.0,
      saldo: 800.0,
    },
    {
      numero: "V002-24",
      fecha: "17/03/24",
      cliente: "Ana López",
      tipo: "V",
      estado: "Completado",
      fechaEntrega: "22/03/24",
      total: 320.0,
      aCuenta: 320.0,
      saldo: 0.0,
    },
    {
      numero: "C006-24",
      fecha: "18/03/24",
      cliente: "Colegio San José",
      tipo: "C",
      estado: "En Proceso",
      fechaEntrega: "23/03/24",
      total: 1500.0,
      aCuenta: 750.0,
      saldo: 750.0,
    },
  ]);

  const productosDisponibles = [
    { codigo: "MARCO-20X30", nombre: "Marco 20x30", precio: 25.0 },
    { codigo: "VIDRIO-30X40", nombre: "Vidrio 30x40", precio: 15.0 },
    { codigo: "CUADRO-GRAD", nombre: "Cuadro Graduación", precio: 80.0 },
  ];

  const calcularTotal = () => {
    return productos.reduce((sum, p) => sum + p.cantidad * p.precio, 0);
  };

  const agregarProducto = (prod) => {
    const productoExistente = productos.find(p => p.nombre === prod.nombre);
    
    if (productoExistente) {
      // Si el producto ya existe, incrementar la cantidad
      setProductos(productos.map(p => 
        p.nombre === prod.nombre 
          ? { ...p, cantidad: p.cantidad + 1, subtotal: (p.cantidad + 1) * p.precio }
          : p
      ));
    } else {
      // Si es un producto nuevo, agregarlo
      setProductos([...productos, { ...prod, cantidad: 1, subtotal: prod.precio }]);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setSearchTerm("");
    setTipoDocumentoFilter("");
    setEstadoFilter("");
  };

  // Función para generar número de pedido automáticamente
  const generarNumeroPedido = (tipo) => {
    const pedidosDelTipo = pedidos.filter(p => p.tipo === tipo);
    const siguienteNumero = pedidosDelTipo.length + 1;
    return `${tipo}${String(siguienteNumero).padStart(3, '0')}-24`;
  };

  // Función para limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      nombreCompleto: "",
      dni: "",
      telefono: "",
      email: "",
      direccion: "",
      nombreColegio: "",
      contactoColegio: "",
      telefonoColegio: "",
      emailColegio: "",
      direccionColegio: "",
      nivelEducativo: "Inicial",
      grado: "",
      seccion: "",
      razonSocial: "",
      ruc: "",
      representante: "",
      telefonoEmpresa: "",
      emailEmpresa: "",
      direccionEmpresa: "",
      detallesAdicionales: "",
      aCuenta: 0,
      fechaCompromiso: "",
      total: 0,
      estado: "",
    });
    setProductos([]);
    setFechasSesiones([{ fecha: "", hora: "" }]);
    setFechasEntregas([{ fecha: "", hora: "" }]);
  };

  // Función para validar formulario
  const validarFormulario = () => {
    const cliente = formData.nombreCompleto || formData.nombreColegio || formData.razonSocial;
    if (!cliente) {
      showError("Debe ingresar los datos del cliente");
      return false;
    }
    if (productos.length === 0) {
      showError("Debe agregar al menos un producto");
      return false;
    }
    if (tipoDocumento === "nota_venta" && parseFloat(formData.aCuenta || 0) !== calcularTotal()) {
      showError("En una nota de venta, el monto a cuenta debe ser igual al total");
      return false;
    }
    return true;
  };

  // Función para crear proforma
  const crearProforma = () => {
    if (isProcessing || !validarFormulario()) return;
    
    setIsProcessing(true);

    const nuevoPedido = {
      numero: generarNumeroPedido("P"),
      fecha: new Date().toLocaleDateString('es-PE'),
      cliente: formData.nombreCompleto || formData.nombreColegio || formData.razonSocial,
      tipo: "P",
      tipoDocumento: tipoDocumento,
      estado: "Pendiente",
      fechaEntrega: formData.fechaCompromiso || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-PE'),
      total: calcularTotal(),
      aCuenta: 0,
      saldo: calcularTotal(),
      productos: [...productos],
      datosCliente: { ...formData }
    };

    setPedidos(prev => [...prev, nuevoPedido]);
    showSuccess(`Proforma ${nuevoPedido.numero} creada correctamente`);
    limpiarFormulario();
    setVistaActual("lista");
    setIsProcessing(false);
  };

  // Función para procesar venta
  const procesarVenta = () => {
    if (isProcessing || !validarFormulario()) return;
    
    setIsProcessing(true);

    const nuevoPedido = {
      numero: generarNumeroPedido("V"),
      fecha: new Date().toLocaleDateString('es-PE'),
      cliente: formData.nombreCompleto || formData.nombreColegio || formData.razonSocial,
      tipo: "V",
      tipoDocumento: tipoDocumento,
      estado: "Completado",
      fechaEntrega: new Date().toLocaleDateString('es-PE'),
      total: calcularTotal(),
      aCuenta: calcularTotal(),
      saldo: 0,
      productos: [...productos],
      datosCliente: { ...formData }
    };

    setPedidos(prev => [...prev, nuevoPedido]);
    showSuccess(`Venta ${nuevoPedido.numero} procesada correctamente`);
    limpiarFormulario();
    setVistaActual("lista");
    setIsProcessing(false);
  };

  // Función para crear contrato
  const crearContrato = () => {
    if (isProcessing || !validarFormulario()) return;
    
    setIsProcessing(true);

    const aCuenta = parseFloat(formData.aCuenta || 0);
    const total = calcularTotal();

    const nuevoPedido = {
      numero: generarNumeroPedido("C"),
      fecha: new Date().toLocaleDateString('es-PE'),
      cliente: formData.nombreCompleto || formData.nombreColegio || formData.razonSocial,
      tipo: "C",
      tipoDocumento: tipoDocumento,
      estado: "Pendiente",
      fechaEntrega: formData.fechaCompromiso || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-PE'),
      total: total,
      aCuenta: aCuenta,
      saldo: total - aCuenta,
      productos: [...productos],
      datosCliente: { ...formData },
      fechasSesiones: [...fechasSesiones],
      fechasEntregas: [...fechasEntregas]
    };

    setPedidos(prev => [...prev, nuevoPedido]);
    showSuccess(`Contrato ${nuevoPedido.numero} creado correctamente`);
    limpiarFormulario();
    setVistaActual("lista");
    setIsProcessing(false);
  };

  const handleEdit = (pedido) => {
    setPedidoToEdit(pedido);
    
    // Convertir la fecha de formato DD/MM/YY a YYYY-MM-DD para el input date
    const convertirFecha = (fechaStr) => {
      if (!fechaStr) return '';
      const [dia, mes, año] = fechaStr.split('/');
      const añoCompleto = año.length === 2 ? `20${año}` : año;
      return `${añoCompleto}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    };

    setFormData({
      nombreCompleto: pedido.tipo === 'P' ? pedido.cliente : '',
      nombreColegio: pedido.tipo === 'C' ? pedido.cliente : '',
      razonSocial: pedido.tipo === 'V' ? pedido.cliente : '',
      dni: formData.dni,
      telefono: formData.telefono,
      email: formData.email,
      direccion: formData.direccion,
      contactoColegio: formData.contactoColegio,
      telefonoColegio: formData.telefonoColegio,
      emailColegio: formData.emailColegio,
      direccionColegio: formData.direccionColegio,
      nivelEducativo: formData.nivelEducativo,
      grado: formData.grado,
      seccion: formData.seccion,
      ruc: formData.ruc,
      representante: formData.representante,
      telefonoEmpresa: formData.telefonoEmpresa,
      emailEmpresa: formData.emailEmpresa,
      direccionEmpresa: formData.direccionEmpresa,
      detallesAdicionales: '',
      aCuenta: pedido.aCuenta,
      fechaCompromiso: convertirFecha(pedido.fechaEntrega), // Convertir y asignar la fecha de entrega
      total: pedido.total,
      estado: pedido.estado,
    });
    setShowEditModal(true);
  };

  const handleDelete = (pedido) => {
    setPedidoToDelete(pedido);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!pedidoToDelete) return;

    try {
      setPedidos((prev) => prev.filter((p) => p.numero !== pedidoToDelete.numero));
      showSuccess(`Pedido ${pedidoToDelete.numero} eliminado correctamente`);
      setShowDeleteDialog(false);
      setPedidoToDelete(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
      showError("Error al eliminar el pedido");
    }
  };

  const handleSaveEdit = () => {
    if (!pedidoToEdit) return;

    const nuevoTotal = parseFloat(formData.total) || pedidoToEdit.total;
    const nuevoACuenta = parseFloat(formData.aCuenta) >= 0 ? parseFloat(formData.aCuenta) : pedidoToEdit.aCuenta;
    const nuevoSaldo = nuevoTotal - nuevoACuenta;

    setPedidos((prev) =>
      prev.map((p) =>
        p.numero === pedidoToEdit.numero
          ? {
              ...p,
              cliente: formData.nombreCompleto || formData.nombreColegio || formData.razonSocial || p.cliente,
              total: nuevoTotal,
              aCuenta: nuevoACuenta,
              saldo: nuevoSaldo,
              fechaEntrega: formData.fechaCompromiso || p.fechaEntrega,
              estado: formData.estado || p.estado,
            }
          : p
      )
    );

    toast.success(`Pedido ${pedidoToEdit.numero} actualizado correctamente`);
    
    setFormData({
      nombreCompleto: "",
      dni: "",
      telefono: "",
      email: "",
      direccion: "",
      nombreColegio: "",
      contactoColegio: "",
      telefonoColegio: "",
      emailColegio: "",
      direccionColegio: "",
      nivelEducativo: "Inicial",
      grado: "",
      seccion: "",
      razonSocial: "",
      ruc: "",
      representante: "",
      telefonoEmpresa: "",
      emailEmpresa: "",
      direccionEmpresa: "",
      detallesAdicionales: "",
      aCuenta: 0,
      fechaCompromiso: "",
      total: 0,
      estado: "",
    });
    
    setPedidoToEdit(null);
    setShowEditModal(false);
  };

  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch =
      searchTerm === "" ||
      pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.numero.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo = tipoDocumentoFilter === "" || pedido.tipo === tipoDocumentoFilter;
    const matchesEstado = estadoFilter === "" || pedido.estado === estadoFilter;

    return matchesSearch && matchesTipo && matchesEstado;
  });

  if (vistaActual === "lista") {
  return (
      <div className="responsive-mobile">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
              <p className="text-sm text-gray-500">Gestiona las órdenes de trabajo</p>
            </div>
          </div>
          <button
            onClick={() => {
              setVistaActual("nuevoParticular");
              setPedidoSeleccionado(null);
              limpiarFormulario();
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Pedido</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente, número de pedido o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filtros
            </button>
          </div>
          {mostrarFiltros && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Documento
                </label>
                <select
                  value={tipoDocumentoFilter}
                  onChange={(e) => setTipoDocumentoFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todos</option>
                  <option value="P">Proforma</option>
                  <option value="V">Nota de Venta</option>
                  <option value="C">Contrato</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todos</option>
                  <option value="Completado">Completado</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <button
                onClick={limpiarFiltros}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>


        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Número
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha Inicio
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    F. Entrega
                </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Total
                </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    A Cuenta
                </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Saldo
                </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPedidos.map((pedido, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-primary font-semibold">{pedido.numero}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pedido.fecha}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{pedido.cliente}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold ${
                          pedido.tipo === "V"
                            ? "bg-green-500"
                            : pedido.tipo === "C"
                            ? "bg-purple-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {pedido.tipo}
                    </span>
                  </td>
                    <td className="px-6 py-4">
                    <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          pedido.estado === "Completado"
                            ? "bg-green-100 text-green-800"
                            : pedido.estado === "En Proceso"
                            ? "bg-yellow-100 text-yellow-800"
                            : pedido.estado === "Pendiente"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pedido.estado}
                    </span>
                  </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pedido.fechaEntrega}</td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                      S/ {pedido.total.toFixed(2)}
                  </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">
                      S/ {pedido.aCuenta.toFixed(2)}
                  </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold">
                      <span className={pedido.saldo === 0 ? "text-green-600" : "text-red-600"}>
                        S/ {pedido.saldo.toFixed(2)}
                    </span>
                  </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                            setPedidoSeleccionado(pedido);
                            setModalObservar(true);
                        }}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Observar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                          onClick={() => handleEdit(pedido)}
                          className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                          onClick={() => handleDelete(pedido)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
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

          {filteredPedidos.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Mostrando {filteredPedidos.length} {filteredPedidos.length === 1 ? "pedido" : "pedidos"}
                </span>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-gray-600">Total: </span>
                    <span className="font-semibold text-gray-900">S/ 7900.00</span>
          </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Saldo: </span>
                    <span className="font-semibold text-red-600">S/ 5050.00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {filteredPedidos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm || tipoDocumentoFilter || estadoFilter
                  ? "No se encontraron resultados"
                  : "No hay pedidos registrados"}
              </div>
            </div>
          )}
        </div>

        {modalObservar && pedidoSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Detalles del Pedido - {pedidoSeleccionado.numero}</h2>
                <button onClick={() => setModalObservar(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Información del Cliente</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Nombre:</span> <span className="font-medium">{pedidoSeleccionado.cliente}</span></div>
                      <div><span className="text-gray-600">DNI:</span> <span className="font-medium">12345678</span></div>
                      <div><span className="text-gray-600">Teléfono:</span> <span className="font-medium">999888777</span></div>
                      <div><span className="text-gray-600">Email:</span> <span className="font-medium">cliente@email.com</span></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Información del Pedido</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Tipo Documento:</span> <span className="font-medium">Nota de Venta</span></div>
                      <div><span className="text-gray-600">Fecha Registro:</span> <span className="font-medium">{pedidoSeleccionado.fecha}</span></div>
                      <div><span className="text-gray-600">Estado:</span> <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        pedidoSeleccionado.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                        pedidoSeleccionado.estado === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{pedidoSeleccionado.estado}</span></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Productos</h3>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Producto</th>
                        <th className="px-4 py-2 text-center">Cantidad</th>
                        <th className="px-4 py-2 text-right">P. Unitario</th>
                        <th className="px-4 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="px-4 py-2">Marco 20x30</td>
                        <td className="px-4 py-2 text-center">5</td>
                        <td className="px-4 py-2 text-right">S/ 25.00</td>
                        <td className="px-4 py-2 text-right font-semibold">S/ 125.00</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Vidrio 30x40</td>
                        <td className="px-4 py-2 text-center">3</td>
                        <td className="px-4 py-2 text-right">S/ 15.00</td>
                        <td className="px-4 py-2 text-right font-semibold">S/ 45.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Resumen de Pago</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-semibold text-gray-900">S/ {pedidoSeleccionado.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">A Cuenta:</span>
                      <span className="font-semibold text-green-600">S/ {pedidoSeleccionado.aCuenta.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg border-t pt-2">
                      <span className="font-semibold text-gray-700">Saldo:</span>
                      <span className={`font-bold ${pedidoSeleccionado.saldo === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        S/ {pedidoSeleccionado.saldo.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button 
                  onClick={() => setModalObservar(false)} 
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                >
                  Cerrar
                </button>
                <button 
                  onClick={() => {
                    setModalObservar(false);
                    handleEdit(pedidoSeleccionado);
                  }}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteDialog && pedidoToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                  ¿Eliminar Pedido?
                </h3>
                
                <p className="text-sm text-gray-600 text-center mb-4">
                  Estás a punto de eliminar el pedido <span className="font-semibold text-gray-900">{pedidoToDelete.numero}</span> de <span className="font-semibold">{pedidoToDelete.cliente}</span>. Esta acción no se puede deshacer.
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Total del pedido:</span>
                    <span className="font-semibold text-gray-900">S/ {pedidoToDelete.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Saldo pendiente:</span>
                    <span className="font-semibold text-red-600">S/ {pedidoToDelete.saldo.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                <button 
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setPedidoToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && pedidoToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
                <h2 className="text-xl font-bold text-gray-800">Editar Pedido - {pedidoToEdit.numero}</h2>
                <button onClick={() => {
                  setShowEditModal(false);
                  setPedidoToEdit(null);
                  setFormData({
                    nombreCompleto: "",
                    dni: "",
                    telefono: "",
                    email: "",
                    direccion: "",
                    nombreColegio: "",
                    contactoColegio: "",
                    telefonoColegio: "",
                    emailColegio: "",
                    direccionColegio: "",
                    nivelEducativo: "Inicial",
                    grado: "",
                    seccion: "",
                    razonSocial: "",
                    ruc: "",
                    representante: "",
                    telefonoEmpresa: "",
                    emailEmpresa: "",
                    direccionEmpresa: "",
                    detallesAdicionales: "",
                    aCuenta: 0,
                    fechaCompromiso: "",
                    total: 0,
                    estado: "",
                  });
                }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado del Pedido</label>
                  <select 
                    value={formData.estado || pedidoToEdit.estado}
                    onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Completado">Completado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Entrega</label>
                  <input 
                    type="date"
                    value={formData.fechaCompromiso}
                    onChange={(e) => setFormData(prev => ({ ...prev, fechaCompromiso: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monto A Cuenta</label>
                  <input 
                    type="number"
                    value={formData.aCuenta || pedidoToEdit.aCuenta}
                    onChange={(e) => setFormData(prev => ({ ...prev, aCuenta: parseFloat(e.target.value) || 0 }))}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Total: S/ {pedidoToEdit.total.toFixed(2)} | 
                    Saldo restante: S/ {((formData.total || pedidoToEdit.total) - (formData.aCuenta || pedidoToEdit.aCuenta)).toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                  <textarea 
                    value={formData.detallesAdicionales || "Pedido de fotografía"}
                    onChange={(e) => setFormData(prev => ({ ...prev, detallesAdicionales: e.target.value }))}
                    rows="3"
                    placeholder="Notas adicionales sobre el pedido..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                <button 
                  onClick={() => {
                    setShowEditModal(false);
                    setPedidoToEdit(null);
                    setFormData({
                      nombreCompleto: "",
                      dni: "",
                      telefono: "",
                      email: "",
                      direccion: "",
                      nombreColegio: "",
                      contactoColegio: "",
                      telefonoColegio: "",
                      emailColegio: "",
                      direccionColegio: "",
                      nivelEducativo: "Inicial",
                      grado: "",
                      seccion: "",
                      razonSocial: "",
                      ruc: "",
                      representante: "",
                      telefonoEmpresa: "",
                      emailEmpresa: "",
                      direccionEmpresa: "",
                      detallesAdicionales: "",
                      aCuenta: 0,
                      fechaCompromiso: "",
                      total: 0,
                      estado: "",
                    });
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }


  return (
    <>
      <div className="responsive-mobile">
        {/* --- CABECERA Y TABS --- */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setVistaActual("lista");
                setPedidoSeleccionado(null);
              }}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              ← Volver a Pedidos
            </button>
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              {pedidoSeleccionado ? `Editar Pedido ${pedidoSeleccionado.numero}` : "Nuevo Pedido"}
            </h1>
            <div className="w-32"></div>
          </div>
        </div>

        <div className="flex gap-2 border-b border-gray-200 mb-6">
          <button
            onClick={() => {
              setVistaActual("nuevoParticular");
              setPedidoSeleccionado(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 ${
              vistaActual === "nuevoParticular"
                ? "border-primary text-primary"
                : "border-transparent text-gray-600"
            }`}
          >
            <User className="w-4 h-4" />
            Particular
          </button>
          <button
            onClick={() => {
              setVistaActual("nuevoColegio");
              setPedidoSeleccionado(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 ${
              vistaActual === "nuevoColegio"
                ? "border-primary text-primary"
                : "border-transparent text-gray-600"
            }`}
          >
            <School className="w-4 h-4" />
            Colegio
          </button>
          <button
            onClick={() => {
              setVistaActual("nuevoEmpresa");
              setPedidoSeleccionado(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 ${
              vistaActual === "nuevoEmpresa"
                ? "border-primary text-primary"
                : "border-transparent text-gray-600"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Empresa
          </button>
        </div>

        {/* --- CONTENEDOR PRINCIPAL CON LAYOUT DE COLUMNAS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA IZQUIERDA (2/3 del ancho) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* --- FORMULARIOS DE CLIENTE --- */}
            {vistaActual === "nuevoParticular" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Datos del Cliente</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="tipoDocumento" value="proforma" checked={tipoDocumento === "proforma"} onChange={(e) => setTipoDocumento(e.target.value)} className="w-4 h-4 text-primary focus:ring-primary border-gray-300"/><span className="text-sm font-medium text-gray-700">Proforma</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="tipoDocumento" value="nota_venta" checked={tipoDocumento === "nota_venta"} onChange={(e) => setTipoDocumento(e.target.value)} className="w-4 h-4 text-primary focus:ring-primary border-gray-300"/><span className="text-sm font-medium text-gray-700">Nota de Venta</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="tipoDocumento" value="contrato" checked={tipoDocumento === "contrato"} onChange={(e) => setTipoDocumento(e.target.value)} className="w-4 h-4 text-primary focus:ring-primary border-gray-300"/><span className="text-sm font-medium text-gray-700">Contrato</span></label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label><input type="text" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleFormChange} placeholder="Nombre completo" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">DNI *</label><input type="text" name="dni" value={formData.dni} onChange={handleFormChange} placeholder="12345678" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label><input type="text" name="telefono" value={formData.telefono} onChange={handleFormChange} placeholder="999888777" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="correo@ejemplo.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label><input type="text" name="direccion" value={formData.direccion} onChange={handleFormChange} placeholder="Dirección completa" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                </div>
              </div>
            )}
            {vistaActual === "nuevoColegio" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Datos del Colegio</h3>
                 <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="tipoDocumento" value="proforma" checked={tipoDocumento === "proforma"} onChange={(e) => setTipoDocumento(e.target.value)} className="w-4 h-4 text-primary focus:ring-primary border-gray-300"/><span className="text-sm font-medium text-gray-700">Proforma</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="tipoDocumento" value="nota_venta" checked={tipoDocumento === "nota_venta"} onChange={(e) => setTipoDocumento(e.target.value)} className="w-4 h-4 text-primary focus:ring-primary border-gray-300"/><span className="text-sm font-medium text-gray-700">Nota de Venta</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="tipoDocumento" value="contrato" checked={tipoDocumento === "contrato"} onChange={(e) => setTipoDocumento(e.target.value)} className="w-4 h-4 text-primary focus:ring-primary border-gray-300"/><span className="text-sm font-medium text-gray-700">Contrato</span></label>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Nombre de I.E. *</label><input type="text" name="nombreColegio" value={formData.nombreColegio} onChange={handleFormChange} placeholder="Nombre del colegio" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Contacto (Encargado) *</label><input type="text" name="contactoColegio" value={formData.contactoColegio} onChange={handleFormChange} placeholder="Persona de contacto" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label><input type="text" name="telefonoColegio" value={formData.telefonoColegio} onChange={handleFormChange} placeholder="999888777" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" name="emailColegio" value={formData.emailColegio} onChange={handleFormChange} placeholder="correo@colegio.edu.pe" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label><input type="text" name="direccionColegio" value={formData.direccionColegio} onChange={handleFormChange} placeholder="Dirección del colegio" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label><select name="nivelEducativo" value={formData.nivelEducativo} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"><option>Inicial</option><option>Primaria</option><option>Secundaria</option></select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Grado</label><input type="text" name="grado" value={formData.grado} onChange={handleFormChange} placeholder="5to" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Sección</label><input type="text" name="seccion" value={formData.seccion} onChange={handleFormChange} placeholder="A" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                 </div>
              </div>
            )}
            {vistaActual === "nuevoEmpresa" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Datos de la Empresa</h3>
                 <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="tipoDocumento" value="proforma" checked={tipoDocumento === "proforma"} onChange={(e) => setTipoDocumento(e.target.value)} className="w-4 h-4 text-primary focus:ring-primary border-gray-300"/><span className="text-sm font-medium text-gray-700">Proforma</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="tipoDocumento" value="nota_venta" checked={tipoDocumento === "nota_venta"} onChange={(e) => setTipoDocumento(e.target.value)} className="w-4 h-4 text-primary focus:ring-primary border-gray-300"/><span className="text-sm font-medium text-gray-700">Nota de Venta</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="tipoDocumento" value="contrato" checked={tipoDocumento === "contrato"} onChange={(e) => setTipoDocumento(e.target.value)} className="w-4 h-4 text-primary focus:ring-primary border-gray-300"/><span className="text-sm font-medium text-gray-700">Contrato</span></label>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Razón Social *</label><input type="text" name="razonSocial" value={formData.razonSocial} onChange={handleFormChange} placeholder="Empresa S.A.C." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">RUC *</label><input type="text" name="ruc" value={formData.ruc} onChange={handleFormChange} placeholder="20123456789" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Representante *</label><input type="text" name="representante" value={formData.representante} onChange={handleFormChange} placeholder="Nombre del representante" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label><input type="text" name="telefonoEmpresa" value={formData.telefonoEmpresa} onChange={handleFormChange} placeholder="999888777" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" name="emailEmpresa" value={formData.emailEmpresa} onChange={handleFormChange} placeholder="email@empresa.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label><input type="text" name="direccionEmpresa" value={formData.direccionEmpresa} onChange={handleFormChange} placeholder="Dirección de la empresa" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                 </div>
              </div>
            )}

            {/* --- DETALLE DEL PEDIDO --- */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Detalle del Pedido</h3>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-2">Productos disponibles:</p>
                    <div className="flex gap-2 flex-wrap">
                        {productosDisponibles.map((prod, idx) => (<button key={idx} onClick={() => agregarProducto(prod)} className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm hover:bg-primary/10 hover:border-primary transition-colors">{prod.nombre} - S/ {prod.precio.toFixed(2)}</button>))}
                    </div>
                </div>
                {productos.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Producto</th>
                                <th className="px-4 py-2 text-center w-24">Cantidad</th>
                                <th className="px-4 py-2 text-right">P. Unit.</th>
                                <th className="px-4 py-2 text-right">Subtotal</th>
                                <th className="px-4 py-2 text-center w-16">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {productos.map((prod, idx) => (<tr key={idx}>
                                <td className="px-4 py-2">{prod.nombre}</td>
                                <td className="px-4 py-2"><input type="number" value={prod.cantidad} onChange={(e) => { const newProds = [...productos]; newProds[idx].cantidad = parseInt(e.target.value) || 1; newProds[idx].subtotal = newProds[idx].cantidad * newProds[idx].precio; setProductos(newProds);}} className="w-full px-2 py-1 border border-gray-300 rounded text-center" min="1"/></td>
                                <td className="px-4 py-2 text-right">S/ {prod.precio.toFixed(2)}</td>
                                <td className="px-4 py-2 text-right font-semibold">S/ {prod.subtotal.toFixed(2)}</td>
                                <td className="px-4 py-2 text-center"><button onClick={() => setProductos(productos.filter((_, i) => i !== idx))} className="p-1 text-red-600 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button></td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Detalles Adicionales / Servicios Extras</label>
                    <textarea name="detallesAdicionales" value={formData.detallesAdicionales} onChange={handleFormChange} placeholder="Servicios adicionales, notas especiales..." rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"></textarea>
                </div>
            </div>
          </div>

          {/* COLUMNA DERECHA (1/3 del ancho) */}
          <div className="space-y-6">
            {/* --- RESUMEN DE PAGO --- */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-500" /> Resumen de Pago</h3>
              <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-600">Total</span>
                      <span className="text-2xl font-bold text-gray-900">S/ {calcularTotal().toFixed(2)}</span>
                  </div>
                  {tipoDocumento !== "proforma" && (
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">A Cuenta{tipoDocumento === "nota_venta" && (<span className="text-xs text-gray-500 ml-2">(Debe ser igual al total)</span>)}</label>
                      <input type="number" name="aCuenta" value={formData.aCuenta} onChange={handleFormChange} placeholder="0.00" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/>
                  </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span className="font-semibold text-gray-700">Saldo</span>
                      <span className="text-xl font-bold text-red-600">S/ {tipoDocumento === "nota_venta" ? "0.00" : (calcularTotal() - parseFloat(formData.aCuenta || 0)).toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4">
                    {pedidoSeleccionado ? (
                      <button onClick={handleSaveEdit} className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"><FileText className="w-5 h-5" /> Guardar Cambios</button>
                    ) : (
                      <>
                        {tipoDocumento === "proforma" && (
                          <button 
                            onClick={crearProforma} 
                            disabled={isProcessing}
                            className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                              isProcessing 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                          >
                            <FileText className="w-5 h-5" /> 
                            {isProcessing ? 'Guardando...' : 'Guardar Proforma'}
                          </button>
                        )}
                        {tipoDocumento === "nota_venta" && (
                          <button 
                            onClick={procesarVenta} 
                            disabled={isProcessing}
                            className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                              isProcessing 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                          >
                            <ShoppingCart className="w-5 h-5" /> 
                            {isProcessing ? 'Procesando...' : 'Procesar Venta'}
                          </button>
                        )}
                        {tipoDocumento === "contrato" && (
                          <button 
                            onClick={crearContrato} 
                            disabled={isProcessing}
                            className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                              isProcessing 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-purple-500 hover:bg-purple-600 text-white'
                            }`}
                          >
                            <FileText className="w-5 h-5" /> 
                            {isProcessing ? 'Creando...' : 'Crear Contrato'}
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  <div className="text-xs text-center text-gray-500 bg-gray-50 p-3 rounded-lg">
                    {pedidoSeleccionado ? (
                      <p>Estás editando el pedido {pedidoSeleccionado.numero}. Los cambios se guardarán al hacer clic en "Guardar Cambios".</p>
                    ) : (
                      <>
                        {tipoDocumento === "proforma" && (<p>Esta proforma solo calculará el costo. Podrás convertirla en pedido real después.</p>)}
                        {tipoDocumento === "nota_venta" && (<p>Se generará comprobante inmediato y se actualizará el inventario.</p>)}
                        {tipoDocumento === "contrato" && (<p>Se creará un contrato con el saldo pendiente. Se programarán eventos en agenda.</p>)}
                      </>
                    )}
                  </div>
              </div>
            </div>

            {/* --- FECHAS PROGRAMADAS --- */}
            {(vistaActual === "nuevoColegio" || vistaActual === "nuevoEmpresa") && tipoDocumento === "contrato" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Fechas Programadas</h3>
                <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Fecha Compromiso</label><input type="date" name="fechaCompromiso" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"/></div>
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Sesiones Fotográficas</label>
                        <button onClick={() => setFechasSesiones([...fechasSesiones, { fecha: "", hora: "" }])} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"><Plus className="w-3 h-3" /> Agregar</button>
                    </div>
                    {fechasSesiones.map((sesion, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <input type="date" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"/>
                        <input type="time" className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"/>
                        {idx > 0 && (<button onClick={() => setFechasSesiones(fechasSesiones.filter((_, i) => i !== idx))} className="p-1 text-red-600 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>)}
                    </div>
                    ))}
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Entregas</label>
                        <button onClick={() => setFechasEntregas([...fechasEntregas, { fecha: "", hora: "" }])} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"><Plus className="w-3 h-3" /> Agregar</button>
                    </div>
                    {fechasEntregas.map((entrega, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <input type="date" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"/>
                        <input type="time" className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"/>
                        {idx > 0 && (<button onClick={() => setFechasEntregas(fechasEntregas.filter((_, i) => i !== idx))} className="p-1 text-red-600 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>)}
                    </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Pedidos;

