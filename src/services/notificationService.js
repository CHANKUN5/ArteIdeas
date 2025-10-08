// Servicio para manejar notificaciones persistentes del sistema
class NotificationService {
  constructor() {
    this.storageKey = 'arte_ideas_notifications';
    this.listeners = [];
  }

  // Obtener todas las notificaciones del localStorage
  getNotifications() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      return [];
    }
  }

  // Guardar notificaciones en localStorage
  saveNotifications(notifications) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(notifications));
      this.notifyListeners();
    } catch (error) {
      console.error('Error al guardar notificaciones:', error);
    }
  }

  // Agregar una nueva notificación
  addNotification(notification) {
    const notifications = this.getNotifications();
    const newNotification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    notifications.unshift(newNotification); // Agregar al inicio
    
    // Mantener solo las últimas 100 notificaciones
    if (notifications.length > 100) {
      notifications.splice(100);
    }

    this.saveNotifications(notifications);
    return newNotification;
  }

  // Marcar notificación como leída
  markAsRead(notificationId) {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.read = true;
      this.saveNotifications(notifications);
    }
  }

  // Marcar todas como leídas
  markAllAsRead() {
    const notifications = this.getNotifications();
    notifications.forEach(notification => {
      notification.read = true;
    });
    this.saveNotifications(notifications);
  }

  // Eliminar notificación
  removeNotification(notificationId) {
    const notifications = this.getNotifications();
    const filtered = notifications.filter(n => n.id !== notificationId);
    this.saveNotifications(filtered);
  }

  // Limpiar todas las notificaciones
  clearAll() {
    this.saveNotifications([]);
  }

  // Obtener notificaciones no leídas
  getUnreadNotifications() {
    return this.getNotifications().filter(n => !n.read);
  }

  // Obtener cantidad de notificaciones no leídas
  getUnreadCount() {
    return this.getUnreadNotifications().length;
  }

  // Suscribirse a cambios en las notificaciones
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notificar a todos los listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback());
  }

  // Crear notificación para acciones CRUD
  createCRUDNotification(action, entity, entityName, details = {}) {
    const actionMessages = {
      create: {
        title: `Nuevo ${entity} registrado`,
        message: `Se ha registrado: ${entityName}`,
        description: `Se ha creado un nuevo ${entity} en el sistema. ${details.description || ''}`,
        icon: '✅',
        type: 'success'
      },
      update: {
        title: `${entity} actualizado`,
        message: `Se ha actualizado: ${entityName}`,
        description: `Se han modificado los datos de ${entityName}. ${details.description || ''}`,
        icon: '✏️',
        type: 'info'
      },
      delete: {
        title: `${entity} eliminado`,
        message: `Se ha eliminado: ${entityName}`,
        description: `${entityName} ha sido eliminado del sistema. ${details.description || ''}`,
        icon: '🗑️',
        type: 'warning'
      }
    };

    const config = actionMessages[action];
    if (!config) return null;

    return this.addNotification({
      ...config,
      category: entity.toLowerCase(),
      action,
      entityId: details.entityId,
      metadata: details.metadata || {}
    });
  }

  // Crear notificación para recordatorios y fechas
  createReminderNotification(type, title, message, dueDate, details = {}) {
    return this.addNotification({
      title: `📅 ${title}`,
      message,
      description: `Recordatorio programado para ${new Date(dueDate).toLocaleDateString('es-ES')}. ${details.description || ''}`,
      icon: '⏰',
      type: 'info',
      category: 'reminder',
      dueDate,
      reminderType: type,
      metadata: details.metadata || {}
    });
  }

  // Crear notificación para stock bajo
  createStockNotification(productName, currentStock, minStock) {
    return this.addNotification({
      title: '⚠️ Stock bajo',
      message: `${productName} tiene stock bajo`,
      description: `El producto ${productName} tiene solo ${currentStock} unidades disponibles. El stock mínimo recomendado es ${minStock} unidades.`,
      icon: '📦',
      type: 'warning',
      category: 'inventory',
      action: 'stock_alert',
      metadata: { productName, currentStock, minStock }
    });
  }

  // Crear notificación para nuevos clientes
  createClientNotification(clientName, clientType = 'cliente') {
    return this.addNotification({
      title: '👤 Nuevo cliente registrado',
      message: `Se ha registrado: ${clientName}`,
      description: `${clientName} ha sido agregado como nuevo ${clientType} en el sistema. Puedes ver sus detalles y comenzar a gestionar sus pedidos.`,
      icon: '🎉',
      type: 'success',
      category: 'client',
      action: 'create',
      metadata: { clientName, clientType }
    });
  }

  // Crear notificación para pedidos
  createOrderNotification(action, orderNumber, clientName, details = {}) {
    const actionMessages = {
      create: {
        title: '📋 Nuevo pedido recibido',
        message: `Pedido #${orderNumber} de ${clientName}`,
        description: `Se ha recibido un nuevo pedido del cliente ${clientName}. ${details.description || 'Revisa los detalles y confirma la disponibilidad.'}`,
        type: 'success'
      },
      update: {
        title: '📋 Pedido actualizado',
        message: `Pedido #${orderNumber} modificado`,
        description: `Se han actualizado los detalles del pedido #${orderNumber} de ${clientName}. ${details.description || ''}`,
        type: 'info'
      },
      complete: {
        title: '✅ Pedido completado',
        message: `Pedido #${orderNumber} finalizado`,
        description: `El pedido #${orderNumber} de ${clientName} ha sido completado exitosamente. ${details.description || ''}`,
        type: 'success'
      }
    };

    const config = actionMessages[action];
    if (!config) return null;

    return this.addNotification({
      ...config,
      icon: '📦',
      category: 'order',
      action,
      metadata: { orderNumber, clientName, ...details.metadata }
    });
  }
}

// Funciones específicas para diferentes tipos de notificaciones
export const notifyNewClient = (clientData) => {
  const clientName = clientData.name || clientData.nombre || 'Cliente';
  const clientPhone = clientData.phone || clientData.telefono || '';
  const clientEmail = clientData.email || clientData.correo || '';
  
  return notificationService.addNotification({
    type: 'success',
    title: 'Nuevo Cliente Registrado',
    message: `Se ha registrado un nuevo cliente: ${clientName}`,
    description: `Cliente: ${clientName}\nTeléfono: ${clientPhone}\nEmail: ${clientEmail}\n\nEl cliente ha sido agregado exitosamente al sistema. Puedes encontrar sus datos completos en la sección de Clientes.`,
    category: 'client',
    entityId: clientData.id,
    entityName: clientName,
    entityType: 'cliente'
  });
};

export const notifyClientAction = (action, clientData) => {
  const clientName = clientData.name || clientData.nombre || 'Cliente';
  const clientPhone = clientData.phone || clientData.telefono || '';
  const clientEmail = clientData.email || clientData.correo || '';
  
  const actions = {
    edit: 'editado',
    delete: 'eliminado',
    update: 'actualizado'
  };
  
  return notificationService.addNotification({
    type: 'info',
    title: `Cliente ${actions[action] || action}`,
    message: `Cliente ${clientName} ha sido ${actions[action] || action}`,
    description: `Cliente: ${clientName}\nTeléfono: ${clientPhone}\nEmail: ${clientEmail}\n\nLa información del cliente ha sido ${actions[action] || action} exitosamente.`,
    category: 'client',
    entityId: clientData.id,
    entityName: clientName,
    entityType: 'cliente'
  });
};

export const notifyNewOrder = (orderData, clientName) => {
  const orderId = orderData.id || orderData.orderId || 'N/A';
  const orderTotal = orderData.total || orderData.precio || 0;
  const orderDate = orderData.date || orderData.fecha || new Date().toLocaleDateString();
  const orderStatus = orderData.status || orderData.estado || 'Pendiente';
  
  return notificationService.addNotification({
    type: 'success',
    title: 'Nuevo Pedido Creado',
    message: `Pedido #${orderId} creado para ${clientName}`,
    description: `Pedido ID: #${orderId}\nCliente: ${clientName}\nFecha: ${orderDate}\nTotal: $${orderTotal}\nEstado: ${orderStatus}\n\nSe ha creado un nuevo pedido exitosamente. Revisa los detalles completos en la sección de Pedidos.`,
    category: 'order',
    entityId: orderId,
    entityName: `Pedido #${orderId}`,
    entityType: 'pedido'
  });
};

export const notifyOrderAction = (action, orderData) => {
  const orderId = orderData.id || orderData.orderId || 'N/A';
  const clientName = orderData.clientName || orderData.cliente || 'Cliente';
  const orderTotal = orderData.total || orderData.precio || 0;
  const orderStatus = orderData.status || orderData.estado || 'Pendiente';
  
  const actions = {
    edit: 'editado',
    delete: 'eliminado',
    update: 'actualizado'
  };
  
  return notificationService.addNotification({
    type: 'info',
    title: `Pedido ${actions[action] || action}`,
    message: `Pedido #${orderId} ha sido ${actions[action] || action}`,
    description: `Pedido ID: #${orderId}\nCliente: ${clientName}\nTotal: $${orderTotal}\nEstado: ${orderStatus}\n\nEl pedido ha sido ${actions[action] || action} exitosamente.`,
    category: 'order',
    entityId: orderId,
    entityName: `Pedido #${orderId}`,
    entityType: 'pedido'
  });
};

export const notifyNewProduct = (productData) => {
  const productName = productData.name || productData.nombre || 'Producto';
  const productPrice = productData.price || productData.precio || 0;
  const productStock = productData.stock || productData.cantidad || 0;
  const productCategory = productData.category || productData.categoria || 'General';
  
  return notificationService.addNotification({
    type: 'success',
    title: 'Nuevo Producto Agregado',
    message: `Producto "${productName}" agregado al inventario`,
    description: `Producto: ${productName}\nCategoría: ${productCategory}\nPrecio: $${productPrice}\nStock inicial: ${productStock} unidades\n\nEl producto ha sido agregado exitosamente al inventario.`,
    category: 'inventory',
    entityId: productData.id,
    entityName: productName,
    entityType: 'producto'
  });
};

export const notifyProductAction = (action, productData) => {
  const productName = productData.name || productData.nombre || 'Producto';
  const productPrice = productData.price || productData.precio || 0;
  const productStock = productData.stock || productData.cantidad || 0;
  const productCategory = productData.category || productData.categoria || 'General';
  
  const actions = {
    edit: 'editado',
    delete: 'eliminado',
    update: 'actualizado'
  };
  
  return notificationService.addNotification({
    type: 'info',
    title: `Producto ${actions[action] || action}`,
    message: `Producto "${productName}" ha sido ${actions[action] || action}`,
    description: `Producto: ${productName}\nCategoría: ${productCategory}\nPrecio: $${productPrice}\nStock: ${productStock} unidades\n\nEl producto ha sido ${actions[action] || action} exitosamente.`,
    category: 'inventory',
    entityId: productData.id,
    entityName: productName,
    entityType: 'producto'
  });
};

export const notifyLowStock = (productData) => {
  const productName = productData.name || productData.nombre || 'Producto';
  const currentStock = productData.stock || productData.cantidad || 0;
  const minStock = productData.minStock || productData.stockMinimo || 5;
  const productCategory = productData.category || productData.categoria || 'General';
  
  return notificationService.addNotification({
    type: 'warning',
    title: 'Stock Bajo',
    message: `${productName} tiene stock bajo (${currentStock} unidades)`,
    description: `Producto: ${productName}\nCategoría: ${productCategory}\nStock actual: ${currentStock} unidades\nStock mínimo: ${minStock} unidades\n\n⚠️ ALERTA: El producto tiene stock por debajo del mínimo requerido. Se recomienda reabastecer pronto para evitar desabastecimiento.`,
    category: 'inventory',
    entityId: productData.id,
    entityName: productName,
    entityType: 'producto'
  });
};

// Funciones específicas para Agenda
export const notifyAgendaAction = (action, agendaData) => {
  const agendaTitle = agendaData.title || agendaData.titulo || 'Evento';
  const agendaDate = agendaData.date || agendaData.fecha || new Date().toLocaleDateString();
  
  const actionMessages = {
    create: 'Evento creado',
    edit: 'Evento actualizado',
    delete: 'Evento eliminado'
  };
  
  return notificationService.addNotification({
    type: action === 'delete' ? 'error' : 'success',
    title: actionMessages[action] || 'Acción en Agenda',
    message: `${agendaTitle} - ${agendaDate}`,
    description: `Evento: ${agendaTitle}\nFecha: ${agendaDate}\n\n${action === 'create' ? '✅ Nuevo evento agregado a la agenda.' : action === 'edit' ? '📝 Evento actualizado correctamente.' : '🗑️ Evento eliminado de la agenda.'}`,
    category: 'agenda',
    entityId: agendaData.id,
    entityName: agendaTitle,
    entityType: 'evento'
  });
};

// Funciones específicas para Producción
export const notifyProductionAction = (action, productionData) => {
  const productionName = productionData.name || productionData.nombre || 'Producción';
  const productionStatus = productionData.status || productionData.estado || 'En proceso';
  
  const actionMessages = {
    create: 'Producción iniciada',
    edit: 'Producción actualizada',
    delete: 'Producción cancelada'
  };
  
  return notificationService.addNotification({
    type: action === 'delete' ? 'error' : 'info',
    title: actionMessages[action] || 'Acción en Producción',
    message: `${productionName} - ${productionStatus}`,
    description: `Producción: ${productionName}\nEstado: ${productionStatus}\n\n${action === 'create' ? '🏭 Nueva producción iniciada.' : action === 'edit' ? '⚙️ Producción actualizada.' : '❌ Producción cancelada.'}`,
    category: 'production',
    entityId: productionData.id,
    entityName: productionName,
    entityType: 'produccion'
  });
};

// Funciones específicas para Contratos
export const notifyContractAction = (action, contractData) => {
  const contractName = contractData.name || contractData.nombre || 'Contrato';
  const contractClient = contractData.client || contractData.cliente || 'Cliente';
  
  const actionMessages = {
    create: 'Contrato creado',
    edit: 'Contrato actualizado',
    delete: 'Contrato eliminado'
  };
  
  return notificationService.addNotification({
    type: action === 'delete' ? 'error' : 'success',
    title: actionMessages[action] || 'Acción en Contrato',
    message: `${contractName} - ${contractClient}`,
    description: `Contrato: ${contractName}\nCliente: ${contractClient}\n\n${action === 'create' ? '📄 Nuevo contrato registrado.' : action === 'edit' ? '✏️ Contrato actualizado correctamente.' : '🗑️ Contrato eliminado del sistema.'}`,
    category: 'contracts',
    entityId: contractData.id,
    entityName: contractName,
    entityType: 'contrato'
  });
};

// Instancia singleton del servicio
export const notificationService = new NotificationService();
export default notificationService;