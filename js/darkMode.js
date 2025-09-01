// Dark Mode Manager
class DarkModeManager {
  constructor() {
    this.darkModeKey = 'fortia-dark-mode';
    this.init();
  }

  init() {
    this.loadSavedTheme();
    this.attachEventListeners();
  }

  loadSavedTheme() {
    // Verificar preferencia guardada o preferencia del sistema
    const savedTheme = localStorage.getItem(this.darkModeKey);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDark = savedTheme === 'dark' || (savedTheme === null && systemPrefersDark);
    
    if (shouldUseDark) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  attachEventListeners() {
    const toggleButton = document.getElementById('darkModeToggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        this.toggleDarkMode();
      });
    }

    // Escuchar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Solo aplicar cambio automático si no hay preferencia guardada
      if (!localStorage.getItem(this.darkModeKey)) {
        if (e.matches) {
          this.enableDarkMode();
        } else {
          this.disableDarkMode();
        }
      }
    });
  }

  toggleDarkMode() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    if (isDarkMode) {
      this.disableDarkMode();
      localStorage.setItem(this.darkModeKey, 'light');
    } else {
      this.enableDarkMode();
      localStorage.setItem(this.darkModeKey, 'dark');
    }

    // Disparar evento personalizado para que otros componentes puedan reaccionar
    const event = new CustomEvent('darkModeChanged', { 
      detail: { isDarkMode: !isDarkMode } 
    });
    document.dispatchEvent(event);
  }

  enableDarkMode() {
    document.documentElement.classList.add('dark');
    this.updateToggleButton(true);
  }

  disableDarkMode() {
    document.documentElement.classList.remove('dark');
    this.updateToggleButton(false);
  }

  updateToggleButton(isDarkMode) {
    const toggleButton = document.getElementById('darkModeToggle');
    if (toggleButton) {
      const moonIcon = toggleButton.querySelector('svg:first-child');
      const sunIcon = toggleButton.querySelector('svg:last-child');
      
      if (isDarkMode) {
        toggleButton.title = 'Cambiar a modo claro';
        if (moonIcon) moonIcon.classList.add('hidden');
        if (sunIcon) sunIcon.classList.remove('hidden');
      } else {
        toggleButton.title = 'Cambiar a modo oscuro';
        if (moonIcon) moonIcon.classList.remove('hidden');
        if (sunIcon) sunIcon.classList.add('hidden');
      }
    }
  }

  // Método público para obtener el estado actual
  isDarkMode() {
    return document.documentElement.classList.contains('dark');
  }

  // Método público para forzar un modo específico
  setDarkMode(enabled) {
    if (enabled) {
      this.enableDarkMode();
      localStorage.setItem(this.darkModeKey, 'dark');
    } else {
      this.disableDarkMode();
      localStorage.setItem(this.darkModeKey, 'light');
    }
  }
}

// Inicializar el gestor de modo oscuro lo antes posible para evitar flash
document.addEventListener('DOMContentLoaded', () => {
  window.darkModeManager = new DarkModeManager();
});

// También exportar la clase para uso externo
window.DarkModeManager = DarkModeManager;