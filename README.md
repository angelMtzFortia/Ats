# Fortia - Plataforma de Reclutamiento

## 🏗️ Estructura del Proyecto

### **Arquitectura Modular con Separación HTML/JS**

```
d:\landing1\
├── index.html                  # Página de inicio/login
├── MainLayout.html             # Dashboard principal con sidebar
├── README.md                   # Documentación del proyecto
│
├── pages/
│   └── nueva-vacante.html      # Wizard para crear vacantes
│
├── views/                      # Archivos HTML de las vistas
│   ├── dashboard.html          # Vista del dashboard
│   ├── vacantes.html           # Vista de gestión de vacantes
│   ├── candidatos.html         # Vista de candidatos (pendiente)
│   ├── diccionario.html        # Vista del diccionario (pendiente)
│   └── administracion.html     # Vista de administración (pendiente)
│
├── js/                         # Archivos JavaScript
│   ├── sidebar.js              # Lógica del sidebar y navegación
│   ├── mainLayout.js           # Controlador principal del layout
│   └── views/                  # JavaScript específico de cada vista
│       ├── dashboard.js        # Funcionalidad del dashboard
│       ├── vacantes.js         # Funcionalidad de vacantes
│       └── ...                 # Otros archivos JS de vistas
│
└── assets/
    └── images/
        └── logo_Human_Fortia.png
```

## 🚀 Flujo de Navegación

### **1. Página de Inicio** (`index.html`)
- Página simple de bienvenida
- Botón para acceder al dashboard
- Enlace directo a crear nueva vacante

### **2. Dashboard Principal** (`MainLayout.html`)
- Layout completo con sidebar
- Navegación entre vistas mediante URLs: `MainLayout.html#vista`
- Sidebar colapsable (desktop) y off-canvas (móvil)

### **3. Vistas Dinámicas**
- **Dashboard**: `MainLayout.html#dashboard` (por defecto)
- **Vacantes**: `MainLayout.html#vacantes`
- **Candidatos**: `MainLayout.html#candidatos`
- **Diccionario**: `MainLayout.html#diccionario`
- **Administración**: `MainLayout.html#administracion`
- Y más...

### **4. Wizard de Nueva Vacante** (`pages/nueva-vacante.html`)
- Proceso paso a paso para crear vacantes
- Preserva toda la lógica original del wizard
- Regresa al dashboard al completar o cancelar

## ⚙️ Características Técnicas

### **Separación de Responsabilidades**
- ✅ **HTML**: Estructura y contenido
- ✅ **CSS**: Estilos (Tailwind CSS)
- ✅ **JavaScript**: Lógica y funcionalidad

### **Navegación SPA (Single Page Application)**
- ✅ Carga dinámica de vistas HTML
- ✅ URLs con hash para navegación (`#vista`)
- ✅ Historial del navegador (back/forward)
- ✅ Carga asíncrona de JavaScript por vista

### **Responsive Design**
- ✅ Sidebar colapsable en desktop
- ✅ Off-canvas en móvil
- ✅ Layouts adaptativos

### **Funcionalidades Implementadas**
- ✅ Dashboard con KPIs animados
- ✅ Vista de vacantes con filtros
- ✅ Wizard de nueva vacante (preservado)
- ✅ Sistema de navegación completo

## 🎯 Cómo Usar

### **Desarrollo Local**
1. Abrir `index.html` en el navegador
2. Hacer clic en "Acceder al Dashboard"
3. Navegar entre vistas usando el sidebar

### **URLs Directas**
- Dashboard: `MainLayout.html` o `MainLayout.html#dashboard`
- Vacantes: `MainLayout.html#vacantes`
- Candidatos: `MainLayout.html#candidatos`
- Nueva Vacante: `pages/nueva-vacante.html`

### **Agregar Nuevas Vistas**
1. Crear archivo HTML en `views/nombre-vista.html`
2. Crear archivo JS en `js/views/nombre-vista.js` (opcional)
3. La vista se cargará automáticamente al navegar a `MainLayout.html#nombre-vista`

## 🔧 Próximos Pasos

### **Vistas Pendientes**
- [ ] `views/candidatos.html` - Gestión de candidatos
- [ ] `views/diccionario.html` - Diccionario de competencias
- [ ] `views/administracion.html` - Panel de administración
- [ ] `views/analisis.html` - Reportes y análisis
- [ ] `views/transferencia.html` - Transferencia de datos

### **Mejoras Sugeridas**
- [ ] Implementar sistema de autenticación
- [ ] Conectar con APIs reales
- [ ] Agregar más interactividad a las vistas
- [ ] Implementar notificaciones
- [ ] Agregar modo oscuro

## 📝 Notas Técnicas

### **Buenas Prácticas Implementadas**
- Separación clara entre HTML, CSS y JavaScript
- Arquitectura modular y escalable
- Carga dinámica de recursos
- Manejo de errores en carga de vistas
- URLs amigables con hash routing

### **Compatibilidad**
- Navegadores modernos (ES6+)
- Responsive design (móvil y desktop)
- Tailwind CSS para estilos consistentes