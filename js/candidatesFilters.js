// Filtros y funcionalidad para la vista de Candidatos
class CandidatesManager {
  constructor() {
    this.tbody = null;
    this.noRow = null;
    this.controls = {};
    this.debounceTimer = null;
    this.allRows = [];
  }

  init() {
    this.waitForElements(() => {
      this.setupElements();
      this.setupFilters();
      this.setupActions();
      this.cacheRows();
      this.applyFilters(); // Aplicar filtros iniciales
    });
  }

  waitForElements(callback, maxAttempts = 50) {
    let attempts = 0;
    const checkElements = () => {
      const tbody = document.getElementById('candidatesTableBody');
      const noRow = document.getElementById('noResultsRow');
      
      if (tbody && noRow) {
        callback();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkElements, 100);
      } else {
        console.warn('CandidatesManager: No se pudieron encontrar los elementos necesarios');
      }
    };
    checkElements();
  }

  setupElements() {
    this.tbody = document.getElementById('candidatesTableBody');
    this.noRow = document.getElementById('noResultsRow');
    
    this.controls = {
      search: document.getElementById('candidateSearch'),
      vacancy: document.getElementById('vacancyFilter'),
      status: document.getElementById('statusFilter'),
      sort: document.getElementById('sortFilter'),
    };

    if (!this.tbody || !this.noRow) {
      console.warn('CandidatesManager: Elementos tbody o noRow no encontrados');
      return false;
    }
    return true;
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
    ['vacancy', 'status', 'sort'].forEach(key => {
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

      const tr = btn.closest('tr[data-name]');
      if (!tr) return;

      const candidateName = tr.dataset.name || 'Candidato';
      const candidateData = tr.dataset;
      const action = btn.dataset.action;

      switch (action) {
        case 'view':
          this.viewProfile(candidateName, candidateData);
          break;
        case 'interview':
          this.scheduleInterview(candidateName, candidateData);
          break;
        case 'reject':
          this.rejectCandidate(candidateName, candidateData);
          break;
        case 'contract':
          this.viewContract(candidateName, candidateData);
          break;
        case 'offer':
          this.viewOffer(candidateName, candidateData);
          break;
        case 'feedback':
          this.viewFeedback(candidateName, candidateData);
          break;
        default:
          console.log('Acción no reconocida:', action);
      }
    });
  }

  cacheRows() {
    if (!this.tbody) return;
    this.allRows = [...this.tbody.querySelectorAll('tr[data-name]')];
  }

  applyFilters() {
    if (!this.tbody || !this.noRow) return;

    const searchTerm = this.removeAccents(this.controls.search?.value || '');
    const vacancyFilter = this.controls.vacancy?.value || '';
    const statusFilter = this.controls.status?.value || '';
    const sortBy = this.controls.sort?.value || '';

    const visible = [];

    // Filtrar filas
    this.allRows.forEach(tr => {
      const data = tr.dataset;
      let show = true;

      // Filtro de búsqueda (nombre y email)
      if (searchTerm) {
        const searchText = this.removeAccents(`${data.name} ${data.email}`);
        show = searchText.includes(searchTerm);
      }

      // Filtro por vacante
      if (show && vacancyFilter) {
        show = data.vacancy === vacancyFilter;
      }

      // Filtro por estado
      if (show && statusFilter) {
        show = data.status === statusFilter;
      }

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

    // Actualizar contador
    this.updateResultsCounter(visible.length, this.allRows.length);
  }

  sortRows(rows, sortBy) {
    const statusOrder = {
      'Nuevo': 1,
      'En revisión': 2,
      'Entrevista': 3,
      'Oferta': 4,
      'Contratado': 5,
      'Rechazado': 6
    };
    
    rows.sort((a, b) => {
      const da = a.dataset;
      const db = b.dataset;
      
      switch (sortBy) {
        case 'name':
          return da.name.localeCompare(db.name);
        case 'match':
          return Number(db.match) - Number(da.match); // Descendente
        case 'date':
          return new Date(db.date) - new Date(da.date); // Más recientes primero
        case 'status':
          return (statusOrder[da.status] || 999) - (statusOrder[db.status] || 999);
        default:
          return 0;
      }
    });

    // Reordenar en el DOM
    rows.forEach(tr => this.tbody.appendChild(tr));
  }

  updateResultsCounter(visible, total) {
    const counter = document.getElementById('resultsCounter');
    if (counter) {
      counter.textContent = `Mostrando ${visible} de ${total} candidatos`;
    }
  }

  removeAccents(str) {
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  // Acciones de candidatos
  viewProfile(name, data) {
    console.log('Ver perfil de:', name, data);
    alert(`Ver perfil de: ${name}\nEmail: ${data.email}\nVacante: ${data.vacancy}\nMatch: ${data.match}%`);
  }

  scheduleInterview(name, data) {
    console.log('Programar entrevista con:', name, data);
    alert(`Programar entrevista con: ${name}\nVacante: ${data.vacancy}\nMatch: ${data.match}%`);
  }

  rejectCandidate(name, data) {
    console.log('Rechazar candidato:', name, data);
    if (confirm(`¿Estás seguro de que quieres rechazar a ${name}?`)) {
      alert(`Candidato ${name} ha sido rechazado`);
      // Aquí podrías actualizar el estado en la base de datos
    }
  }

  viewContract(name, data) {
    console.log('Ver contrato de:', name, data);
    alert(`Ver contrato de: ${name}\nEstado: ${data.status}`);
  }

  viewOffer(name, data) {
    console.log('Ver oferta para:', name, data);
    alert(`Ver oferta para: ${name}\nMatch: ${data.match}%`);
  }

  viewFeedback(name, data) {
    console.log('Ver feedback de:', name, data);
    alert(`Ver feedback de: ${name}\nEstado: ${data.status}`);
  }

  // Métodos públicos para control externo
  refresh() {
    this.cacheRows();
    this.applyFilters();
  }

  clearFilters() {
    Object.values(this.controls).forEach(control => {
      if (control) {
        control.value = '';
      }
    });
    this.applyFilters();
  }

  getVisibleCandidates() {
    if (!this.tbody) return [];
    return [...this.tbody.querySelectorAll('tr[data-name]:not(.hidden)')];
  }

  getFilteredCount() {
    return this.getVisibleCandidates().length;
  }

  // Método para agregar nuevo candidato dinámicamente
  addCandidate(candidateData) {
    if (!this.tbody) return;

    const row = this.createCandidateRow(candidateData);
    this.tbody.appendChild(row);
    this.cacheRows();
    this.applyFilters();
  }

  createCandidateRow(data) {
    // Este método podría usarse para crear filas dinámicamente
    // Por ahora es un placeholder
    console.log('Crear nueva fila para candidato:', data);
    return document.createElement('tr');
  }
}

// Función de inicialización global
function initCandidatesManager() {
  if (window.candidatesManager) {
    // Si ya existe una instancia, refrescar en lugar de crear nueva
    window.candidatesManager.refresh();
    return;
  }
  
  window.candidatesManager = new CandidatesManager();
  window.candidatesManager.init();
}

// Auto-inicializar si estamos en la vista de candidatos
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initCandidatesManager, 100);
  });
} else {
  setTimeout(initCandidatesManager, 100);
}

// Exportar para uso externo
window.CandidatesManager = CandidatesManager;
window.initCandidatesManager = initCandidatesManager;