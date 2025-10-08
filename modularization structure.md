src/
├── components/                    # 🎨 Componentes Reutilizables
│   ├── ui/                       # Componentes básicos de UI
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Input/
│   │   └── LoadingSpinner/
│   ├── layout/                   # Componentes de layout
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── NotificationContainer/
│   └── forms/                    # Formularios reutilizables
│       └── ConfirmationDialog/
│
├── features/                     # 🏢 Módulos Funcionales
│   ├── auth/                     # 🔐 Autenticación
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   └── AnimatedBackground.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── EnviarCodigo.jsx
│   │   │   └── ValidarCodigo.jsx
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
│   ├── analytics/                # 📊 Reportes y Análisis
│   │   ├── components/
│   │   │   ├── Chart.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   └── MetricsPanel.jsx
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
│   ├── api.js
│   └── dataService.js
│
├── routes/                       # 🗺️ Rutas
│   ├── Router.jsx
│   └── ProtectedRoute.jsx
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
└── assets/                       # 📁 Recursos Estáticos
    ├── images/
    └── icons/