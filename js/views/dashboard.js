// Dashboard View JavaScript
(function() {
  'use strict';

  // Funciones específicas del dashboard
  function initDashboard() {
    console.log('Dashboard initialized');
    
    // Aquí puedes agregar funcionalidad específica del dashboard
    initKPIAnimations();
    initActivityRefresh();
    initVacancyCards();
  }

  function initKPIAnimations() {
    // Animar los números de los KPIs
    const kpiNumbers = document.querySelectorAll('.text-4xl.font-semibold, .text-3xl.font-bold');
    
    kpiNumbers.forEach(element => {
      const finalValue = parseInt(element.textContent);
      if (!isNaN(finalValue)) {
        animateNumber(element, 0, finalValue, 1000);
      }
    });
  }

  function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.floor(start + (end - start) * progress);
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  function initActivityRefresh() {
    // Simular actualización de actividad reciente cada 30 segundos
    setInterval(() => {
      updateActivityTimestamps();
    }, 30000);
  }

  function updateActivityTimestamps() {
    const timestamps = document.querySelectorAll('.text-xs.text-slate-400');
    timestamps.forEach(timestamp => {
      if (timestamp.textContent.includes('hace')) {
        // Simular actualización de tiempo
        const currentText = timestamp.textContent;
        if (currentText.includes('minutos')) {
          const minutes = parseInt(currentText.match(/\d+/)[0]) + 1;
          timestamp.textContent = `hace ${minutes} minutos`;
        }
      }
    });
  }

  function initVacancyCards() {
    // Agregar interactividad a las cards de vacantes
    const vacancyCards = document.querySelectorAll('.shadow-card.p-5.relative');
    
    vacancyCards.forEach(card => {
      card.addEventListener('click', function() {
        const title = this.querySelector('.text-base.font-semibold')?.textContent;
        if (title) {
          console.log(`Clicked on vacancy: ${title}`);
          // Aquí podrías navegar a la vista de detalles de la vacante
          // window.mainLayoutApp.loadView('vacante-detalle', true);
        }
      });

      // Agregar efecto hover
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.transition = 'transform 0.2s ease';
      });

      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
  }

  // Función de limpieza cuando se cambia de vista
  function destroyDashboard() {
    console.log('Dashboard destroyed');
    // Limpiar intervalos, event listeners, etc.
  }

  // Inicializar cuando se carga la vista
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }

  // Exportar funciones para uso externo si es necesario
  window.dashboardView = {
    init: initDashboard,
    destroy: destroyDashboard
  };

})();