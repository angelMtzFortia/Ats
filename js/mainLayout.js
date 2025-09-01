// Main Layout Controller
class MainLayoutApp {
  constructor() {
    this.currentView = 'dashboard';
    this.sidebar = null;
    this.views = {};
    this.init();
  }

  init() {
    this.initSidebar();
    this.attachEventListeners();
    this.loadInitialView();
  }

  initSidebar() {
    this.sidebar = new window.SidebarManager();
  }

  attachEventListeners() {
    // Escuchar cambios de vista desde el sidebar
    document.addEventListener('viewChange', (e) => {
      const { view } = e.detail;
      this.loadView(view);
    });

    // Botón Nueva Vacante
    const nuevaVacanteBtn = document.getElementById('nuevaVacanteBtn');
    if (nuevaVacanteBtn) {
      nuevaVacanteBtn.addEventListener('click', () => {
        window.location.href = 'pages/nueva-vacante.html';
      });
    }

    // Manejar navegación del navegador (back/forward)
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.view) {
        this.loadView(e.state.view, false); // false = no actualizar URL
      }
    });
  }

  loadInitialView() {
    // Cargar vista desde URL o dashboard por defecto
    const initialView = this.sidebar.getViewFromUrl();
    this.loadView(initialView, false); // false = no actualizar URL ya que ya estamos en ella
  }

  async loadView(viewName, updateUrl = true) {
    try {
      // Cargar el HTML de la vista
      const viewHtml = await this.loadViewHtml(viewName);
      
      // Actualizar contenido
      const contentContainer = document.getElementById('main-content');
      contentContainer.innerHTML = viewHtml;

      // Cargar y ejecutar el JavaScript de la vista si existe
      await this.loadViewScript(viewName);

      // Actualizar sidebar
      if (this.sidebar) {
        this.sidebar.setActiveView(viewName);
      }

      // Actualizar título de la página
      this.updatePageTitle(viewName);

      // Actualizar URL si es necesario
      if (updateUrl) {
        const newUrl = `MainLayout.html#${viewName}`;
        window.history.pushState({ view: viewName }, '', newUrl);
      }

      this.currentView = viewName;
    } catch (error) {
      console.error(`Error loading view "${viewName}":`, error);
      this.showErrorView(viewName);
    }
  }

  async loadViewHtml(viewName) {
    try {
      const response = await fetch(`views/${viewName}.html`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      // Si no existe el archivo HTML, crear una vista básica
      return this.createBasicViewHtml(viewName);
    }
  }

  async loadViewScript(viewName) {
    // Lista de vistas que tienen archivos JavaScript
    const viewsWithScripts = ['dashboard', 'vacantes', 'candidatos'];
    
    // Solo intentar cargar script si la vista está en la lista
    if (!viewsWithScripts.includes(viewName)) {
      console.log(`View "${viewName}" does not require a JavaScript file`);
      return;
    }

    try {
      // Verificar si ya existe el script
      const existingScript = document.querySelector(`script[data-view="${viewName}"]`);
      if (existingScript) {
        existingScript.remove();
      }

      // Cargar nuevo script
      const script = document.createElement('script');
      script.src = `js/views/${viewName}.js`;
      script.setAttribute('data-view', viewName);
      script.onerror = () => {
        console.log(`Failed to load JavaScript file for view: ${viewName}`);
      };
      document.head.appendChild(script);
      console.log(`JavaScript loaded for view: ${viewName}`);
    } catch (error) {
      console.log(`Error loading JavaScript file for view: ${viewName}`, error);
    }
  }

  createBasicViewHtml(viewName) {
    const titles = {
      dashboard: 'Dashboard',
      vacantes: 'Vacantes',
      candidatos: 'Candidatos',
      diccionario: 'Diccionario',
      administracion: 'Administración',
      analisis: 'Análisis',
      transferencia: 'Transferencia',
      organizacion: 'Mi Organización',
      usuarios: 'Usuarios',
      procesos: 'Mis Procesos',
      settings: 'Configuración'
    };

    const icons = {
      dashboard: '🏠',
      vacantes: '➕',
      candidatos: '👤',
      diccionario: '📚',
      administracion: '⚙️',
      analisis: '📊',
      transferencia: '🔄',
      organizacion: '🏢',
      usuarios: '👥',
      procesos: '⚡',
      settings: '⚙️'
    };

    const title = titles[viewName] || 'Vista';
    const icon = icons[viewName] || '📄';
    const description = `Gestión de ${title.toLowerCase()}`;

    return `
      <main class="p-6">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">${title}</h1>
          <p class="text-slate-600 mt-1">${description}</p>
        </div>

        <div class="bg-white rounded-xl shadow-card p-12 text-center">
          <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span class="text-4xl">${icon}</span>
          </div>
          <h2 class="text-xl font-semibold text-slate-800 mb-2">${title}</h2>
          <p class="text-slate-600 mb-6">${description}</p>
          <button class="bg-fortia-primary text-white px-6 py-3 rounded-lg hover:bg-fortia-primary/90 transition-colors">
            Próximamente
          </button>
        </div>
      </main>
    `;
  }

  showErrorView(viewName) {
    const contentContainer = document.getElementById('main-content');
    contentContainer.innerHTML = `
      <main class="p-6">
        <div class="bg-white rounded-xl shadow-card p-12 text-center">
          <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span class="text-4xl">❌</span>
          </div>
          <h2 class="text-xl font-semibold text-slate-800 mb-2">Error al cargar la vista</h2>
          <p class="text-slate-600 mb-6">No se pudo cargar la vista "${viewName}"</p>
          <button onclick="window.location.reload()" class="bg-fortia-primary text-white px-6 py-3 rounded-lg hover:bg-fortia-primary/90 transition-colors">
            Recargar página
          </button>
        </div>
      </main>
    `;
  }

  updatePageTitle(viewName) {
    const titles = {
      dashboard: 'Dashboard',
      vacantes: 'Vacantes',
      candidatos: 'Candidatos',
      diccionario: 'Diccionario',
      administracion: 'Administración',
      analisis: 'Análisis',
      transferencia: 'Transferencia',
      organizacion: 'Mi Organización',
      usuarios: 'Usuarios',
      procesos: 'Mis Procesos',
      settings: 'Configuración'
    };

    const title = titles[viewName] || 'Fortia';
    document.title = `Fortia · ${title}`;
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.mainLayoutApp = new MainLayoutApp();
});

// Exportar para uso global
window.MainLayoutApp = MainLayoutApp;