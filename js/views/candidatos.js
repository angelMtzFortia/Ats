// ===== CANDIDATOS VIEW SCRIPT =====
console.log('🎯 Candidatos script loaded');

document.addEventListener('DOMContentLoaded', function() {
  // Esperar un poco para asegurar que el DOM esté completamente cargado
  setTimeout(() => {
    initCandidatesView();
  }, 100);
});

function initCandidatesView() {
  console.log('🎯 Inicializando vista de candidatos...');
  
  // Elementos del DOM
  const searchInput = document.getElementById('candidateSearch');
  const vacancyFilter = document.getElementById('vacancyFilter');
  const statusFilter = document.getElementById('statusFilter');
  const sortFilter = document.getElementById('sortFilter');
  const tableBody = document.getElementById('candidatesTableBody');
  
  // Verificar que los elementos existen
  if (!searchInput || !vacancyFilter || !statusFilter || !sortFilter || !tableBody) {
    console.log('⚠️ Algunos elementos de candidatos no se encontraron, reintentando...');
    setTimeout(initCandidatesView, 500);
    return;
  }

  console.log('✅ Elementos de candidatos encontrados, configurando filtros...');

  // Event listeners para filtros
  searchInput.addEventListener('input', debounce(filterCandidates, 300));
  vacancyFilter.addEventListener('change', filterCandidates);
  statusFilter.addEventListener('change', filterCandidates);
  sortFilter.addEventListener('change', filterCandidates);

  // Event listeners para acciones de candidatos
  tableBody.addEventListener('click', handleCandidateAction);

  // Aplicar filtros iniciales
  filterCandidates();

  console.log('🎯 Vista de candidatos inicializada correctamente');
}

function filterCandidates() {
  console.log('🔍 Aplicando filtros de candidatos...');
  
  const searchTerm = document.getElementById('candidateSearch')?.value.toLowerCase() || '';
  const vacancyFilter = document.getElementById('vacancyFilter')?.value || '';
  const statusFilter = document.getElementById('statusFilter')?.value || '';
  const sortBy = document.getElementById('sortFilter')?.value || '';
  
  const tableBody = document.getElementById('candidatesTableBody');
  if (!tableBody) return;

  const rows = Array.from(tableBody.querySelectorAll('tr[data-name]'));
  let visibleRows = [];

  // Aplicar filtros
  rows.forEach(row => {
    const data = row.dataset;
    const name = (data.name || '').toLowerCase();
    const email = (data.email || '').toLowerCase();
    const vacancy = data.vacancy || '';
    const status = data.status || '';

    // Filtro de búsqueda (nombre o email)
    const matchesSearch = !searchTerm || 
      name.includes(searchTerm) || 
      email.includes(searchTerm);

    // Filtro de vacante
    const matchesVacancy = !vacancyFilter || vacancy === vacancyFilter;

    // Filtro de estado
    const matchesStatus = !statusFilter || status === statusFilter;

    // Mostrar u ocultar fila
    const shouldShow = matchesSearch && matchesVacancy && matchesStatus;
    
    if (shouldShow) {
      row.style.display = '';
      visibleRows.push(row);
    } else {
      row.style.display = 'none';
    }
  });

  // Aplicar ordenamiento
  if (sortBy && visibleRows.length > 0) {
    sortCandidates(visibleRows, sortBy);
  }

  // Mostrar mensaje si no hay resultados
  showNoResultsMessage(visibleRows.length === 0);

  console.log(`🔍 Filtros aplicados: ${visibleRows.length} candidatos visibles`);
}

function sortCandidates(rows, sortBy) {
  console.log(`📊 Ordenando candidatos por: ${sortBy}`);
  
  const statusOrder = {
    'Nuevo': 1,
    'En revisión': 2,
    'Entrevista': 3,
    'Oferta': 4,
    'Contratado': 5,
    'Rechazado': 6
  };

  rows.sort((a, b) => {
    const dataA = a.dataset;
    const dataB = b.dataset;

    switch (sortBy) {
      case 'name':
        return (dataA.name || '').localeCompare(dataB.name || '');
      
      case 'match':
        return Number(dataB.match || 0) - Number(dataA.match || 0);
      
      case 'date':
        const dateA = new Date(dataA.date || 0);
        const dateB = new Date(dataB.date || 0);
        return dateB - dateA; // Más reciente primero
      
      case 'status':
        const orderA = statusOrder[dataA.status] || 999;
        const orderB = statusOrder[dataB.status] || 999;
        return orderA - orderB;
      
      default:
        return 0;
    }
  });

  // Reordenar en el DOM
  const tableBody = document.getElementById('candidatesTableBody');
  rows.forEach(row => {
    tableBody.appendChild(row);
  });
}

function showNoResultsMessage(show) {
  const tableBody = document.getElementById('candidatesTableBody');
  if (!tableBody) return;

  // Remover mensaje existente
  const existingMessage = tableBody.querySelector('.no-results-row');
  if (existingMessage) {
    existingMessage.remove();
  }

  if (show) {
    const noResultsRow = document.createElement('tr');
    noResultsRow.className = 'no-results-row';
    noResultsRow.innerHTML = `
      <td colspan="6" class="py-8 px-4 text-center text-slate-500 dark:text-slate-400">
        <div class="flex flex-col items-center gap-2">
          <span class="text-2xl">🔍</span>
          <p class="font-medium">No se encontraron candidatos</p>
          <p class="text-sm">Intenta ajustar los filtros de búsqueda</p>
        </div>
      </td>
    `;
    tableBody.appendChild(noResultsRow);
  }
}

function handleCandidateAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  const row = button.closest('tr');
  const candidateName = row?.dataset.name || 'Candidato';
  const candidateEmail = row?.dataset.email || '';

  console.log(`🎯 Acción: ${action} para ${candidateName}`);

  switch (action) {
    case 'view':
      showCandidateProfile(row);
      break;
    case 'interview':
      scheduleInterview(row);
      break;
    case 'reject':
      rejectCandidate(row);
      break;
    case 'offer':
      showOffer(row);
      break;
    case 'contract':
      showContract(row);
      break;
    default:
      console.log(`Acción no reconocida: ${action}`);
  }
}

function showCandidateProfile(row) {
  const data = row.dataset;
  showModal('Perfil del Candidato', `
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
          ${getInitials(data.name)}
        </div>
        <div>
          <h3 class="text-xl font-semibold text-slate-800 dark:text-slate-200">${data.name}</h3>
          <p class="text-slate-600 dark:text-slate-400">${data.email}</p>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vacante</label>
          <p class="text-slate-800 dark:text-slate-200">${data.vacancy}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
          <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">${data.status}</span>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Match</label>
          <div class="flex items-center gap-2">
            <div class="w-20 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
              <div class="bg-green-500 dark:bg-green-400 h-2 rounded-full" style="width: ${data.match}%"></div>
            </div>
            <span class="text-sm font-medium text-green-600 dark:text-green-400">${data.match}%</span>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fecha de aplicación</label>
          <p class="text-slate-800 dark:text-slate-200">${formatDate(data.date)}</p>
        </div>
      </div>
      
      <div class="flex gap-2 pt-4">
        <button class="bg-fortia-primary text-white px-4 py-2 rounded-lg hover:bg-fortia-primary/90 transition-colors">
          📄 Ver CV completo
        </button>
        <button class="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
          📧 Enviar mensaje
        </button>
      </div>
    </div>
  `);
}

function scheduleInterview(row) {
  const data = row.dataset;
  showModal('Programar Entrevista', `
    <div class="space-y-4">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
          ${getInitials(data.name)}
        </div>
        <div>
          <h3 class="font-semibold text-slate-800 dark:text-slate-200">${data.name}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">${data.vacancy}</p>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fecha</label>
          <input type="date" class="w-full rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-2 text-sm focus:border-fortia-primary">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hora</label>
          <input type="time" class="w-full rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-2 text-sm focus:border-fortia-primary">
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tipo de entrevista</label>
        <select class="w-full rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-2 text-sm focus:border-fortia-primary">
          <option>Entrevista técnica</option>
          <option>Entrevista de recursos humanos</option>
          <option>Entrevista con el equipo</option>
          <option>Entrevista final</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notas adicionales</label>
        <textarea rows="3" class="w-full rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-2 text-sm focus:border-fortia-primary" placeholder="Información adicional sobre la entrevista..."></textarea>
      </div>
      
      <div class="flex gap-2 pt-4">
        <button class="bg-fortia-primary text-white px-4 py-2 rounded-lg hover:bg-fortia-primary/90 transition-colors" onclick="closeModal()">
          📅 Programar entrevista
        </button>
        <button class="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" onclick="closeModal()">
          Cancelar
        </button>
      </div>
    </div>
  `);
}

function rejectCandidate(row) {
  const data = row.dataset;
  if (confirm(`¿Estás seguro de que quieres rechazar a ${data.name}?`)) {
    // Actualizar el estado en la fila
    const statusBadge = row.querySelector('td:nth-child(3) span');
    if (statusBadge) {
      statusBadge.className = 'px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs rounded-full';
      statusBadge.textContent = 'Rechazado';
      row.dataset.status = 'Rechazado';
    }
    
    showNotification(`${data.name} ha sido rechazado`, 'info');
    
    // Reaplicar filtros
    setTimeout(filterCandidates, 100);
  }
}

function showOffer(row) {
  const data = row.dataset;
  showModal('Ver Oferta', `
    <div class="space-y-4">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold">
          ${getInitials(data.name)}
        </div>
        <div>
          <h3 class="font-semibold text-slate-800 dark:text-slate-200">${data.name}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">${data.vacancy}</p>
        </div>
      </div>
      
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h4 class="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">📋 Detalles de la Oferta</h4>
        <div class="space-y-2 text-sm">
          <p><strong>Posición:</strong> ${data.vacancy}</p>
          <p><strong>Salario:</strong> $85,000 - $95,000 USD</p>
          <p><strong>Modalidad:</strong> Híbrido</p>
          <p><strong>Fecha límite:</strong> 30 de enero, 2024</p>
        </div>
      </div>
      
      <div class="flex gap-2 pt-4">
        <button class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors" onclick="closeModal()">
          ✅ Marcar como aceptada
        </button>
        <button class="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" onclick="closeModal()">
          📧 Enviar recordatorio
        </button>
      </div>
    </div>
  `);
}

function showContract(row) {
  const data = row.dataset;
  showModal('Contrato', `
    <div class="space-y-4">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
          ${getInitials(data.name)}
        </div>
        <div>
          <h3 class="font-semibold text-slate-800 dark:text-slate-200">${data.name}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">${data.vacancy}</p>
        </div>
      </div>
      
      <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Contrato Firmado</h4>
        <div class="space-y-2 text-sm">
          <p><strong>Fecha de inicio:</strong> 1 de febrero, 2024</p>
          <p><strong>Tipo de contrato:</strong> Tiempo completo</p>
          <p><strong>Salario:</strong> $90,000 USD anuales</p>
          <p><strong>Estado:</strong> Activo</p>
        </div>
      </div>
      
      <div class="flex gap-2 pt-4">
        <button class="bg-fortia-primary text-white px-4 py-2 rounded-lg hover:bg-fortia-primary/90 transition-colors" onclick="closeModal()">
          📄 Ver contrato completo
        </button>
        <button class="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" onclick="closeModal()">
          📧 Enviar bienvenida
        </button>
      </div>
    </div>
  `);
}

// Funciones auxiliares
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

function getInitials(name) {
  if (!name) return '??';
  return name.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function formatDate(dateString) {
  if (!dateString) return 'Fecha no disponible';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'hace 1 día';
  if (diffDays < 7) return `hace ${diffDays} días`;
  
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function showModal(title, content) {
  // Crear modal si no existe
  let modal = document.getElementById('candidateModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'candidateModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 id="modalTitle" class="text-xl font-semibold text-slate-800 dark:text-slate-200"></h2>
            <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div id="modalContent"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Actualizar contenido
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalContent').innerHTML = content;
  
  // Mostrar modal
  modal.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('candidateModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 
    'bg-blue-500'
  }`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

console.log('🎯 Candidatos script completamente cargado');