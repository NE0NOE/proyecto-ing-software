/**
 * ==============================================================================
 * MOTOR INTERACTIVO DE PRESENTACIÓN - MOTO REPUESTOS EL CENTENARIO
 * Transiciones Fluidas • Sin Notas de Orador ni Cronómetro en Pantalla • 100% Offline
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide-deck-card');
  const progressBar = document.getElementById('presentationProgressBar');
  const currentSlideNum = document.getElementById('currentSlideNum');
  const totalSlidesNum = document.getElementById('totalSlidesNum');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');

  const indexDrawer = document.getElementById('drawerIndexMenu');
  const toggleIndexBtn = document.getElementById('toggleIndexBtn');
  const closeIndexBtn = document.getElementById('closeIndexBtn');
  const indexList = document.getElementById('drawerBodyList');

  const fullscreenBtn = document.getElementById('fullscreenBtn');

  let currentSlide = 1;
  const totalSlides = slides.length;
  totalSlidesNum.textContent = String(totalSlides).padStart(2, '0');

  // Generar índice de navegación
  slides.forEach((slide, idx) => {
    const slideIndex = idx + 1;
    const titleEl = slide.querySelector('.slide-main-title') || slide.querySelector('.cover-h1');
    const titleText = titleEl ? titleEl.textContent.trim().replace(/\s+/g, ' ') : `Diapositiva ${slideIndex}`;

    const row = document.createElement('div');
    row.className = `drawer-item-row ${slideIndex === 1 ? 'active' : ''}`;
    row.innerHTML = `
      <span style="font-family:var(--font-mono); font-weight:700; color:var(--accent-cyan);">${String(slideIndex).padStart(2, '0')}</span>
      <span style="flex:1; margin:0 10px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${titleText}</span>
      <span style="font-size:0.75rem; color:var(--text-dim);">↵</span>
    `;
    row.addEventListener('click', () => {
      goToSlide(slideIndex);
      indexDrawer.classList.remove('open');
    });
    indexList.appendChild(row);
  });

  function updateSlideState(direction = 'next') {
    slides.forEach((slide, idx) => {
      const slideIndex = idx + 1;
      slide.classList.remove('active', 'prev-slide');
      
      if (slideIndex === currentSlide) {
        slide.classList.add('active');
      } else if (slideIndex < currentSlide) {
        slide.classList.add('prev-slide');
      }
    });

    currentSlideNum.textContent = String(currentSlide).padStart(2, '0');
    prevSlideBtn.disabled = currentSlide === 1;
    nextSlideBtn.disabled = currentSlide === totalSlides;

    const progress = (currentSlide / totalSlides) * 100;
    progressBar.style.width = `${progress}%`;

    const rows = indexList.querySelectorAll('.drawer-item-row');
    rows.forEach((r, idx) => {
      r.classList.toggle('active', idx + 1 === currentSlide);
    });
  }

  function goToSlide(index) {
    if (index >= 1 && index <= totalSlides) {
      const direction = index > currentSlide ? 'next' : 'prev';
      currentSlide = index;
      updateSlideState(direction);
    }
  }

  function nextSlide() {
    if (currentSlide < totalSlides) {
      currentSlide++;
      updateSlideState('next');
    }
  }

  function prevSlide() {
    if (currentSlide > 1) {
      currentSlide--;
      updateSlideState('prev');
    }
  }

  prevSlideBtn.addEventListener('click', prevSlide);
  nextSlideBtn.addEventListener('click', nextSlide);

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

  // Atajos de teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modern-modal-overlay.open').forEach(m => m.classList.remove('open'));
      indexDrawer.classList.remove('open');
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
    } else if (e.key.toLowerCase() === 'm') {
      indexDrawer.classList.toggle('open');
    }
  });

  // ==============================================================================
  // INTERACTIVIDAD DE CUADRÍCULA RF (SLIDE 4)
  // ==============================================================================
  const RF_CATALOG = {
    'RF-01': 'Gestión de identidad, sesiones individuales y permisos RBAC por rol en servidor.',
    'RF-02': 'Catálogo de repuestos con matriz de compatibilidad multimarca de motocicletas y SKU único.',
    'RF-03': 'Gestión de compras a proveedores con orden previa y recepción física en bodega.',
    'RF-04': 'Kardex append-only: movimientos inmutables con saldos de existencias en tiempo real.',
    'RF-05': 'Emisión y control de cotizaciones comerciales con vigencia máxima de 7 días.',
    'RF-06': 'Facturación transaccional en mostrador en 4 cajas POS simultáneas con IVA del 15%.',
    'RF-07': 'Devoluciones y garantías con emisión de notas de crédito y peritaje técnico de taller.',
    'RF-08': 'Apertura de turno, cobros mixtos y arqueo ciego obligatorio al cierre de caja.',
    'RF-09': 'Auditoría transaccional con usuario, timestamp, IP y valores previo/posterior.',
    'RF-10': 'Reportería comercial, financiera y rotación de repuestos sin bloquear la base de datos.',
    'RF-11': 'Importación y exportación de listas de precios con adaptadores versionados.',
    'RF-12': 'Tareas automáticas de mantenimiento y respaldo diario cifrado AES-256.'
  };

  const rfButtons = document.querySelectorAll('.rf-clickable-btn');
  const rfDetailBox = document.getElementById('rfInspectorDetail');

  rfButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      rfButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const rfKey = btn.getAttribute('data-rf');
      if (rfDetailBox && RF_CATALOG[rfKey]) {
        rfDetailBox.innerHTML = `<strong>${rfKey}:</strong> ${RF_CATALOG[rfKey]}`;
      }
    });
  });

  // ==============================================================================
  // FLUJO DE VENTA TRANSACCIONAL (SLIDE 6)
  // ==============================================================================
  let currentFlowStep = 1;
  const maxFlowSteps = 5;
  const flowNodes = document.querySelectorAll('.flow-node-step');
  const flowConsole = document.getElementById('flowConsoleBanner');
  const flowPrevBtn = document.getElementById('flowStepPrevBtn');
  const flowNextBtn = document.getElementById('flowStepNextBtn');
  const flowRollbackBtn = document.getElementById('flowSimulateRollbackBtn');

  const FLOW_TEXTS = {
    1: '<strong>Paso 1: Validación de Cajero y Turno.</strong> Se confirma autenticación individual y que la estación POS tiene turno abierto.',
    2: '<strong>Paso 2: Reserva de Existencias en Bodega.</strong> Se verifica que el repuesto cuenta con existencias reales (RN-08: prohibido saldo negativo).',
    3: '<strong>Paso 3: Recálculo Fiscal y Descuentos.</strong> Se calcula IVA (15%) y se verifica límite de descuento en el servidor (hasta 5% ordinario).',
    4: '<strong>Paso 4: Procesamiento de Pago Seguro.</strong> Se ejecuta la estrategia de cobro (Efectivo, Tarjeta o Transferencia bancaria).',
    5: '<strong>Paso 5: Commit Atómico Transaccional.</strong> Se insertan simultáneamente: Factura + Kardex + Caja + Log de Auditoría. Venta confirmada.'
  };

  function renderFlowView(isRollback = false) {
    flowNodes.forEach((node, idx) => {
      const stepIndex = idx + 1;
      node.classList.remove('rollback-state');
      node.classList.toggle('active', stepIndex <= currentFlowStep);
    });

    if (isRollback) {
      flowNodes.forEach(n => n.classList.add('rollback-state'));
      flowConsole.classList.add('rollback-active');
      flowConsole.innerHTML = `
        <div>
          <span style="color:var(--accent-rose); font-family:var(--font-mono); font-weight:bold;">[ROLLBACK AUTOMÁTICO EJECUTADO]</span><br>
          <span style="font-size:0.88rem; color:#fff;">Fallo simulado: Stock agotado en mostrador. La transacción atómica se cancela por completo, restituyendo existencias sin crear registros huérfanos.</span>
        </div>
      `;
    } else {
      flowConsole.classList.remove('rollback-active');
      flowConsole.innerHTML = `<div>${FLOW_TEXTS[currentFlowStep]}</div>`;
    }

    if (flowPrevBtn && flowNextBtn) {
      flowPrevBtn.disabled = currentFlowStep === 1;
      flowNextBtn.disabled = currentFlowStep === maxFlowSteps;
    }
  }

  if (flowNextBtn && flowPrevBtn && flowRollbackBtn) {
    flowNextBtn.addEventListener('click', () => {
      if (currentFlowStep < maxFlowSteps) {
        currentFlowStep++;
        renderFlowView();
      }
    });

    flowPrevBtn.addEventListener('click', () => {
      if (currentFlowStep > 1) {
        currentFlowStep--;
        renderFlowView();
      }
    });

    flowRollbackBtn.addEventListener('click', () => {
      renderFlowView(true);
    });
  }

  // ==============================================================================
  // PESTAÑAS UML (SLIDE 8)
  // ==============================================================================
  const umlTabs = document.querySelectorAll('.uml-pill-btn');
  const umlCanvases = document.querySelectorAll('.uml-svg-sheet');

  umlTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      umlTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-uml');
      umlCanvases.forEach(c => {
        c.classList.toggle('active', c.id === targetId);
      });
    });
  });

  // ==============================================================================
  // MODALES
  // ==============================================================================
  window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
  };

  window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
  };

  document.querySelectorAll('.modern-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  // Inicializar estado inicial
  updateSlideState();
  if (flowConsole) renderFlowView();
});
