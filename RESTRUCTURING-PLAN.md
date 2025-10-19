# 📋 Plan de Reestructuración - Arte Ideas

## 🎯 Objetivo
Migrar la arquitectura actual a una estructura modular basada en **Features** (características), siguiendo las mejores prácticas de React y mejorando la mantenibilidad, escalabilidad y organización del código.

---

## 📊 Análisis de la Estructura Actual

### Estructura Actual
```
src/
├── components/
│   ├── auth/                    # Componentes de autenticación
│   ├── common/                  # Componentes comunes (Button, Card, Modal, etc.)
│   ├── dashboard/               # Componentes específicos de dashboard
│   ├── forms/                   # Formularios (Client, Order, Activo, Contrato, Project)
│   ├── ConfirmationModal.jsx   # ⚠️ Duplicado/mal ubicado
│   └── ReclassificationModal.jsx
├── context/
│   ├── AppContext.jsx
│   └── AuthContext.jsx
├── hooks/
│   ├── useApi.js
│   ├── useAuth.js              # ⚠️ Duplicado con AuthContext
│   └── useLocalStorage.js
├── pages/
│   ├── analytics/              # Reportes
│   ├── auth/                   # Login, cambio de contraseña, etc.
│   ├── dashboard/              # Dashboard principal
│   ├── management/             # ⚠️ Mezcla de múltiples features
│   │   ├── Activos.jsx
│   │   ├── Agenda.jsx
│   │   ├── Clientes.jsx
│   │   ├── Contratos.jsx
│   │   ├── Inventario.jsx
│   │   ├── Pedidos.jsx
│   │   └── Produccion.jsx
│   └── profile/                # Perfil y configuración
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── dataService.js
│   └── notificationService.js
├── styles/
│   ├── animations.css
│   └── globals.css
└── utils/
    ├── constants.js
    ├── helpers.js
    ├── ProtectedRoute.jsx        # ⚠️ Debería estar en routes/
    └── validators.js
```

### ⚠️ Problemas Identificados

1. **Falta de cohesión por features**: Los archivos están organizados por tipo (components, pages, services) en lugar de por funcionalidad de negocio.

2. **Duplicación de lógica**: Existe `useAuth.js` en hooks/ y `AuthContext.jsx` en context/ con funcionalidades similares.

3. **Componentes mal ubicados**: 
   - `ConfirmationModal.jsx` y `ReclassificationModal.jsx` en la raíz de components/
   - `ProtectedRoute.jsx` en utils/ en lugar de routes/

4. **Carpeta management muy grande**: Mezcla 7 features diferentes (Activos, Agenda, Clientes, Contratos, Inventario, Pedidos, Producción).

5. **Dependencias cruzadas**: Los componentes tienen imports largos y complejos que cruzan múltiples carpetas.

6. **Falta de carpeta routes/**: La lógica de routing está mezclada en App.jsx.

7. **Servicios globales mezclados**: `dataService.js` y `notificationService.js` deberían estar más especializados.

---

## 🎨 Nueva Estructura Propuesta

### Estructura Objetivo (Basada en Features)
```
src/
├── components/                    # 🎨 Componentes Reutilizables Globales
│   ├── ui/                       # Componentes básicos de UI
│   │   ├── Button/
│   │   │   └── Button.jsx
│   │   ├── Card/
│   │   │   └── Card.jsx
│   │   ├── Modal/
│   │   │   └── Modal.jsx
│   │   ├── Input/
│   │   │   └── Input.jsx
│   │   └── LoadingSpinner/
│   │       └── LoadingSpinner.jsx
│   ├── layout/                   # Componentes de layout
│   │   ├── Header/
│   │   │   └── Header.jsx
│   │   ├── Sidebar/
│   │   │   └── Sidebar.jsx
│   │   └── NotificationContainer/
│   │       ├── NotificationContainer.jsx
│   │       ├── NotificationModal.jsx
│   │       └── QuickAlertsPanel.jsx
│   └── forms/                    # Formularios reutilizables
│       └── ConfirmationDialog/
│           └── ConfirmationDialog.jsx
│
├── features/                     # 🏢 Módulos Funcionales (FEATURE-BASED)
│   │
│   ├── auth/                     # 🔐 Autenticación
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── AnimatedBackground.jsx
│   │   │   └── Login.module.css
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── EnviarCodigo.jsx
│   │   │   ├── ValidarCodigo.jsx
│   │   │   └── NuevaContrasena.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   └── services/
│   │       └── authService.js
│   │
│   ├── clients/                  # 👥 Gestión de Clientes
│   │   ├── components/
│   │   │   └── ClientForm.jsx
│   │   ├── pages/
│   │   │   └── Clientes.jsx
│   │   ├── hooks/
│   │   │   └── useClients.js
│   │   └── services/
│   │       └── clientsService.js
│   │
│   ├── orders/                   # 📦 Gestión de Pedidos
│   │   ├── components/
│   │   │   └── OrderForm.jsx
│   │   ├── pages/
│   │   │   └── Pedidos.jsx
│   │   ├── hooks/
│   │   │   └── useOrders.js
│   │   └── services/
│   │       └── ordersService.js
│   │
│   ├── inventory/                # 📋 Inventario
│   │   ├── pages/
│   │   │   └── Inventario.jsx
│   │   ├── hooks/
│   │   │   └── useInventory.js
│   │   └── services/
│   │       └── inventoryService.js
│   │
│   ├── production/               # 🏭 Producción
│   │   ├── components/
│   │   │   └── ReclassificationModal.jsx
│   │   ├── pages/
│   │   │   └── Produccion.jsx
│   │   ├── hooks/
│   │   │   └── useProduction.js
│   │   └── services/
│   │       └── productionService.js
│   │
│   ├── contracts/                # 📄 Contratos
│   │   ├── components/
│   │   │   └── ContratoForm.jsx
│   │   ├── pages/
│   │   │   └── Contratos.jsx
│   │   ├── hooks/
│   │   │   └── useContracts.js
│   │   └── services/
│   │       └── contractsService.js
│   │
│   ├── calendar/                 # 📅 Agenda/Calendario
│   │   ├── pages/
│   │   │   └── Agenda.jsx
│   │   ├── hooks/
│   │   │   └── useCalendar.js
│   │   └── services/
│   │       └── calendarService.js
│   │
│   ├── assets/                   # 🏢 Activos Fijos
│   │   ├── components/
│   │   │   └── ActivoForm.jsx
│   │   ├── pages/
│   │   │   └── Activos.jsx
│   │   ├── hooks/
│   │   │   └── useAssets.js
│   │   └── services/
│   │       └── assetsService.js
│   │
│   ├── analytics/                # 📊 Reportes y Análisis
│   │   ├── components/
│   │   │   ├── Chart.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── MetricsPanel.jsx
│   │   │   └── ReportExportModal.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Reportes.jsx
│   │   ├── hooks/
│   │   │   └── useAnalytics.js
│   │   └── services/
│   │       └── analyticsService.js
│   │
│   └── profile/                  # 👤 Perfil y Configuración
│       ├── pages/
│       │   ├── MiPerfil.jsx
│       │   └── Configuracion.jsx
│       ├── hooks/
│       │   └── useProfile.js
│       └── services/
│           └── profileService.js
│
├── context/                      # 🗂️ Contextos Globales
│   ├── AppContext.jsx
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
│
├── hooks/                        # 🎣 Hooks Globales
│   ├── useApi.js
│   └── useLocalStorage.js
│
├── services/                     # 🌐 Servicios Globales
│   ├── api.js                   # Cliente HTTP base
│   └── notificationService.js   # Servicio de notificaciones global
│
├── routes/                       # 🗺️ Configuración de Rutas
│   ├── Router.jsx               # Router principal
│   ├── ProtectedRoute.jsx       # HOC para rutas protegidas
│   └── routes.config.js         # Configuración de rutas
│
├── pages/                        # 📄 Páginas Especiales/Globales
│   ├── NotFound.jsx             # Página 404
│   ├── ServerError.jsx          # Página 500
│   ├── Unauthorized.jsx         # Página 403
│   ├── Maintenance.jsx          # Página de mantenimiento
│   └── NetworkError.jsx         # Página sin conexión
│
├── utils/                        # 🛠️ Utilidades
│   ├── constants.js
│   ├── helpers.js
│   └── validators.js
│
├── styles/                       # 🎨 Estilos Globales
│   ├── globals.css
│   └── animations.css
│
├── assets/                       # 📁 Recursos Estáticos
│   ├── images/
│   │   ├── logo.png
│   │   ├── icono.png
│   │   └── elberc149-profile.jpg
│   └── icons/
│
├── App.jsx                       # Componente raíz simplificado
└── main.jsx                      # Punto de entrada
```

---

## 🔄 Mapeo de Archivos: Estructura Actual → Nueva Estructura

### 📘 Aclaración: ¿Dónde va cada cosa?

**🎨 `components/ui/`** - Componentes básicos/primitivos reutilizables
- Elementos de UI puros sin lógica de negocio
- Ejemplos: Button, Card, Modal, Input, LoadingSpinner
- Se usan en TODO el proyecto

**🏗️ `components/layout/`** - Componentes de estructura/esqueleto
- Definen la estructura visual de la aplicación
- Siempre visibles cuando estás autenticado
- Ejemplos: Header, Sidebar, Footer, NotificationContainer
- Envuelven el contenido de las páginas

**🏢 `features/[nombre]/pages/`** - Páginas de cada funcionalidad
- Contenido específico de cada sección
- Solo se renderiza cuando navegas a esa sección
- Ejemplos: Dashboard, Clientes, Pedidos, Produccion
- Van DENTRO del layout (Header + Sidebar)

**📄 `pages/`** - Páginas especiales/globales de la aplicación
- Páginas que no pertenecen a ningún feature específico
- Páginas de error y estados especiales de la app
- Ejemplos: 404 (NotFound), 500 (ServerError), 403 (Unauthorized)
- NO van dentro de features porque son transversales

---

### 📦 Componentes UI Reutilizables
| Archivo Actual | Nueva Ubicación |
|----------------|-----------------|
| `components/common/Button.jsx` | `components/ui/Button/Button.jsx` |
| `components/common/Card.jsx` | `components/ui/Card/Card.jsx` |
| `components/common/Modal.jsx` | `components/ui/Modal/Modal.jsx` |
| `components/common/LoadingSpinner.jsx` | `components/ui/LoadingSpinner/LoadingSpinner.jsx` |
| `components/common/ConfirmationDialog.jsx` | `components/forms/ConfirmationDialog/ConfirmationDialog.jsx` |
| `components/ConfirmationModal.jsx` | `components/forms/ConfirmationDialog/` (consolidar con ConfirmationDialog) |

### 🏗️ Componentes de Layout
| Archivo Actual | Nueva Ubicación |
|----------------|-----------------|
| `components/common/Header.jsx` | `components/layout/Header/Header.jsx` |
| `components/common/Sidebar.jsx` | `components/layout/Sidebar/Sidebar.jsx` |
| `components/common/NotificationContainer.jsx` | `components/layout/NotificationContainer/NotificationContainer.jsx` |
| `components/common/NotificationModal.jsx` | `components/layout/NotificationContainer/NotificationModal.jsx` |
| `components/common/QuickAlertsPanel.jsx` | `components/layout/NotificationContainer/QuickAlertsPanel.jsx` |

### 🔐 Feature: Autenticación
| Archivo Actual | Nueva Ubicación |
|----------------|-----------------|
| `components/auth/LoginForm.jsx` | `features/auth/components/LoginForm.jsx` |
| `components/auth/AnimatedBackground.jsx` | `features/auth/components/AnimatedBackground.jsx` |
| `components/auth/Login.module.css` | `features/auth/components/Login.module.css` |
| `pages/auth/Login.jsx` | `features/auth/pages/Login.jsx` |
| `pages/auth/ChangePassword.jsx` | `features/auth/pages/ChangePassword.jsx` |
| `pages/auth/EnviarCodigo.jsx` | `features/auth/pages/EnviarCodigo.jsx` |
| `pages/auth/ValidarCodigo.jsx` | `features/auth/pages/ValidarCodigo.jsx` |
| `pages/auth/NuevaContrasena.jsx` | `features/auth/pages/NuevaContrasena.jsx` |
| `hooks/useAuth.js` | `features/auth/hooks/useAuth.js` |
| `services/authService.js` | `features/auth/services/authService.js` |

### 👥 Feature: Clientes
| Archivo Actual | Nueva Ubicación |
|----------------|-----------------|
| `components/forms/ClientForm.jsx` | `features/clients/components/ClientForm.jsx` |
| `pages/management/Clientes.jsx` | `features/clients/pages/Clientes.jsx` |
| *nuevo* | `features/clients/hooks/useClients.js` |
| *nuevo* | `features/clients/services/clientsService.js` |

### 📦 Feature: Pedidos
| Archivo Actual | Nueva Ubicación |
|----------------|-----------------|
| `components/forms/OrderForm.jsx` | `features/orders/components/OrderForm.jsx` |
| `pages/management/Pedidos.jsx` | `features/orders/pages/Pedidos.jsx` |
| *nuevo* | `features/orders/hooks/useOrders.js` |
| *nuevo* | `features/orders/services/ordersService.js` |

### 📋 Feature: Inventario
| Archivo Actual | Nueva Ubicación |
|----------------|-----------------|
| `pages/management/Inventario.jsx` | `features/inventory/pages/Inventario.jsx` |
| *nuevo* | `features/inventory/hooks/useInventory.js` |
| *nuevo* | `features/inventory/services/inventoryService.js` |

### 🏭 Feature: Producción
| Archivo Actual | Nueva Ubicación |
|----------------|-----------------|
| `pages/management/Produccion.jsx` | `features/production/pages/Produccion.jsx` |
| `components/ReclassificationModal.jsx` | `features/production/components/ReclassificationModal.jsx` |
| *nuevo* | `features/production/hooks/useProduction.js` |
| *nuevo* | `features/production/services/productionService.js` |

### 📄 Feature: Contratos
| Archivo Actual | Nueva Ubicación |
|----------------|-----------------|
| `components/forms/ContratoForm.jsx` | `features/contracts/components/ContratoForm.jsx` |
| `pages/management/Contratos.jsx` | `features/contracts/pages/Contratos.jsx` |
| *nuevo* | `features/contracts/hooks/useContracts.js` |
| *nuevo* | `features/contracts/services/contractsService.js` |

### 📅 Feature: Agenda
| Archivo Actual | Nueva Ubicación |
|----------------|-----------------|
| `pages/management/Agenda.jsx` | `features/calendar/pages/Agenda.jsx` |
| *nuevo* | `features/calendar/hooks/useCalendar.js` |
| *nuevo* | `features/calendar/services/calendarService.js` |

### 🏢 Feature: Activos
| Archivo Actual | Nueva Ubicación |
|----------------|-----------------|
| `components/forms/ActivoForm.jsx` | `features/assets/components/ActivoForm.jsx` |
| `pages/management/Activos.jsx` | `features/assets/pages/Activos.jsx` |
| *nuevo* | `features/assets/hooks/useAssets.js` |
| *nuevo* | `features/assets/services/assetsService.js` |

### 📊 Feature: Analytics
| Archivo Actual | Nueva Ubicación |
|----------------|-----------------|
| `components/dashboard/Chart.jsx` | `features/analytics/components/Chart.jsx` |
| `components/dashboard/StatsCard.jsx` | `features/analytics/components/StatsCard.jsx` |
| `components/dashboard/MetricsPanel.jsx` | `features/analytics/components/MetricsPanel.jsx` |
| `components/common/ReportExportModal.jsx` | `features/analytics/components/ReportExportModal.jsx` |
| `pages/dashboard/Dashboard.jsx` | `features/analytics/pages/Dashboard.jsx` |
| `pages/analytics/Reportes.jsx` | `features/analytics/pages/Reportes.jsx` |
| *nuevo* | `features/analytics/hooks/useAnalytics.js` |
| *nuevo* | `features/analytics/services/analyticsService.js` |

### 👤 Feature: Profile
| Archivo Actual | Nueva Ubicación |
|----------------|-----------------|
| `pages/profile/MiPerfil.jsx` | `features/profile/pages/MiPerfil.jsx` |
| `pages/profile/Configuracion.jsx` | `features/profile/pages/Configuracion.jsx` |
| *nuevo* | `features/profile/hooks/useProfile.js` |
| *nuevo* | `features/profile/services/profileService.js` |

### 🗺️ Rutas
| Archivo Actual | Nueva Ubicación |
|----------------|-----------------|
| `utils/ProtectedRoute.jsx` | `routes/ProtectedRoute.jsx` |
| *nuevo* | `routes/Router.jsx` |
| *nuevo* | `routes/routes.config.js` |

### 📄 Páginas Especiales (Nuevo)
| Archivo Actual | Nueva Ubicación |
|----------------|-----------------|
| *nuevo* | `pages/NotFound.jsx` (404) |
| *nuevo* | `pages/ServerError.jsx` (500) |
| *nuevo* | `pages/Unauthorized.jsx` (403) |
| *nuevo* | `pages/Maintenance.jsx` |
| *nuevo* | `pages/NetworkError.jsx` |

### 🌐 Servicios y Otros
| Archivo Actual | Nueva Ubicación |
|----------------|-----------------|
| `services/api.js` | `services/api.js` (sin cambios) |
| `services/notificationService.js` | `services/notificationService.js` (sin cambios) |
| `services/dataService.js` | ⚠️ **ELIMINAR** (lógica se distribuye en cada feature) |
| `context/AppContext.jsx` | `context/AppContext.jsx` (sin cambios) |
| `context/AuthContext.jsx` | `context/AuthContext.jsx` (sin cambios) |
| `hooks/useApi.js` | `hooks/useApi.js` (sin cambios) |
| `hooks/useLocalStorage.js` | `hooks/useLocalStorage.js` (sin cambios) |
| `components/forms/ProjectForm.jsx` | ⚠️ **EVALUAR** (no se usa en el proyecto actual) |

---

## 📝 Ventajas de la Nueva Estructura

### ✅ Beneficios

1. **Cohesión por Features**: Cada módulo contiene todo lo relacionado con una funcionalidad específica
2. **Escalabilidad**: Fácil agregar nuevos features sin afectar los existentes
3. **Mantenibilidad**: Cambios en un feature están aislados en su propia carpeta
4. **Testing**: Más fácil testear cada feature de forma independiente
5. **Colaboración**: Múltiples desarrolladores pueden trabajar en diferentes features sin conflictos
6. **Imports más claros**: `import useClients from '@features/clients/hooks/useClients'`
7. **Lazy Loading**: Posibilidad de cargar features bajo demanda
8. **Reutilización**: Componentes UI y layout claramente separados y reutilizables

### 📈 Mejoras de Arquitectura

- **Separation of Concerns**: Clara separación entre UI, lógica de negocio y datos
- **Single Responsibility**: Cada carpeta tiene una responsabilidad única y bien definida
- **Open/Closed Principle**: Fácil extender sin modificar código existente
- **Dependency Inversion**: Features dependen de abstracciones (hooks, services) no de implementaciones

---

## 🚀 Plan de Migración

### Fase 1: Preparación (Sin cambios destructivos)
1. ✅ Crear documento de análisis (este archivo)
2. ⏳ Revisar y aprobar el plan con el equipo
3. ⏳ Crear rama de desarrollo `feature/restructure-architecture`


### Fase 2: Estructura Base
1. ⏳ Crear estructura de carpetas nuevas (features/, components/ui/, components/layout/, pages/)
2. ⏳ Crear carpeta `routes/` y mover lógica de routing
3. ⏳ Crear páginas de error (NotFound, ServerError, Unauthorized, etc.)

### Fase 3: Migración de Componentes UI y Layout
1. ⏳ Mover componentes a `components/ui/`
2. ⏳ Mover componentes a `components/layout/`
3. ⏳ Actualizar imports en archivos que los usan
4. ⏳ Testear que todo funciona correctamente

### Fase 4: Migración de Features (Uno por uno)
1. ⏳ **Feature Auth** (Crítico - hacerlo primero)
2. ⏳ **Feature Analytics** (Dashboard)
3. ⏳ **Feature Clients**
4. ⏳ **Feature Orders**
5. ⏳ **Feature Inventory**
6. ⏳ **Feature Production**
7. ⏳ **Feature Contracts**
8. ⏳ **Feature Calendar**
9. ⏳ **Feature Assets**
10. ⏳ **Feature Profile**

### Fase 5: Limpieza
1. ⏳ Eliminar carpetas antiguas vacías
2. ⏳ Actualizar `App.jsx` con imports de features
3. ⏳ Eliminar archivos duplicados o no utilizados
4. ⏳ Verificar que no queden imports rotos

### Fase 6: Mejoras Post-Migración
1. ⏳ Crear hooks personalizados para cada feature
2. ⏳ Extraer servicios específicos de `dataService.js`
3. ⏳ Documentar cada feature con README.md
4. ⏳ Optimizar imports con aliases

### Fase 7: Testing y Deployment
1. ⏳ Testing completo de todas las funcionalidades
2. ⏳ Revisión de código
3. ⏳ Merge a main
4. ⏳ Deploy a producción

---


## ⚠️ Consideraciones y Riesgos

### Riesgos
1. **Imports rotos**: Muchos archivos tendrán que actualizarse
2. **Testing incompleto**: Puede haber funcionalidades que fallen si no se testea bien
3. **Tiempo de desarrollo**: La migración puede tomar varios días
4. **Conflictos en Git**: Si hay desarrollo paralelo, pueden haber conflictos

### Mitigaciones
1. ✅ Hacer la migración en una rama separada
2. ✅ Migrar feature por feature, no todo de golpe
3. ✅ Testear después de cada feature migrada
4. ✅ Mantener backup de la versión anterior
5. ✅ Documentar todos los cambios
6. ✅ Usar search/replace global para actualizar imports

---

## 📊 Métricas de Mejora Esperadas

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Profundidad máxima de carpetas | 4 niveles | 4 niveles | = |
| Archivos en carpeta `pages/management/` | 7 archivos | 0 (distribuido en features) | ✅ |
| Longitud promedio de imports | `../../components/common/Button` | `@components/ui/Button/Button` | ✅ 35% |
| Cohesión por funcionalidad | Baja | Alta | ✅ |
| Facilidad para agregar features | Media | Alta | ✅ |


---

## ✅ Checklist Final

### Pre-Migración
- [ ] Revisar y aprobar este documento
- [ ] Crear backup del proyecto actual
- [ ] Crear rama `feature/restructure-architecture`
- [ ] Comunicar al equipo sobre la reestructuración

### Durante Migración
- [ ] Crear estructura de carpetas (features/, components/ui/, components/layout/, pages/)
- [ ] Configurar aliases en vite.config.js y jsconfig.json (incluir @pages)
- [ ] Crear páginas de error (NotFound, ServerError, Unauthorized, etc.)
- [ ] Migrar componentes UI
- [ ] Migrar componentes Layout
- [ ] Migrar cada feature uno por uno
- [ ] Actualizar imports en todos los archivos
- [ ] Configurar rutas para manejo de errores (404, 403, 500)

### Post-Migración
- [ ] Eliminar carpetas y archivos antiguos
- [ ] Testing completo de todas las funcionalidades
- [ ] Actualizar documentación (README.md)
- [ ] Code review
- [ ] Merge a main
- [ ] Deploy

---

## 🎯 Conclusión

Esta reestructuración transformará el proyecto de una arquitectura tradicional basada en tipos de archivos a una arquitectura moderna basada en **features/funcionalidades**, lo que mejorará significativamente:

- ✅ **Mantenibilidad**: Más fácil encontrar y modificar código
- ✅ **Escalabilidad**: Agregar nuevos features es más simple
- ✅ **Colaboración**: Equipos pueden trabajar en features independientes
- ✅ **Testing**: Cada feature es testeable de forma aislada
- ✅ **Performance**: Posibilidad de lazy loading por feature
- ✅ **Developer Experience**: Imports más claros y concisos


