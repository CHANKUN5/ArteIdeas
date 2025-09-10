import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

// Validadores básicos
export const basicValidators = {
  // Validar campo requerido
  required: (value, fieldName = 'Campo') => {
    if (value === null || value === undefined) {
      return `${fieldName} es requerido`;
    }
    
    if (typeof value === 'string' && value.trim().length === 0) {
      return `${fieldName} es requerido`;
    }
    
    if (Array.isArray(value) && value.length === 0) {
      return `${fieldName} es requerido`;
    }
    
    return null;
  },

  // Validar email
  email: (email) => {
    if (!email) return null;
    
    if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
      return ERROR_MESSAGES.INVALID_EMAIL;
    }
    
    return null;
  },

  // Validar teléfono
  phone: (phone) => {
    if (!phone) return null;
    
    const cleanPhone = phone.replace(/\s/g, '');
    if (!VALIDATION_RULES.PHONE_REGEX.test(cleanPhone)) {
      return ERROR_MESSAGES.INVALID_PHONE;
    }
    
    return null;
  },

  // Validar contraseña
  password: (password, minLength = VALIDATION_RULES.PASSWORD_MIN_LENGTH) => {
    if (!password) return null;
    
    if (password.length < minLength) {
      return `La contraseña debe tener al menos ${minLength} caracteres`;
    }
    
    return null;
  },

  // Validar confirmación de contraseña
  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return ERROR_MESSAGES.REQUIRED_FIELD;
    
    if (password !== confirmPassword) {
      return ERROR_MESSAGES.PASSWORDS_NOT_MATCH;
    }
    
    return null;
  },

  // Validar RUC
  ruc: (ruc) => {
    if (!ruc) return null;
    
    if (!VALIDATION_RULES.RUC_REGEX.test(ruc)) {
      return ERROR_MESSAGES.INVALID_RUC;
    }
    
    return null;
  },

  // Validar DNI
  dni: (dni) => {
    if (!dni) return null;
    
    if (!VALIDATION_RULES.DNI_REGEX.test(dni)) {
      return ERROR_MESSAGES.INVALID_DNI;
    }
    
    return null;
  },

  // Validar longitud mínima
  minLength: (value, min, fieldName = 'Campo') => {
    if (!value) return null;
    
    if (value.length < min) {
      return `${fieldName} debe tener al menos ${min} caracteres`;
    }
    
    return null;
  },

  // Validar longitud máxima
  maxLength: (value, max, fieldName = 'Campo') => {
    if (!value) return null;
    
    if (value.length > max) {
      return `${fieldName} no puede tener más de ${max} caracteres`;
    }
    
    return null;
  },

  // Validar rango numérico
  numberRange: (value, min, max, fieldName = 'Valor') => {
    if (value === null || value === undefined || value === '') return null;
    
    const num = parseFloat(value);
    if (isNaN(num)) {
      return `${fieldName} debe ser un número válido`;
    }
    
    if (num < min) {
      return `${fieldName} debe ser mayor o igual a ${min}`;
    }
    
    if (num > max) {
      return `${fieldName} debe ser menor o igual a ${max}`;
    }
    
    return null;
  },

  // Validar número positivo
  positiveNumber: (value, fieldName = 'Valor') => {
    if (value === null || value === undefined || value === '') return null;
    
    const num = parseFloat(value);
    if (isNaN(num)) {
      return `${fieldName} debe ser un número válido`;
    }
    
    if (num <= 0) {
      return `${fieldName} debe ser mayor a 0`;
    }
    
    return null;
  },

  // Validar fecha
  date: (date, fieldName = 'Fecha') => {
    if (!date) return null;
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return `${fieldName} no es válida`;
    }
    
    return null;
  },

  // Validar fecha futura
  futureDate: (date, fieldName = 'Fecha') => {
    const dateError = basicValidators.date(date, fieldName);
    if (dateError) return dateError;
    
    const dateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateObj < today) {
      return `${fieldName} debe ser posterior a hoy`;
    }
    
    return null;
  },

  // Validar URL
  url: (url, fieldName = 'URL') => {
    if (!url) return null;
    
    try {
      new URL(url);
      return null;
    } catch {
      return `${fieldName} no es válida`;
    }
  },
};

// Validadores específicos para el negocio
export const businessValidators = {
  // Validar datos de cliente
  clientData: (data) => {
    const errors = {};
    
    const nameError = basicValidators.required(data.nombre, 'Nombre');
    if (nameError) errors.nombre = nameError;
    
    const contactError = basicValidators.required(data.contacto, 'Contacto');
    if (contactError) {
      errors.contacto = contactError;
    } else {
      const phoneError = basicValidators.phone(data.contacto);
      if (phoneError) errors.contacto = phoneError;
    }
    
    if (data.email) {
      const emailError = basicValidators.email(data.email);
      if (emailError) errors.email = emailError;
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  },

  // Validar datos de pedido
  orderData: (data) => {
    const errors = {};
    
    const clientError = basicValidators.required(data.cliente, 'Cliente');
    if (clientError) errors.cliente = clientError;
    
    const serviceError = basicValidators.required(data.servicio, 'Servicio');
    if (serviceError) errors.servicio = serviceError;
    
    const quantityError = basicValidators.positiveNumber(data.cantidad, 'Cantidad');
    if (quantityError) errors.cantidad = quantityError;
    
    const priceError = basicValidators.positiveNumber(data.precio, 'Precio');
    if (priceError) errors.precio = priceError;
    
    if (data.fechaEntrega) {
      const deliveryDateError = basicValidators.futureDate(data.fechaEntrega, 'Fecha de entrega');
      if (deliveryDateError) errors.fechaEntrega = deliveryDateError;
    }
    
    if (data.fechaPedido && data.fechaEntrega) {
      const orderDate = new Date(data.fechaPedido);
      const deliveryDate = new Date(data.fechaEntrega);
      
      if (deliveryDate <= orderDate) {
        errors.fechaEntrega = 'La fecha de entrega debe ser posterior a la fecha del pedido';
      }
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  },

  // Validar datos de inventario
  inventoryData: (data) => {
    const errors = {};
    
    const nameError = basicValidators.required(data.nombre, 'Nombre del artículo');
    if (nameError) errors.nombre = nameError;
    
    const categoryError = basicValidators.required(data.categoria, 'Categoría');
    if (categoryError) errors.categoria = categoryError;
    
    const stockError = basicValidators.numberRange(data.stock, 0, 999999, 'Stock');
    if (stockError) errors.stock = stockError;
    
    const minStockError = basicValidators.numberRange(data.stockMinimo, 0, 999999, 'Stock mínimo');
    if (minStockError) errors.stockMinimo = minStockError;
    
    const priceError = basicValidators.positiveNumber(data.precio, 'Precio');
    if (priceError) errors.precio = priceError;
    
    return Object.keys(errors).length > 0 ? errors : null;
  },

  // Validar datos de producción
  productionData: (data) => {
    const errors = {};
    
    const nameError = basicValidators.required(data.nombre, 'Nombre del trabajo');
    if (nameError) errors.nombre = nameError;
    
    const clientError = basicValidators.required(data.cliente, 'Cliente');
    if (clientError) errors.cliente = clientError;
    
    const operatorError = basicValidators.required(data.operario, 'Operario');
    if (operatorError) errors.operario = operatorError;
    
    if (data.fechaEstimada) {
      const estimatedDateError = basicValidators.futureDate(data.fechaEstimada, 'Fecha estimada');
      if (estimatedDateError) errors.fechaEstimada = estimatedDateError;
    }
    
    if (data.progreso !== undefined) {
      const progressError = basicValidators.numberRange(data.progreso, 0, 100, 'Progreso');
      if (progressError) errors.progreso = progressError;
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  },

  // Validar datos de contrato
  contractData: (data) => {
    const errors = {};
    
    const clientError = basicValidators.required(data.cliente, 'Cliente');
    if (clientError) errors.cliente = clientError;
    
    const serviceError = basicValidators.required(data.servicio, 'Servicio');
    if (serviceError) errors.servicio = serviceError;
    
    const valueError = basicValidators.positiveNumber(data.valor, 'Valor del contrato');
    if (valueError) errors.valor = valueError;
    
    const startDateError = basicValidators.date(data.fechaInicio, 'Fecha de inicio');
    if (startDateError) errors.fechaInicio = startDateError;
    
    const endDateError = basicValidators.date(data.fechaFin, 'Fecha de fin');
    if (endDateError) errors.fechaFin = endDateError;
    
    if (data.fechaInicio && data.fechaFin) {
      const startDate = new Date(data.fechaInicio);
      const endDate = new Date(data.fechaFin);
      
      if (endDate <= startDate) {
        errors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }
    
    if (data.pagado !== undefined && data.valor) {
      if (parseFloat(data.pagado) > parseFloat(data.valor)) {
        errors.pagado = 'El monto pagado no puede ser mayor al valor total';
      }
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  },
};

// Validador de formularios genérico
export const formValidator = {
  // Validar un formulario completo
  validateForm: (data, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
      const fieldValue = data[field];
      
      for (const rule of fieldRules) {
        let error = null;
        
        if (typeof rule === 'function') {
          error = rule(fieldValue);
        } else if (typeof rule === 'object') {
          const { validator, message, ...params } = rule;
          
          if (typeof validator === 'function') {
            const isValid = validator(fieldValue, params);
            error = isValid ? null : (message || 'Campo inválido');
          } else if (typeof validator === 'string' && basicValidators[validator]) {
            error = basicValidators[validator](fieldValue, params.fieldName || field);
          }
        }
        
        if (error) {
          errors[field] = error;
          break; // Detener en el primer error
        }
      }
    });
    
    return Object.keys(errors).length > 0 ? errors : null;
  },

  // Validar un campo específico
  validateField: (value, rules, fieldName) => {
    const fieldRules = Array.isArray(rules) ? rules : [rules];
    
    for (const rule of fieldRules) {
      let error = null;
      
      if (typeof rule === 'function') {
        error = rule(value);
      } else if (typeof rule === 'object') {
        const { validator, message, ...params } = rule;
        
        if (typeof validator === 'function') {
          const isValid = validator(value, params);
          error = isValid ? null : (message || 'Campo inválido');
        } else if (typeof validator === 'string' && basicValidators[validator]) {
          error = basicValidators[validator](value, params.fieldName || fieldName);
        }
      }
      
      if (error) return error;
    }
    
    return null;
  },
};

// Reglas de validación predefinidas
export const validationRules = {
  // Usuario
  user: {
    nombre: [
      (value) => basicValidators.required(value, 'Nombre'),
      (value) => basicValidators.minLength(value, 2, 'Nombre'),
      (value) => basicValidators.maxLength(value, 50, 'Nombre'),
    ],
    email: [
      (value) => basicValidators.required(value, 'Email'),
      (value) => basicValidators.email(value),
    ],
    telefono: [
      (value) => basicValidators.phone(value),
    ],
  },

  // Cliente
  client: {
    nombre: [
      (value) => basicValidators.required(value, 'Nombre'),
      (value) => basicValidators.minLength(value, 2, 'Nombre'),
    ],
    contacto: [
      (value) => basicValidators.required(value, 'Contacto'),
      (value) => basicValidators.phone(value),
    ],
    email: [
      (value) => basicValidators.email(value),
    ],
  },

  // Pedido
  order: {
    cliente: [(value) => basicValidators.required(value, 'Cliente')],
    servicio: [(value) => basicValidators.required(value, 'Servicio')],
    cantidad: [
      (value) => basicValidators.required(value, 'Cantidad'),
      (value) => basicValidators.positiveNumber(value, 'Cantidad'),
    ],
    precio: [
      (value) => basicValidators.required(value, 'Precio'),
      (value) => basicValidators.positiveNumber(value, 'Precio'),
    ],
    fechaEntrega: [
      (value) => basicValidators.required(value, 'Fecha de entrega'),
      (value) => basicValidators.futureDate(value, 'Fecha de entrega'),
    ],
  },

  // Inventario
  inventory: {
    nombre: [
      (value) => basicValidators.required(value, 'Nombre'),
      (value) => basicValidators.minLength(value, 2, 'Nombre'),
    ],
    categoria: [(value) => basicValidators.required(value, 'Categoría')],
    stock: [
      (value) => basicValidators.required(value, 'Stock'),
      (value) => basicValidators.numberRange(value, 0, 999999, 'Stock'),
    ],
    precio: [
      (value) => basicValidators.required(value, 'Precio'),
      (value) => basicValidators.positiveNumber(value, 'Precio'),
    ],
  },

  // Producción
  production: {
    nombre: [
      (value) => basicValidators.required(value, 'Nombre'),
      (value) => basicValidators.minLength(value, 3, 'Nombre'),
    ],
    cliente: [(value) => basicValidators.required(value, 'Cliente')],
    operario: [(value) => basicValidators.required(value, 'Operario')],
  },

  // Contrato
  contract: {
    cliente: [(value) => basicValidators.required(value, 'Cliente')],
    servicio: [(value) => basicValidators.required(value, 'Servicio')],
    valor: [
      (value) => basicValidators.required(value, 'Valor'),
      (value) => basicValidators.positiveNumber(value, 'Valor'),
    ],
    fechaInicio: [
      (value) => basicValidators.required(value, 'Fecha de inicio'),
      (value) => basicValidators.date(value, 'Fecha de inicio'),
    ],
    fechaFin: [
      (value) => basicValidators.required(value, 'Fecha de fin'),
      (value) => basicValidators.date(value, 'Fecha de fin'),
    ],
  },
};

export default {
  basicValidators,
  businessValidators,
  formValidator,
  validationRules,
};