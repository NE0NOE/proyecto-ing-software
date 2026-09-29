/**
 * ==============================================================================
 * MOTOR INTERACTIVO DE PRESENTACIÓN TÉCNICA - BLUEPRINT
 * Moto Repuestos El Centenario | UNI - DACTIC
 * Sin temporizador • 100% Offline • 9 Slides + Anexos
 * ==============================================================================
 */

// Notas de orador ajustadas a 10-15 minutos (~90 a 100 segundos por slide)
const SPEAKER_NOTES_BP = {
  1: `<strong>Slide 1: Portada Técnica (1 min)</strong>
      <ul>
        <li>Saludar al jurado y al docente titular Ing. Roberto Alfaro.</li>
        <li>Presentar al equipo: Br. Ángel Antonio Alonso Suárez (2021-0087U), Noel I. Alemán y Mendell N. Parrales.</li>
        <li>Presentar el objetivo: Defender las 6 líneas base técnicas del sistema de inventario y facturación transaccional de «Moto Repuestos El Centenario» en Managua.</li>
      </ul>`,
  2: `<strong>Slide 2: Historia de la Empresa (1.5 min)</strong>
      <ul>
        <li>Explicar el crecimiento comercial: la empresa inició como un negocio familiar de venta de repuestos y creció hasta tener 4 cajas de mostrador y bodega central.</li>
        <li>Señalar los marcadores <code>[COMPLETAR]</code>: corresponden a las fechas fundacionales y detalles de ubicación que la empresa está por confirmar formalmente.</li>
        <li>Conclusión clave: La empresa creció físicamente pero mantuvo métodos de registro en papel, provocando una brecha operativa insostenible.</li>
      </ul>`,
  3: `<strong>Slide 3: El Problema que Resolvemos (1.5 min)</strong>
      <ul>
        <li>Exponer los 4 puntos de dolor del Doc 01 con datos duros:
          (1) Desfase crítico entre bodega y mostrador;
          (2) Lentitud al buscar compatibilidad para motos como Pulsar o Genesis;
          (3) Errores en precios y márgenes;
          (4) Sobreventa concurrente del último repuesto en existencia.</li>
        <li>Conclusión: El registro manual provocaba pérdidas económicas reales y requería automatización estricta.</li>
      </ul>`,
  4: `<strong>Slide 4: Levantamiento de Requerimientos (1.5 min)</strong>
      <ul>
        <li>Marco de ingeniería: ISO/IEC/IEEE 29148:2011 e ISO 12207.</li>
        <li>Mostrar la cuadrícula de los 12 RF organizados en 4 módulos. (Hacer clic en los botones para mostrar interacción).</li>
        <li>Enfatizar las 15 Reglas de Negocio (abrir modal con botón) y el <strong>RNF-02</strong>: la venta en mostrador no depende de Internet.</li>
      </ul>`,
  5: `<strong>Slide 5: Arquitectura de Software (1.5 min)</strong>
      <ul>
        <li>Mostrar el gráfico de barras comparativo: Monolito Clásico (68) vs Monolito Modular (91) vs Microservicios (52).</li>
        <li>Decisión justificada: El Monolito Modular Web ofrece integridad transaccional ACID pura en PostgreSQL sin la complejidad de red de microservicios.</li>
        <li>Mencionar el alineamiento con las 5 vistas de ISO/IEC/IEEE 42010.</li>
      </ul>`,
  6: `<strong>Slide 6: Capas y Flujo de Venta POS (2 min)</strong>
      <ul>
        <li>Demostrar la interactividad: avanzar paso a paso por los 5 estados de la venta transaccional.</li>
        <li>Presionar el botón <strong>«Simular fallo y ver Rollback»</strong> para demostrar la robustez transaccional: si el stock se agota o hay un corte de red, la operación se cancela en rojo y el stock se repone intacto.</li>
      </ul>`,
  7: `<strong>Slide 7: Metodología de Desarrollo (1 min)</strong>
      <ul>
        <li>Metodología: Scrum adaptado en 3 sprints de 2 semanas con control formal de líneas base (SWEBOK V4).</li>
        <li>Sprint 1: Dominio y Catálogo; Sprint 2: Ventas POS y Kardex; Sprint 3: Compras, Devoluciones y Auditoría.</li>
        <li>Cualquier cambio a los requisitos o arquitectura exige solicitud formal de cambio.</li>
      </ul>`,
  8: `<strong>Slide 8: Modelo y Diseño del Sistema (2 min)</strong>
      <ul>
        <li>Demostrar los diagramas UML 2.5.1 selectivo haciendo clic en las pestañas:
          (1) Casos de uso de los 4 actores;
          (2) Clases centrales del dominio comercial;
          (3) Secuencia temporal con try/catch;
          (4) Máquina de estados de Factura y Caja.</li>
        <li>Resaltar que son diagramas vectoriales técnicos, no texto plano.</li>
      </ul>`,
  9: `<strong>Slide 9: Conclusiones y Cierre (1 min)</strong>
      <ul>
        <li>Sintetizar la entrega: 6 líneas base alineadas, probadas y documentadas.</li>
        <li>Mencionar que en los <strong>Anexos (Tecla A)</strong> están disponibles los informes de Seguridad ISO 27001, SOLID/UX, Pruebas automatizadas (6/6 aprobadas) e Infraestructura Local vs Nube ($4,100 vs $7,060 USD a 3 años).</li>
        <li>Agradecer y abrir espacio a preguntas.</li>
      </ul>`
};

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const progressBar = document.getElementById('bpProgressBarFill');
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

  let currentSlide = 1;
  const totalSlides = slides.length;
  totalSlidesSpan.textContent = String(totalSlides).padStart(2, '0');

  // Generar índice de slides
  slides.forEach((slide, idx) => {
    const slideNum = idx + 1;
    const titleEl = slide.querySelector('.slide-conclusion-title') || slide.querySelector('.cover-main-h1');
    const titleText = titleEl ? titleEl.textContent.trim().replace(/\s+/g, ' ') : `Slide ${slideNum}`;

    const row = document.createElement('div');
    row.className = `index-row-bp ${slideNum === 1 ? 'active' : ''}`;
    row.innerHTML = `
      <span style="font-family:var(--font-mono); color:var(--accent-signal);">${String(slideNum).padStart(2, '0')}</span>
      <span style="flex:1; margin:0 8px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${titleText}</span>
      <span style="font-size:0.7rem; color:var(--paper-dim);">↵</span>
    `;
    row.addEventListener('click', () => {
      goToSlide(slideNum);
      indexDrawer.classList.remove('open');
    });
    indexList.appendChild(row);
  });

  function updateSlideState() {
    slides.forEach((slide, idx) => {
      const slideNum = idx + 1;
      slide.classList.toggle('active', slideNum === currentSlide);
    });

    currentSlideSpan.textContent = String(currentSlide).padStart(2, '0');
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;

    const progress = (currentSlide / totalSlides) * 100;
    progressBar.style.width = `${progress}%`;

    const rows = indexList.querySelectorAll('.index-row-bp');
    rows.forEach((r, idx) => {
      r.classList.toggle('active', idx + 1 === currentSlide);
    });

    notesContent.innerHTML = SPEAKER_NOTES_BP[currentSlide] || '<p>No hay notas para este slide.</p>';
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

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.bp-modal-overlay.open').forEach(m => m.classList.remove('open'));
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
    } else if (e.key.toLowerCase() === 'a') {
      openModal('modalAnexos');
    }
  });

  // ==============================================================================
  // SLIDE 4: INTERACTIVIDAD DE CUADRÍCULA RF
  // ==============================================================================
  const RF_DATA = {
    'RF-01': 'Identidad, autenticación y permisos individuales por rol (Cajero, Bodeguero, Admin, Auditor).',
    'RF-02': 'Catálogo de repuestos con matriz de compatibilidad multimarca de motocicletas y SKU.',
    'RF-03': 'Gestión de compras a proveedores con validación de factura y recepción física en almacén.',
    'RF-04': 'Kardex append-only: movimientos históricos inmutables con saldos en tiempo real.',
    'RF-05': 'Emisión y control de cotizaciones con vigencia máxima de 7 días calendario.',
    'RF-06': 'Facturación transaccional en mostrador en 4 terminales POS concurrentes con cálculo de IVA.',
    'RF-07': 'Devoluciones y garantías con emisión de notas de crédito y peritaje de taller.',
    'RF-08': 'Apertura de turno, control de cobros mixtos y arqueo de caja ciego al cierre.',
    'RF-09': 'Auditoría transaccional con usuario, timestamp, IP y valores previo/posterior.',
    'RF-10': 'Reportería comercial, financiera y de rotación de inventario sin bloquear la base de datos.',
    'RF-11': 'Importación y exportación de listas de precios con adaptadores versionados.',
    'RF-12': 'Tareas programadas de mantenimiento y respaldo diario cifrado AES-256.'
  };

  const rfButtons = document.querySelectorAll('.rf-item-btn');
  const rfDetailBox = document.getElementById('rfDetailBox');

  rfButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      rfButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const rfId = btn.getAttribute('data-rf');
      if (rfDetailBox && RF_DATA[rfId]) {
        rfDetailBox.innerHTML = `<strong>${rfId}:</strong> ${RF_DATA[rfId]}`;
      }
    });
  });

  // ==============================================================================
  // SLIDE 6: INTERACTIVIDAD DEL FLUJO DE VENTA POS
  // ==============================================================================
  let currentStep = 1;
  const maxSteps = 5;
  const flowBoxes = document.querySelectorAll('.flow-step-box');
  const flowStatusBanner = document.getElementById('flowStatusBanner');
  const prevStepBtn = document.getElementById('flowPrevStepBtn');
  const nextStepBtn = document.getElementById('flowNextStepBtn');
  const rollbackBtn = document.getElementById('flowRollbackBtn');

  const STEP_MESSAGES = {
    1: '<strong>Paso 1: Validación de Cajero y Turno.</strong> Se confirma que el usuario tiene rol CAJERO y su turno de mostrador está ABIERTO.',
    2: '<strong>Paso 2: Consulta y Reserva de Stock.</strong> Se valida que la cantidad solicitada existe físicamente en PostgreSQL (RN-08: sin sobregiro).',
    3: '<strong>Paso 3: Recálculo Fiscal en Servidor.</strong> Se aplica IVA del 15% y descuento autorizado (hasta 5% ordinario o Admin).',
    4: '<strong>Paso 4: Procesamiento de Cobro.</strong> Se procesa el medio de pago mediante patrón Strategy (Efectivo, Tarjeta, Transferencia).',
    5: '<strong>Paso 5: Commit Atómico en Servidor.</strong> Se confirman simultáneamente: Factura + Kardex Append-Only + Caja + Log Auditoría. Transacción 100% exitosa.'
  };

  function updateFlowView(isRollback = false) {
    flowBoxes.forEach((box, idx) => {
      const stepNum = idx + 1;
      box.classList.remove('rollback-active');
      box.classList.toggle('active', stepNum <= currentStep);
    });

    if (isRollback) {
      flowBoxes.forEach(b => b.classList.add('rollback-active'));
      flowStatusBanner.classList.add('error');
      flowStatusBanner.innerHTML = `
        <div>
          <span style="color:var(--alert-red); font-family:var(--font-mono); font-weight:bold;">[ROLLBACK AUTOMÁTICO ACTIVADO]</span><br>
          <span style="font-size:0.85rem; color:var(--paper);">Se detectó stock insuficiente o error en el pago. La unidad transaccional revierte la inserción, restaura el inventario y genera un log de auditoría seguro sin efectos colaterales.</span>
        </div>
      `;
    } else {
      flowStatusBanner.classList.remove('error');
      flowStatusBanner.innerHTML = `<div>${STEP_MESSAGES[currentStep]}</div>`;
    }

    prevStepBtn.disabled = currentStep === 1;
    nextStepBtn.disabled = currentStep === maxSteps;
  }

  if (nextStepBtn && prevStepBtn && rollbackBtn) {
    nextStepBtn.addEventListener('click', () => {
      if (currentStep < maxSteps) {
        currentStep++;
        updateFlowView();
      }
    });

    prevStepBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateFlowView();
      }
    });

    rollbackBtn.addEventListener('click', () => {
      updateFlowView(true);
    });
  }

  // ==============================================================================
  // SLIDE 8: PESTAÑAS DE DIAGRAMAS UML
  // ==============================================================================
  const umlTabs = document.querySelectorAll('.uml-tab-btn');
  const umlCanvases = document.querySelectorAll('.uml-diagram-canvas');

  umlTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      umlTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-uml');
      umlCanvases.forEach(canvas => {
        canvas.classList.toggle('active', canvas.id === targetId);
      });
    });
  });

  // ==============================================================================
  // MODALES TÉCNICOS
  // ==============================================================================
  window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
  };

  window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
  };

  document.querySelectorAll('.bp-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  // Inicializar
  updateSlideState();
  if (flowStatusBanner) updateFlowView();
});
