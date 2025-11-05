import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit, Trash2, X, AlertTriangle, Frame, Settings, GraduationCap, Zap } from 'lucide-react';
import StatsCard from '@/features/inventory/components/StatsCard.jsx';
import AlertsSection from '@/features/inventory/components/AlertsSection.jsx';
import CategoryTabs from '@/features/inventory/components/CategoryTabs.jsx';
import SubcategoryTabs from '@/features/inventory/components/SubcategoryTabs.jsx';
import FormField from '@/features/inventory/components/FormField.jsx';
import AlertContainer from '@components/ui/AlertContainer/AlertContainer.jsx';
import ConfirmDialog from '@components/forms/ConfirmDialog/ConfirmDialog.jsx';

const Inventario = () => {
  // Estado para alertas integrado directamente
  const [alerts, setAlerts] = useState([]);

  // Funciones de alertas integradas
  const showSuccess = (title, message) => {
    const id = Date.now().toString();
    const newAlert = {
      id,
      type: 'success',
      title,
      message,
      duration: 5000
    };
    setAlerts(prev => [...prev, newAlert]);
    
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  };

  const showError = (title, message) => {
    const id = Date.now().toString();
    const newAlert = {
      id,
      type: 'error',
      title,
      message,
      duration: 5000
    };
    setAlerts(prev => [...prev, newAlert]);
    
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  };

  const showWarning = (title, message) => {
    const id = Date.now().toString();
    const newAlert = {
      id,
      type: 'warning',
      title,
      message,
      duration: 5000
    };
    setAlerts(prev => [...prev, newAlert]);
    
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };
  // Estados principales
  const [activeCategory, setActiveCategory] = useState('enmarcados');
  const [activeSubcategory, setActiveSubcategory] = useState('molduras-listones');
  const [products, setProducts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    productId: null,
    productName: ''
  });
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    subcategory: "",
    price: "",
    stock: "",
    // Campos específicos por categoría
    material: "",
    color: "",
    dimensions: "",
    brand: "",
    supplier: "",
    // Campos específicos para molduras
    width: "",
    // Campos específicos para vidrios
    type: "",
    thickness: "",
    size: "",
    quantity: "",
    minStock: "",
    totalCost: "",
    // Campos específicos para paspartú
    grosor: "",
    // Campos específicos para graduaciones
    format: "",
    // Campos específicos para minilab
    tipoInsumo: "",
    nombreTipo: "",
    tamañoPresentacion: "",
    cantidadStock: "",
    fechaCompra: "",
    costoUnit: "",
    stockMin: "",
    costoTotal: "",
    // Campos específicos para corte láser
    producto: "",
    tipo: "",
    tamañoCm: "",
    unidad: "",
    proveedor: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  // Definición de categorías y subcategorías con campos específicos
  const categories = {
    enmarcados: {
      name: "Enmarcados",
      icon: Frame,
      subcategories: {
        'molduras-listones': { 
          name: "Moldura (Listón)", 
          fields: ['name', 'width', 'color', 'material', 'stock', 'price', 'totalCost', 'minStock'],
          options: {
            name: ['Moldura Clásica', 'Moldura Moderna'],
            width: ['1"', '1.5"'],
            color: ['Dorado', 'Plateado'],
            material: ['Madera', 'Aluminio']
          }
        },
        'molduras-prearmadas': { 
          name: "Moldura Prearmada", 
          fields: ['dimensions', 'color', 'material', 'stock', 'price'],
          options: {
            dimensions: ['20x25cm', '30x40cm'],
            color: ['Dorado', 'Plateado'],
            material: ['Madera', 'Aluminio']
          }
        },
        'vidrios-tapas': { 
          name: "Vidrio o Tapa MDF", 
          fields: ['type', 'glassType', 'thickness', 'size', 'quantity', 'minStock', 'price', 'totalCost'],
          options: {
            type: ['Vidrio', 'Tapa MDF'],
            glassType: ['Común', 'Antireflejo'],
            thickness: ['2mm', '3mm'],
            size: ['20x25cm', '30x40cm']
          }
        },
        'paspartu': { 
          name: "Paspartú", 
          fields: ['type', 'size', 'grosor', 'color', 'quantity', 'price', 'minStock'],
          options: {
            type: ['Estándar', 'Premium'],
            size: ['30x40cm', '40x50cm'],
            grosor: ['1.5mm', '2mm'],
            color: ['Blanco', 'Crema']
          }
        }
      }
    },
    minilab: {
      name: "Minilab",
      icon: Settings,
      fields: ['tipoInsumo', 'nombreTipo', 'tamañoPresentacion', 'cantidadStock', 'fechaCompra', 'costoUnit', 'stockMin', 'costoTotal'],
      options: {
        tipoInsumo: ['Papel', 'Química', 'Químico'],
        nombreTipo: ['Papel Lustre', 'Papel Mate', 'Revelador RA-4', 'Blanqueador'],
        tamañoPresentacion: ['10x15 cm', '20x30 cm', 'Kit 5L', '1 Litro']
      }
    },
    graduaciones: {
      name: "Graduaciones",
      icon: GraduationCap,
      subcategories: {
        'cuadros': { 
          name: "Cuadro", 
          fields: ['format', 'dimensions', 'material', 'quantity', 'price', 'minStock'],
          options: {
            format: ['Horizontal', 'Vertical'],
            dimensions: ['20x25cm', '30x40cm'],
            material: ['Canvas', 'Papel Fotográfico']
          }
        },
        'anuarios': { 
          name: "Anuario", 
          fields: ['format', 'pages', 'cover', 'quantity', 'price', 'minStock'],
          options: {
            format: ['A4', 'A5'],
            pages: ['50', '100'],
            cover: ['Tapa Dura', 'Tapa Blanda']
          }
        }
      }
    },
    'corte-laser': {
      name: "Corte Láser",
      icon: Zap,
      fields: ['producto', 'tipo', 'tamañoCm', 'color', 'unidad', 'stock', 'stockMin', 'costoUnit', 'proveedor'],
      options: {
        producto: ['Plancha MDF Jeans', 'Plancha Acrílico 3mm', 'Cartón Microcorrugado', 'Lámina MDF Crillada', 'Lente de Enfoque', 'Espejo Reflector'],
        tipo: ['MDF', 'Acrílico', 'Cartón', 'Lámina Crillada', 'Lente', 'Espejo'],
        tamañoCm: ['60x40cm', '60x70cm', '60x40cm', '60x40cm', '2.5"', '1"'],
        color: ['Natural', 'Transparente', 'Blanco', 'Natural', 'Transparente', 'Plateado'],
        unidad: ['Plancha', 'Plancha', 'Plancha', 'Plancha', 'Pieza', 'Pieza'],
        proveedor: ['AcriFlex Tama', 'Excelente Tama', 'MDF Perú', 'Epilog', 'Trotec']
      }
    },
    accesorios: {
      name: "Accesorios",
      icon: Package,
      subcategories: {
        'marcos-accesorios': { 
          name: "Marco y Accesorio", 
          fields: ['name', 'type', 'material', 'color', 'dimensions', 'price', 'stock'],
          options: {
            type: ['Gancho', 'Soporte'],
            material: ['Metal', 'Plástico'],
            color: ['Dorado', 'Plateado']
          }
        },
        'herramientas-generales': { 
          name: "Herramienta General", 
          fields: ['name', 'brand', 'type', 'price', 'stock', 'minStock'],
          options: {
            brand: ['Stanley', 'Bosch'],
            type: ['Cortador', 'Regla']
          }
        }
      }
    }
  };

  // Manejar categorías con y sin subcategorías - DECLARADO DESPUÉS DE categories
  const currentCategory = categories[activeCategory];
  const hasSubcategories = currentCategory?.subcategories && Object.keys(currentCategory.subcategories).length > 0;
  
  let currentSubcategories = {};
  let currentSubcategory = null;
  let currentFields = [];
  let currentOptions = {};
  
  if (hasSubcategories) {
    // Categoría con subcategorías
    currentSubcategories = currentCategory.subcategories;
    currentSubcategory = currentSubcategories[activeSubcategory];
    currentFields = currentSubcategory?.fields || [];
    currentOptions = currentSubcategory?.options || {};
  } else {
    // Categoría sin subcategorías (directa)
    currentFields = currentCategory?.fields || [];
    currentOptions = currentCategory?.options || {};
  }

  // Cargar datos desde localStorage al montar el componente
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("inventory_categorized")) || {};
    setProducts(saved);
  }, []);

  // Guardar datos en localStorage cuando cambie el estado de productos
  useEffect(() => {
    localStorage.setItem("inventory_categorized", JSON.stringify(products));
  }, [products]);

  // Manejar cambios de categoría activa y ajustar subcategoría
  useEffect(() => {
    const currentCategory = categories[activeCategory];
    if (currentCategory && currentCategory.subcategories) {
      // Si la categoría tiene subcategorías, establecer la primera como activa
      const firstSubcategory = Object.keys(currentCategory.subcategories)[0];
      if (firstSubcategory && activeSubcategory !== firstSubcategory) {
        setActiveSubcategory(firstSubcategory);
      }
    } else {
      // Si la categoría no tiene subcategorías, limpiar la subcategoría activa
      setActiveSubcategory('');
    }
  }, [activeCategory]);

  // Funciones auxiliares
  const openModal = () => {
    setFormData({
      ...formData,
      category: activeCategory,
      subcategory: activeSubcategory
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      category: activeCategory,
      subcategory: activeSubcategory,
      price: "",
      stock: "",
      material: "",
      color: "",
      dimensions: "",
      brand: "",
      supplier: "",
      width: "",
      type: "",
      thickness: "",
      size: "",
      quantity: "",
      minStock: "",
      totalCost: "",
      grosor: "",
      format: "",
      // Campos específicos para minilab
      tipoInsumo: "",
      nombreTipo: "",
      tamañoPresentacion: "",
      cantidadStock: "",
      fechaCompra: "",
      costoUnit: "",
      stockMin: "",
      costoTotal: "",
      // Campos específicos para corte láser
      producto: "",
      tipo: "",
      tamañoCm: "",
      unidad: "",
      proveedor: ""
    });
    setIsEditing(false);
  };

  // Generar ID único para nuevos productos
  const generateId = () => {
    const prefix = activeCategory.toUpperCase().slice(0, 3);
    return prefix + Date.now().toString().slice(-6);
  };

  // Validar formulario
  const validateForm = () => {
    if (!formData.name && !formData.type) {
      showError("Error de validación", "El nombre del producto es obligatorio");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showError("Error de validación", "El precio debe ser mayor a 0");
      return false;
    }
    if (formData.stock && parseInt(formData.stock) < 0) {
      showError("Error de validación", "El stock no puede ser negativo");
      return false;
    }
    return true;
  };

  // Manejar agregar o actualizar producto
  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const categoryKey = hasSubcategories ? `${activeCategory}_${activeSubcategory}` : activeCategory;
    const currentProducts = products[categoryKey] || [];

    // Calcular costo total si es necesario
    const updatedFormData = { ...formData };
    if (formData.price && formData.quantity) {
      updatedFormData.totalCost = (parseFloat(formData.price) * parseInt(formData.quantity)).toFixed(2);
    }

    if (isEditing) {
      const updatedProducts = currentProducts.map(product =>
        product.id === formData.id ? updatedFormData : product
      );
      setProducts(prev => ({
        ...prev,
        [categoryKey]: updatedProducts
      }));
      showSuccess("¡Éxito!", "Producto actualizado exitosamente");
    } else {
      const newProduct = {
        ...updatedFormData,
        id: generateId()
      };
      setProducts(prev => ({
        ...prev,
        [categoryKey]: [...currentProducts, newProduct]
      }));
      showSuccess("¡Éxito!", "Producto agregado exitosamente");
    }

    closeModal();
  };

  // Manejar edición de producto
  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Manejar eliminación de producto
  const handleDelete = (productId) => {
    const categoryKey = hasSubcategories ? `${activeCategory}_${activeSubcategory}` : activeCategory;
    const currentProducts = products[categoryKey] || [];
    const product = currentProducts.find(p => p.id === productId);
    
    setConfirmDialog({
      isOpen: true,
      productId: productId,
      productName: product?.name || product?.type || 'este producto'
    });
  };

  const confirmDelete = () => {
    const categoryKey = hasSubcategories ? `${activeCategory}_${activeSubcategory}` : activeCategory;
    const currentProducts = products[categoryKey] || [];
    const updatedProducts = currentProducts.filter(product => product.id !== confirmDialog.productId);
    
    setProducts(prev => ({
      ...prev,
      [categoryKey]: updatedProducts
    }));
    
    showSuccess("¡Eliminado!", "Producto eliminado exitosamente");
    
    setConfirmDialog({
      isOpen: false,
      productId: null,
      productName: ''
    });
  };

  // Obtener productos filtrados
  const getFilteredProducts = () => {
    // Para categorías sin subcategorías, usar solo el nombre de la categoría
    const categoryKey = hasSubcategories ? `${activeCategory}_${activeSubcategory}` : activeCategory;
    const currentProducts = products[categoryKey] || [];
    
    if (!searchTerm) return currentProducts;
    
    return currentProducts.filter(product =>
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.material && product.material.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.type && product.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Obtener estadísticas generales de todas las categorías
  const getStats = () => {
    // Obtener todos los productos de todas las categorías y subcategorías
    const allProducts = Object.values(products).flat();
    
    const totalProducts = allProducts.length;
    const lowStock = allProducts.filter(p => {
      const stock = parseInt(p.stock || p.quantity || 0);
      const minStock = parseInt(p.minStock || 5);
      return stock <= minStock;
    }).length;
    const totalValue = allProducts.reduce((sum, p) => {
      const price = parseFloat(p.price || 0);
      const quantity = parseInt(p.stock || p.quantity || 0);
      return sum + (price * quantity);
    }, 0);

    return { totalProducts, lowStock, totalValue };
  };

  const stats = getStats();
  const filteredProducts = getFilteredProducts();
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
              <p className="text-gray-600">Gestiona tu inventario por categorías</p>
            </div>
          </div>
        </div>

        {/* 1. Estadísticas - PRIMERO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard 
            title="Total Productos" 
            value={stats.totalProducts} 
            icon={Package} 
            bgColor="bg-blue-100" 
            iconColor="text-blue-600" 
          />
          <StatsCard 
            title="Stock de Productos" 
            value={stats.totalProducts} 
            icon={Package} 
            bgColor="bg-green-100" 
            iconColor="text-green-600" 
          />
          <StatsCard 
            title="Alertas de Stock" 
            value={stats.lowStock} 
            icon={AlertTriangle} 
            bgColor="bg-red-100" 
            iconColor="text-red-600" 
          />
        </div>

        {/* 2. Alertas Generales de Inventarios - SEGUNDO (Desplegable) */}
        <AlertsSection 
          showAlerts={showAlerts} 
          setShowAlerts={setShowAlerts} 
          stats={stats} 
          filteredProducts={filteredProducts} 
        />

        {/* 3. Pestañas de categorías principales - TERCERO */}
        <CategoryTabs 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
          setActiveSubcategory={setActiveSubcategory} 
        />

        {/* 4. Pestañas de subcategorías - CUARTO (solo si hay subcategorías) */}
        {hasSubcategories && (
          <SubcategoryTabs 
            subcategories={currentSubcategories} 
            activeSubcategory={activeSubcategory} 
            setActiveSubcategory={setActiveSubcategory} 
          />
        )}
      </div>

      {/* Contenido principal */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header de la tabla */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {hasSubcategories 
                ? `${categories[activeCategory]?.name} - ${currentSubcategory?.name}`
                : categories[activeCategory]?.name
              }
            </h2>
            <button
              onClick={openModal}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir {hasSubcategories ? currentSubcategory?.name : categories[activeCategory]?.name}</span>
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Buscar ${hasSubcategories ? currentSubcategory?.name.toLowerCase() : categories[activeCategory]?.name.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {currentFields.map(field => {
                  const fieldLabels = {
                    name: 'NOMBRE DE MOLDURA',
                    width: 'ANCHO (PULGADAS)',
                    color: 'COLOR',
                    material: 'MATERIAL',
                    stock: 'STOCK',
                    price: 'COSTO UNITARIO',
                    totalCost: 'COSTO TOTAL',
                    minStock: 'STOCK MÍNIMO',
                    type: 'TIPO DE MATERIAL',
                    glassType: 'TIPO DE VIDRIO',
                    thickness: 'GROSOR',
                    size: 'TAMAÑO',
                    quantity: 'CANTIDAD',
                    grosor: 'GROSOR',
                    format: 'FORMATO',
                    paperType: 'TIPO DE PAPEL',
                    inkType: 'TIPO DE TINTA',
                    brand: 'MARCA',
                    laserType: 'TIPO DE LÁSER',
                    power: 'POTENCIA',
                    pages: 'PÁGINAS',
                    cover: 'TIPO DE TAPA',
                    dimensions: 'DIMENSIONES',
                    // Campos específicos para minilab
                    tipoInsumo: 'TIPO DE INSUMO',
                    nombreTipo: 'NOMBRE / TIPO',
                    tamañoPresentacion: 'TAMAÑO / PRESENTACIÓN',
                    cantidadStock: 'CANTIDAD EN STOCK',
                    fechaCompra: 'FECHA COMPRA',
                    costoUnit: 'COSTO UNIT.',
                    stockMin: 'STOCK MIN',
                    costoTotal: 'COSTO TOTAL',
                    // Campos específicos para corte láser
                    producto: 'PRODUCTO',
                    tipo: 'TIPO',
                    tamañoCm: 'TAMAÑO (CM)',
                    unidad: 'UNIDAD',
                    proveedor: 'PROVEEDOR'
                  };
                  
                  return (
                    <th key={field} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {fieldLabels[field] || field.toUpperCase()}
                    </th>
                  );
                })}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={currentFields.length + 1} className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No hay productos</p>
                    <p>Agrega tu primer {currentSubcategory?.name.toLowerCase()} para comenzar</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    {currentFields.map(field => (
                      <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {field === 'price' || field === 'totalCost' ? (
                          `S/ ${parseFloat(product[field] || 0).toFixed(2)}`
                        ) : field === 'stock' || field === 'quantity' ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            parseInt(product[field] || 0) <= parseInt(product.minStock || 5)
                              ? 'bg-red-100 text-red-800'
                              : parseInt(product[field] || 0) <= parseInt(product.minStock || 5) * 2
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {product[field] || 0}
                          </span>
                        ) : (
                          product[field] || '-'
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para agregar/editar producto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditing ? `Editar ${currentSubcategory?.name}` : `Añadir ${currentSubcategory?.name}`}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Complete los campos para {isEditing ? 'actualizar' : 'agregar'} {hasSubcategories ? currentSubcategory?.name.toLowerCase() : categories[activeCategory]?.name.toLowerCase()} al inventario
              </p>

              <form onSubmit={handleAddOrUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentFields.map(field => (
                    <FormField 
                      key={field}
                      fieldName={field}
                      formData={formData}
                      setFormData={setFormData}
                      options={currentOptions[field] || []}
                      isRequired={['name', 'type', 'price'].includes(field)}
                    />
                  ))}
                </div>

                <div className="flex space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                  >
                    {isEditing ? "Actualizar" : "Guardar Producto"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor de Alertas */}
      <AlertContainer alerts={alerts} onRemove={removeAlert} />

      {/* Diálogo de Confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        type="danger"
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar "${confirmDialog.productName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, productId: null, productName: '' })}
      />
    </div>
  );
};

export default Inventario;
