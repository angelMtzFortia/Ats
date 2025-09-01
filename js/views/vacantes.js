// Vacantes View JavaScript
/*
(function() {
  'use strict';

  function initVacantes() {
    console.log('Vacantes view initialized');
    
    initNuevaVacanteButton();
    initVacancyCards();
    initFilters();
  }

  function initNuevaVacanteButton() {
    const nuevaVacanteBtn = document.getElementById('nuevaVacanteBtn');
    if (nuevaVacanteBtn) {
      nuevaVacanteBtn.addEventListener('click', () => {
        window.location.href = 'pages/nueva-vacante.html';
      });
    }
  }

  function initVacancyCards() {
    const vacancyCards = document.querySelectorAll('.shadow-card.p-6');
    
    vacancyCards.forEach(card => {
      // Agregar click handler
      card.addEventListener('click', function(e) {
        // No activar si se hace click en un botón
        if (e.target.tagName === 'BUTTON') return;
        
        const title = this.querySelector('h3')?.textContent;
        if (title) {
          console.log(`Clicked on vacancy: ${title}`);
          // Aquí podrías navegar a la vista de detalles
        }
      });

      // Agregar efecto hover
      card.style.cursor = 'pointer';
    });

    // Manejar botones de acción
    const verCandidatosButtons = document.querySelectorAll('button:contains("Ver Candidatos")');
    verCandidatosButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        // Navegar a la vista de candidatos filtrada por esta vacante
        if (window.mainLayoutApp) {
          window.mainLayoutApp.loadView('candidatos');
        }
      });
    });
  }

  function initFilters() {
    const searchInput = document.querySelector('input[type="search"]');
    const areaSelect = document.querySelector('select:nth-of-type(1)');
    const statusSelect = document.querySelector('select:nth-of-type(2)');

    if (searchInput) {
      searchInput.addEventListener('input', debounce(filterVacancies, 300));
    }

    if (areaSelect) {
      areaSelect.addEventListener('change', filterVacancies);
    }

    if (statusSelect) {
      statusSelect.addEventListener('change', filterVacancies);
    }
  }

  function filterVacancies() {
    const searchTerm = document.querySelector('input[type="search"]')?.value.toLowerCase() || '';
    const selectedArea = document.querySelector('select:nth-of-type(1)')?.value || '';
    const selectedStatus = document.querySelector('select:nth-of-type(2)')?.value || '';

    const vacancyCards = document.querySelectorAll('.shadow-card.p-6');

    vacancyCards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const area = card.querySelector('.text-sm.text-slate-500')?.textContent || '';
      const status = card.querySelector('.px-2.py-1')?.textContent || '';

      const matchesSearch = title.includes(searchTerm);
      const matchesArea = selectedArea === '' || selectedArea === 'Todas las áreas' || area.includes(selectedArea.toUpperCase());
      const matchesStatus = selectedStatus === '' || selectedStatus === 'Todos los estados' || status.includes(selectedStatus);

      if (matchesSearch && matchesArea && matchesStatus) {
        card.style.display = 'block';
        card.classList.remove('hidden');
      } else {
        card.style.display = 'none';
        card.classList.add('hidden');
      }
    });

    // Mostrar mensaje si no hay resultados
    updateNoResultsMessage();
  }

  function updateNoResultsMessage() {
    const visibleCards = document.querySelectorAll('.shadow-card.p-6:not(.hidden)');
    const container = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2.xl\\:grid-cols-3');
    
    let noResultsMessage = document.getElementById('no-results-message');
    
    if (visibleCards.length === 0) {
      if (!noResultsMessage) {
        noResultsMessage = document.createElement('div');
        noResultsMessage.id = 'no-results-message';
        noResultsMessage.className = 'col-span-full text-center py-12';
        noResultsMessage.innerHTML = `
          <div class="text-slate-400 text-6xl mb-4">🔍</div>
          <h3 class="text-lg font-semibold text-slate-600 mb-2">No se encontraron vacantes</h3>
          <p class="text-slate-500">Intenta ajustar los filtros de búsqueda</p>
        `;
        container.appendChild(noResultsMessage);
      }
    } else {
      if (noResultsMessage) {
        noResultsMessage.remove();
      }
    }
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function destroyVacantes() {
    console.log('Vacantes view destroyed');
    // Limpiar event listeners si es necesario
  }

  // Inicializar cuando se carga la vista
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVacantes);
  } else {
    initVacantes();
  }

  // Exportar funciones para uso externo
  window.vacantesView = {
    init: initVacantes,
    destroy: destroyVacantes
  };

})();
*/