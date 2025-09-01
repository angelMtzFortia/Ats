// Filtros y funcionalidad para la vista de Vacantes
class VacantesManager {
  constructor() {
    this.tbody = null;
    this.noRow = null;
    this.controls = {};
    this.debounceTimer = null;
  }

  init() {
    // Esperar a que los elementos estén disponibles
    this.waitForElements(() => {
      this.setupElements();
      this.setupTabs();
      this.setupFilters();
      this.setupActions();
      this.applyFilters(); // Aplicar filtros iniciales
    });
  }

  waitForElements(callback, maxAttempts = 50) {
    let attempts = 0;
    const checkElements = () => {
      const tbody = document.getElementById('jobsTbody');
      const noRow = document.getElementById('noResultsRow');
      
      if (tbody && noRow) {
        callback();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkElements, 100);
      } else {
        console.warn('VacantesManager: No se pudieron encontrar los elementos necesarios');
      }
    };
    checkElements();
  }

  setupElements() {
    this.tbody = document.getElementById('jobsTbody');
    this.noRow = document.getElementById('noResultsRow');
    
    this.controls = {
      search: document.getElementById('fltSearch'),
      state: document.getElementById('fltState'),
      dept: document.getElementById('fltDept'),
      recruiter: document.getElementById('fltRecruiter'),
      sort: document.getElementById('fltSort'),
    };

    if (!this.tbody || !this.noRow) {
      console.warn('VacantesManager: Elementos tbody o noRow no encontrados');
      return false;
    }
    return true;
  }

  setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        
        // Actualizar estilos de tabs
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('bg-fortia-primary', 'text-white');
          b.classList.add('border', 'border-slate-200', 'text-slate-700');
          
          // Soporte para modo oscuro
          if (document.documentElement.classList.contains('dark')) {
            b.classList.add('dark:border-slate-600', 'dark:text-slate-300');
          }
        });
        
        btn.classList.add('bg-fortia-primary', 'text-white');
        btn.classList.remove('border', 'border-slate-200', 'text-slate-700', 'dark:border-slate-600', 'dark:text-slate-300');
        
        // Mostrar/ocultar paneles
        ['lista', 'kanban', 'analytics'].forEach(id => {
          const pane = document.getElementById('tab-' + id);
          if (pane) {
            pane.classList.toggle('hidden', id !== target);
          }
        });
      });
    });
  }

  setupFilters() {
    // Búsqueda con debounce
    if (this.controls.search) {
      this.controls.search.addEventListener('input', () => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.applyFilters(), 300);
      });
    }

    // Otros filtros
    ['state', 'dept', 'recruiter', 'sort'].forEach(key => {
      if (this.controls[key]) {
        this.controls[key].addEventListener('change', () => this.applyFilters());
      }
    });
  }

  setupActions() {
    if (!this.tbody) return;

    this.tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const tr = btn.closest('tr[data-position]');
      if (!tr) return;

      const puesto = tr.dataset.position || 'Vacante';
      const action = btn.dataset.action;

      switch (action) {
        case 'view-candidates':
          this.viewCandidates(puesto, tr.dataset);
          break;
        case 'edit-job':
          this.editJob(puesto, tr.dataset);
          break;
        default:
          // Fallback basado en texto del botón
          const label = this.removeAccents(btn.textContent).trim().toLowerCase();
          if (label.includes('ver') || label.includes('candidatos')) {
            this.viewCandidates(puesto, tr.dataset);
          } else if (label.includes('editar')) {
            this.editJob(puesto, tr.dataset);
          }
      }
    });
  }

  applyFilters() {
    if (!this.tbody || !this.noRow) return;

    const term = this.removeAccents(this.controls.search?.value || '');
    const fState = this.controls.state?.value || '';
    const fDept = this.controls.dept?.value || '';
    const fRec = this.controls.recruiter?.value || '';
    const sortBy = this.controls.sort?.value || '';

    const rows = [...this.tbody.querySelectorAll('tr[data-position]')];
    const visible = [];

    // Filtrar filas
    rows.forEach(tr => {
      const d = tr.dataset;
      let show = true;

      // Filtro de búsqueda
      if (term) {
        const searchText = this.removeAccents(`${d.position} ${d.dept} ${d.recruiter}`);
        show = searchText.includes(term);
      }

      // Filtros de selección
      if (show && fState) show = d.state === fState;
      if (show && fDept) show = d.dept === fDept;
      if (show && fRec) show = d.recruiter === fRec;

      tr.classList.toggle('hidden', !show);
      if (show) visible.push(tr);
    });

    // Ordenamiento
    if (sortBy && visible.length > 0) {
      this.sortRows(visible, sortBy);
    }

    // Mostrar mensaje de "sin resultados"
    const isEmpty = visible.length === 0;
    this.noRow.classList.toggle('hidden', !isEmpty);
    if (isEmpty) {
      this.tbody.appendChild(this.noRow);
    }

    // Actualizar contador (si existe)
    this.updateResultsCounter(visible.length, rows.length);
  }

  sortRows(rows, sortBy) {
    const stateWeight = { ACTIVA: 3, BORRADOR: 2, PAUSADA: 1, CERRADA: 0 };
    
    rows.sort((a, b) => {
      const da = a.dataset;
      const db = b.dataset;
      
      switch (sortBy) {
        case 'apps':
          return Number(db.apps) - Number(da.apps); // Descendente
        case 'fecha':
          return Number(da.publishedDays) - Number(db.publishedDays); // Recientes primero
        case 'estado':
          return (stateWeight[db.state] ?? -1) - (stateWeight[da.state] ?? -1); // ACTIVA primero
        default:
          return 0;
      }
    });

    // Reordenar en el DOM
    rows.forEach(tr => this.tbody.appendChild(tr));
  }

  updateResultsCounter(visible, total) {
    const counter = document.querySelector('.results-counter');
    if (counter) {
      counter.textContent = `Mostrando ${visible} de ${total} vacantes`;
    }
  }

  removeAccents(str) {
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  viewCandidates(position, data) {
    console.log('Ver candidatos para:', position, data);
    // Aquí puedes implementar la navegación a la vista de candidatos
    // Por ejemplo: window.location.href = `candidatos.html?vacante=${encodeURIComponent(position)}`;
    alert(`Ver candidatos de: ${position}\nAplicaciones: ${data.apps}`);
  }

  editJob(position, data) {
    console.log('Editar vacante:', position, data);
    // Aquí puedes implementar la navegación al editor de vacantes
    // Por ejemplo: window.location.href = `editar-vacante.html?id=${data.id}`;
    alert(`Editar vacante: ${position}\nEstado: ${data.state}`);
  }

  // Método público para refrescar filtros
  refresh() {
    this.applyFilters();
  }

  // Método público para limpiar filtros
  clearFilters() {
    Object.values(this.controls).forEach(control => {
      if (control) {
        control.value = '';
      }
    });
    this.applyFilters();
  }
}

// Inicializar cuando se carga la vista de vacantes
function initVacantesManager() {
  if (window.vacantesManager) {
    // Si ya existe una instancia, no crear otra
    return;
  }
  
  window.vacantesManager = new VacantesManager();
  window.vacantesManager.init();
}

// Auto-inicializar si estamos en la vista de vacantes
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para asegurar que el contenido dinámico se haya cargado
    setTimeout(initVacantesManager, 100);
  });
} else {
  setTimeout(initVacantesManager, 100);
}

// Exportar para uso externo
window.VacantesManager = VacantesManager;
window.initVacantesManager = initVacantesManager;