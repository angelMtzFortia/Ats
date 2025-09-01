// Sidebar functionality
class SidebarManager {
  constructor() {
    this.currentView = 'dashboard';
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.initToggleFeature();
  }

  attachEventListeners() {
    // Navegación entre vistas
    document.addEventListener('click', (e) => {
      const navItem = e.target.closest('[data-view]');
      if (navItem) {
        e.preventDefault();
        const view = navItem.getAttribute('data-view');
        this.navigateToView(view);
      }
    });
  }

  navigateToView(view) {
    // Actualizar estado activo
    this.updateActiveState(view);
    
    // Disparar evento personalizado para que la aplicación principal maneje el cambio de vista
    const event = new CustomEvent('viewChange', { 
      detail: { view: view, previousView: this.currentView } 
    });
    document.dispatchEvent(event);
    
    // Actualizar URL sin recargar la página
    const newUrl = `MainLayout.html#${view}`;
    window.history.pushState({ view: view }, '', newUrl);
    
    this.currentView = view;
  }

  updateActiveState(activeView) {
    // Remover estado activo de todos los elementos
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('bg-blue-50', 'text-fortia-primary', 'font-medium');
      item.classList.add('hover:bg-gray-50');
    });

    // Agregar estado activo al elemento seleccionado
    const activeItem = document.querySelector(`[data-view="${activeView}"]`);
    if (activeItem) {
      activeItem.classList.add('bg-blue-50', 'text-fortia-primary', 'font-medium');
      activeItem.classList.remove('hover:bg-gray-50');
    }
  }

  initToggleFeature() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const mqDesktop = window.matchMedia('(min-width: 768px)');

    if (!toggleBtn || !sidebar || !overlay) return;

    // Off-canvas (móvil)
    const openSidebarMobile = () => {
      sidebar.classList.remove('-translate-x-full');
      sidebar.classList.add('translate-x-0');
      overlay.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    };

    const closeSidebarMobile = () => {
      sidebar.classList.add('-translate-x-full');
      sidebar.classList.remove('translate-x-0');
      overlay.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    };

    // Rail collapse (desktop)
    const toggleDesktopRail = () => {
      const collapsed = sidebar.getAttribute('data-collapsed') === 'true';
      if (collapsed) {
        // expandir
        sidebar.setAttribute('data-collapsed', 'false');
        sidebar.classList.remove('md:w-20');
        sidebar.classList.add('md:w-64');
      } else {
        // colapsar
        sidebar.setAttribute('data-collapsed', 'true');
        sidebar.classList.remove('md:w-64');
        sidebar.classList.add('md:w-20');
      }
    };

    // Click hamburguesa
    toggleBtn.addEventListener('click', () => {
      if (mqDesktop.matches) {
        // Desktop: colapsa/expande rail
        toggleDesktopRail();
      } else {
        // Móvil: abre/cierra off-canvas
        const isOpen = !sidebar.classList.contains('-translate-x-full');
        if (isOpen) closeSidebarMobile();
        else openSidebarMobile();
      }
    });

    // Cerrar overlay en móvil
    overlay.addEventListener('click', closeSidebarMobile);

    // Sincroniza estado al cambiar tamaño
    const syncOnResize = () => {
      if (mqDesktop.matches) {
        // Asegura visible en desktop y oculta overlay
        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
      } else {
        // En móvil empieza cerrado
        closeSidebarMobile();
      }
    };

    window.addEventListener('resize', syncOnResize);
    // Estado inicial coherente
    syncOnResize();
  }

  // Método para establecer la vista activa desde fuera
  setActiveView(view) {
    this.updateActiveState(view);
    this.currentView = view;
  }

  // Método para obtener la vista desde la URL
  getViewFromUrl() {
    const hash = window.location.hash.substring(1);
    return hash || 'dashboard';
  }
}

// Exportar para uso global
window.SidebarManager = SidebarManager;