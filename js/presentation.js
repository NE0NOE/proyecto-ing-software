/**
 * ==============================================================================
 * MOTOR INTERACTIVO DE PRESENTACIÓN - MOTO REPUESTOS EL CENTENARIO
 * Soporte de teclado, modo orador, temporizador de 15 min, modales y navegación
 * ==============================================================================
 */

// Notas de orador por diapositiva (Pensadas para una defensa fluida de 10 a 15 minutos)
const SPEAKER_NOTES = {
  1: `<strong>Diapositiva 1: Portada Oficial (Tiempo: 1 min)</strong>
      <ul>
        <li>Saludar al jurado y docente Ing. Roberto Alfaro.</li>
        <li>Presentar al equipo responsable (Ángel Alonso, Noel Alemán, Mendell Parrales).</li>
        <li>Establecer el alcance: Defensa integral de las 6 líneas base técnicas del sistema comercial «Moto Repuestos El Centenario» integrando arquitectura, seguridad ISO 27001, SOLID, UX, testing e infraestructura.</li>
      </ul>`,
  2: `<strong>Diapositiva 2: Doc 01 - Contexto y Problemática (Tiempo: 1.5 min)</strong>
      <ul>
        <li>Enfatizar la realidad comercial en Managua: alto volumen de repuestos, pero inventario manual/desfasado.</li>
        <li>Problema clave: Diferencias de existencias entre bodega y mostrador; ventas perdidas o cobros con precios erróneos.</li>
        <li>Objetivo: Crear un backend relacional transaccional robusto que garantice stock verídico y control de 4 cajas simultáneas.</li>
      </ul>`,
  3: `<strong>Diapositiva 3: Doc 02 - Requisitos StRS, SyRS y SRS (Tiempo: 1.5 min)</strong>
      <ul>
        <li>Resaltar el cumplimiento de estándares formales: ISO/IEC/IEEE 29148 y 12207.</li>
        <li>Mencionar que el sistema cuenta con 12 Requisitos Funcionales (RF-01 a RF-12) y 15 Reglas de Negocio inquebrantables.</li>
        <li>Destacar el RNF-02: <strong>Continuidad local obligatoria</strong>; la facturación no depende del enlace a Internet.</li>
      </ul>`,
  4: `<strong>Diapositiva 4: Doc 03 - Arquitectura y Selección Justificada (Tiempo: 1.5 min)</strong>
      <ul>
        <li>Explicar el análisis de alternativas: se comparó Monolito Tradicional, Monolito Modular y Microservicios.</li>
        <li>Justificar por qué ganó el <strong>Monolito Modular</strong>: máxima integridad transaccional ACID, bajo costo operativo y sin la complejidad de red de microservicios.</li>
        <li>Mencionar las 5 vistas ISO 42010 (Contexto, Capas, Información, Procesos y Despliegue).</li>
      </ul>`,
  5: `<strong>Diapositiva 5: Diagrama de Arquitectura y Transacción POS (Tiempo: 1.5 min)</strong>
      <ul>
        <li>Invitar a hacer clic en las capas del diagrama interactivo.</li>
        <li>Explicar el flujo transaccional de venta: bloqueo optimista/pesimista de stock, recalculo en servidor, comprobante y commit atómico.</li>
        <li>Aclarar que si un paso falla (ej. caída de corriente o error de pago), el sistema ejecuta un rollback íntegro sin dejar inconsistencias.</li>
      </ul>`,
  6: `<strong>Diapositiva 6: Doc 04 - Metodología de Desarrollo (Tiempo: 1 min)</strong>
      <ul>
        <li>Marco rector: SWEBOK V4 e ISO 12207.</li>
        <li>Metodología: Scrum adaptado con iteraciones de 2 semanas.</li>
        <li>Aclarar la adaptación: agilidad en la construcción de pantallas y flujos, pero con control riguroso y formal de versiones sobre las líneas base de requisitos y arquitectura.</li>
      </ul>`,
  7: `<strong>Diapositiva 7: Doc 05 y 06 - Modelado y Diseño UML (Tiempo: 1 min)</strong>
      <ul>
        <li>Justificar la elección de UML 2.5.1 selectivo sobre otras notaciones.</li>
        <li>Detallar los modelos construidos: Casos de uso divididos por roles (Cajero, Bodeguero, Admin, Auditor), Clases de dominio y Máquina de estados para Facturas y Turnos de Caja.</li>
      </ul>`,
  8: `<strong>Diapositiva 8: Seguridad ISO/IEC 27001 y OWASP (Tiempo: 1.5 min)</strong>
      <ul>
        <li>Explicar que la seguridad no es un añadido, sino parte del diseño (Security by Design).</li>
        <li>Mencionar los controles aplicados: Consultas 100% parametrizadas contra Inyección SQL, Control de Acceso RBAC en backend y almacenamiento seguro con Argon2id/bcrypt con sal.</li>
        <li>Resaltar la inmutabilidad de la auditoría: los registros históricos no se pueden modificar ni borrar.</li>
      </ul>`,
  9: `<strong>Diapositiva 9: Principios SOLID y Buenas Prácticas UX (Tiempo: 1.5 min)</strong>
      <ul>
        <li>Presentar cómo se reflejan los 5 principios SOLID en las clases reales del repositorio (SRP, OCP, LSP, ISP, DIP).</li>
        <li>Explicar el criterio de UX en punto de venta: interfaz táctil clara, atajos de teclado para atención rápida y prevención activa de errores humanos en mostrador.</li>
      </ul>`,
  10: `<strong>Diapositiva 10: Estrategia y Pruebas Automatizadas (Tiempo: 1 min)</strong>
      <ul>
        <li>Mostrar con orgullo el 100% de éxito en la suite automatizada (6 pruebas unitarias e integrales en Node.js test runner).</li>
        <li>Mencionar que se validó tanto la lógica del sistema como las restricciones de PostgreSQL (integridad referencial y atomicidad de rollback).</li>
      </ul>`,
  11: `<strong>Diapositiva 11: Infraestructura y Red: Local vs Nube (Tiempo: 1.5 min)</strong>
      <ul>
        <li>Contrastar el Servidor Local en Ubuntu Server con PostgreSQL frente a AWS.</li>
        <li>Demostrar con cifras el ahorro a 3 años ($3,200 USD local vs más de $6,000 USD en AWS).</li>
        <li>Conclusión clave: La latencia sub-milisegundo y la independencia de fallas de Internet hacen a la opción local la ganadora indiscutible.</li>
      </ul>`,
  12: `<strong>Diapositiva 12: Conclusiones y Próximos Pasos (Tiempo: 1 min)</strong>
      <ul>
        <li>Sintetizar el impacto: Sistema integral diseñado para transformar la rentabilidad y control de Moto Repuestos El Centenario.</li>
        <li>Agradecer al jurado y abrir el espacio para preguntas y respuestas.</li>
      </ul>`
};

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const progressBar = document.getElementById('progressBarFill');
  const currentSlideSpan = document.getElementById('currentSlideNum');
  const totalSlidesSpan = document.getElementById('totalSlidesNum');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  
  const notesDrawer = document.getElementById('speakerNotesDrawer');
  const notesContent = document.getElementById('notesContentBody');
  const toggleNotesBtn = document.getElementById('toggleNotesBtn');
  const closeNotesBtn = document.getElementById('closeNotesBtn');

  const indexDrawer = document.getElementById('indexDrawer');
  const toggleIndexBtn = document.getElementById('toggleIndexBtn');
  const closeIndexBtn = document.getElementById('closeIndexBtn');
  const indexList = document.getElementById('indexList');

  const fullscreenBtn = document.getElementById('fullscreenBtn');

  // Temporizador de defensa
  const timerDisplay = document.getElementById('timerDisplay');
  const toggleTimerBtn = document.getElementById('toggleTimerBtn');
  const resetTimerBtn = document.getElementById('resetTimerBtn');

  let currentSlide = 1;
  const totalSlides = slides.length;
  totalSlidesSpan.textContent = String(totalSlides).padStart(2, '0');

  // Inicializar índice
  slides.forEach((slide, idx) => {
    const slideNum = idx + 1;
    const titleEl = slide.querySelector('.slide-title') || slide.querySelector('.cover-title');
    const titleText = titleEl ? titleEl.textContent.trim().replace(/\s+/g, ' ') : `Diapositiva ${slideNum}`;

    const item = document.createElement('div');
    item.className = `index-item ${slideNum === 1 ? 'active' : ''}`;
    item.innerHTML = `
      <span class="index-item-number">${String(slideNum).padStart(2, '0')}</span>
      <span class="index-item-title">${titleText}</span>
      <span style="font-size:0.75rem; color:var(--text-muted);">↵</span>
    `;
    item.addEventListener('click', () => {
      goToSlide(slideNum);
      indexDrawer.classList.remove('open');
    });
    indexList.appendChild(item);
  });

  function updateSlideState() {
    slides.forEach((slide, idx) => {
      const slideNum = idx + 1;
      slide.classList.toggle('active', slideNum === currentSlide);
    });

    // Actualizar botones y contadores
    currentSlideSpan.textContent = String(currentSlide).padStart(2, '0');
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;

    // Actualizar barra de progreso
    const progressPercent = (currentSlide / totalSlides) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Actualizar índice activo
    const indexItems = indexList.querySelectorAll('.index-item');
    indexItems.forEach((item, idx) => {
      item.classList.toggle('active', idx + 1 === currentSlide);
    });

    // Actualizar notas de orador
    notesContent.innerHTML = SPEAKER_NOTES[currentSlide] || '<p>No hay notas adicionales para esta diapositiva.</p>';
  }

  function goToSlide(index) {
    if (index >= 1 && index <= totalSlides) {
      currentSlide = index;
      updateSlideState();
    }
  }

  function nextSlide() {
    if (currentSlide < totalSlides) {
      currentSlide++;
      updateSlideState();
    }
  }

  function prevSlide() {
    if (currentSlide > 1) {
      currentSlide--;
      updateSlideState();
    }
  }

  // Event Listeners de Botones
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  toggleNotesBtn.addEventListener('click', () => {
    notesDrawer.classList.toggle('open');
    toggleNotesBtn.classList.toggle('active', notesDrawer.classList.contains('open'));
  });

  closeNotesBtn.addEventListener('click', () => {
    notesDrawer.classList.remove('open');
    toggleNotesBtn.classList.remove('active');
  });

  toggleIndexBtn.addEventListener('click', () => {
    indexDrawer.classList.toggle('open');
  });

  closeIndexBtn.addEventListener('click', () => {
    indexDrawer.classList.remove('open');
  });

  // Pantalla completa
  fullscreenBtn.addEventListener('click', toggleFullScreen);

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Navegación por teclado
  document.addEventListener('keydown', (e) => {
    // Si un modal está abierto y se presiona ESC, cerrarlo
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
      notesDrawer.classList.remove('open');
      indexDrawer.classList.remove('open');
      toggleNotesBtn.classList.remove('active');
      return;
    }

    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(1);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToSlide(totalSlides);
    } else if (e.key.toLowerCase() === 'f') {
      toggleFullScreen();
    } else if (e.key.toLowerCase() === 'n') {
      notesDrawer.classList.toggle('open');
      toggleNotesBtn.classList.toggle('active', notesDrawer.classList.contains('open'));
    } else if (e.key.toLowerCase() === 'm') {
      indexDrawer.classList.toggle('open');
    }
  });

  // ==============================================================================
  // TEMPORIZADOR DE EXPOSICIÓN (15:00 MINUTOS COUNTDOWN)
  // ==============================================================================
  let timerSeconds = 15 * 60; // 15 minutos en segundos
  let timerInterval = null;
  let isTimerRunning = false;

  function renderTimer() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (timerSeconds <= 120 && timerSeconds > 0) {
      timerDisplay.style.color = 'var(--accent-orange)';
    } else if (timerSeconds === 0) {
      timerDisplay.style.color = '#ef4444';
    } else {
      timerDisplay.style.color = 'var(--accent-cyan-light)';
    }
  }

  toggleTimerBtn.addEventListener('click', () => {
    if (isTimerRunning) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      toggleTimerBtn.innerHTML = '<i class="ph ph-play"></i>';
    } else {
      isTimerRunning = true;
      toggleTimerBtn.innerHTML = '<i class="ph ph-pause"></i>';
      timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
          timerSeconds--;
          renderTimer();
        } else {
          clearInterval(timerInterval);
          isTimerRunning = false;
          toggleTimerBtn.innerHTML = '<i class="ph ph-play"></i>';
        }
      }, 1000);
    }
  });

  resetTimerBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerSeconds = 15 * 60;
    renderTimer();
    toggleTimerBtn.innerHTML = '<i class="ph ph-play"></i>';
  });

  // ==============================================================================
  // CAPAS DEL DIAGRAMA INTERACTIVO (SLIDE 5)
  // ==============================================================================
  const diagramLayers = document.querySelectorAll('.diagram-layer');
  const layerDetailBox = document.getElementById('diagramLayerDetailText');

  const LAYER_DESCRIPTIONS = {
    'presentacion': '<strong>Capa de Presentación Web (POS & Administración):</strong> Construida con HTML5 moderno, CSS responsivo y componentes accesibles WCAG AA. Gestiona la captura de transacciones en terminales táctiles de mostrador con atajos de teclado para agilizar la atención a menos de 45 segundos.',
    'aplicacion': '<strong>Capa de Aplicación y Casos de Uso:</strong> Orquesta los flujos comerciales (VentaService, InventarioService, FacturacionService). Aplica el Principio de Responsabilidad Única (SRP) y no depende de implementaciones de infraestructura concretas (DIP).',
    'dominio': '<strong>Capa de Dominio y Reglas de Negocio:</strong> Contiene las entidades puras (Producto, Factura, TurnoCaja) y valida las 15 Reglas de Negocio (RN-01 a RN-15). Aplica el patrón Strategy para medios de pago (OCP) y cálculo tributario de IVA (15%).',
    'persistencia': '<strong>Capa de Infraestructura y Base de Datos (PostgreSQL 16):</strong> Persistencia relacional ACID. Disparadores append-only para auditoría e historial de Kardex inmutable. Consultas 100% parametrizadas para mitigar inyecciones SQL (ISO 27001 A.8.28).'
  };

  diagramLayers.forEach(layer => {
    layer.addEventListener('click', () => {
      diagramLayers.forEach(l => l.classList.remove('active'));
      layer.classList.add('active');
      const layerKey = layer.getAttribute('data-layer');
      if (layerDetailBox && LAYER_DESCRIPTIONS[layerKey]) {
        layerDetailBox.innerHTML = LAYER_DESCRIPTIONS[layerKey];
      }
    });
  });

  // ==============================================================================
  // MODALES INTERACTIVOS (DEEP-DIVE MODALS)
  // ==============================================================================
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
    }
  };

  // Cerrar haciendo clic en el backdrop
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });
  });

  // Iniciar estado inicial
  updateSlideState();
  renderTimer();
});
