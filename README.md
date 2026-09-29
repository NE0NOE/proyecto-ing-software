# Sistema Integral de Control de Inventario y Facturación Transaccional
### Caso de Estudio: Distribuidora Comercial «Moto Repuestos El Centenario»

**Universidad Nacional de Ingeniería (UNI) — DACTIC**  
**Asignatura:** Ingeniería de Software 1  
**Docente Titular:** Ing. Roberto Alfaro  
**Equipo Responsable:**
- **Br. Ángel Antonio Alonso Suárez** (Carnet: `2021-0087U`)
- **Noel I. Alemán**
- **Mendell N. Parrales**

**Fecha de Entrega:** Martes, 29 de Septiembre de 2026 / Managua, Nicaragua  
**Líneas Base Rectoras:** `REQ-MREC-001 v1.0`, `DA-MREC-001 v1.0`, `MET-MREC-001 v1.0`, `LM-MREC-001 v1.0`, `DD-MREC-001 v1.0` y `01_SABD`.

---

## 🎯 Descripción General
Este repositorio alberga la implementación de referencia, la **Presentación Interactiva en HTML** y los **4 Informes Técnicos de Ingeniería** desarrollados para la distribuidora de repuestos de motocicletas **«Moto Repuestos El Centenario»**.

El sistema soluciona el descontrol en inventarios y las discrepancias de stock entre bodega y mostrador mediante una arquitectura de **Monolito Modular Web** con persistencia relacional en **PostgreSQL 16**, diseñada para operar de forma autónoma en red local (LAN) con soporte para 4 estaciones de cobro (POS) simultáneas sin dependencia crítica de Internet.

---

## 🖥️ Presentación Interactiva en HTML (Defensa del Proyecto)
La presentación para la defensa ante el jurado y docente fue construida en **HTML5, CSS moderno (Stitch UI) y Vanilla JavaScript**, eliminando la necesidad de herramientas tradicionales como PowerPoint.

### Características Principales:
* **12 Diapositivas Técnicas:** Cubren en profundidad los 6 documentos de la línea base, principios SOLID, seguridad ISO 27001, testing e infraestructura.
* **Diagrama Interactivo de Capas:** Explora las responsabilidades de Presentación, Aplicación, Dominio e Infraestructura en tiempo real.
* **Notas del Orador Integradas (Tecla `N`):** Despliega un panel inferior con los puntos clave y tiempos sugeridos para una defensa de **10 a 15 minutos**.
* **Temporizador de 15 Minutos:** Cronómetro integrado en la barra superior para controlar el tiempo de exposición.
* **Navegación Ágil por Teclado:**
  * `←` / `→` o `Espacio`: Avanzar y retroceder diapositivas.
  * `F`: Modo Pantalla Completa.
  * `N`: Abrir / Cerrar Notas del Orador.
  * `M`: Abrir / Cerrar Índice de Diapositivas.
  * `ESC`: Cerrar cualquier ventana modal activa.
* **Ventanas Modales Detalladas:**
  * Resumen de los 6 documentos técnicos PDF.
  * Catálogo de las 15 Reglas de Negocio (`RN-01` a `RN-15`).
  * Desglose financiero y técnico Local (On-Premise) vs Nube (AWS).
  * Matriz de trazabilidad de pruebas automatizadas.

### Cómo ejecutar la presentación:
Basta con abrir el archivo [index.html](file:///c:/Users/Elder/Desktop/proyectos/trabajo%20ing%20sofware/ing%20s/index.html) en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Firefox, Brave). No requiere servidores ni dependencias externas.

---

## 📚 Informes Técnicos de Ingeniería (Carpeta `docs/`)

1. **[01. Informe de Principios SOLID y Buenas Prácticas de UX](file:///c:/Users/Elder/Desktop/proyectos/trabajo%20ing%20sofware/ing%20s/docs/01_INFORME_SOLID_UX.md):**
   * Documentación formal de la aplicación de los 5 principios SOLID en las clases del sistema (`SRP`, `OCP`, `LSP`, `ISP`, `DIP`).
   * Aplicación de los 6 criterios UX (Claridad, Feedback Inmediato, Consistencia, Prevención de Errores, Accesibilidad WCAG AA y Diseño Responsivo) en terminales táctiles POS de 15.6".

2. **[02. Informe de Programación Segura Alineada con ISO/IEC 27001](file:///c:/Users/Elder/Desktop/proyectos/trabajo%20ing%20sofware/ing%20s/docs/02_INFORME_PROGRAMACION_SEGURA_ISO27001.md):**
   * Tabla formal de prácticas de desarrollo seguro y controles del Anexo A de ISO 27001 (`A.8.28 Codificación segura`, `A.5.15 Control de acceso`, `A.8.24 Criptografía`, `A.8.15 Logging inmutable`).
   * Mitigación verificada frente al OWASP Top 10 (Inyección SQL con consultas parametrizadas, RBAC en servidor y hashing de contraseñas con sal).

3. **[03. Informe de Pruebas de Software: Sistema y Base de Datos](file:///c:/Users/Elder/Desktop/proyectos/trabajo%20ing%20sofware/ing%20s/docs/03_INFORME_PRUEBAS_SISTEMA_Y_DB.md):**
   * Resultados reales de la suite de pruebas automatizadas (100% aprobadas).
   * Verificación de integridad referencial, restricción CHECK de stock no negativo y atomicidad transaccional con Rollback compensatorio ante caídas.

4. **[04. Informe de Infraestructura y Red: Local On-Premise vs Nube AWS](file:///c:/Users/Elder/Desktop/proyectos/trabajo%20ing%20sofware/ing%20s/docs/04_INFORME_INFRAESTRUCTURA_LOCAL_VS_NUBE.md):**
   * Dimensionamiento de hardware físico: Servidor Intel Xeon / i7 (32 GB RAM, 2x 1TB SSD RAID-1) con **Ubuntu Server 24.04 LTS** y **PostgreSQL 16**, 4 estaciones POS, switch Gigabit y UPS 1500VA.
   * Análisis comparativo TCO a 3 años ($3,800 USD local vs $7,000+ USD en AWS) demostrando la viabilidad de la solución On-Premise y su inmunidad ante caídas de proveedores de Internet.

---

## 🧪 Pruebas Automatizadas del Sistema
El proyecto cuenta con una suite de pruebas construida con el runner nativo de Node.js (`node:test` y `node:assert/strict`), sin requerir librerías externas:

```bash
# Ejecutar la suite completa de pruebas
npm test
```

### Resultados de la última ejecución:
```text
▶ Suite de Pruebas: Moto Repuestos El Centenario
  ▶ Pruebas de Seguridad ISO/IEC 27001 y RBAC
    ✔ CP-SIS-03: RbacMiddleware permite acceso al Cajero pero deniega anulación
    ✔ InputValidator rechaza inyección/overflow y datos maliciosos
  ▶ Pruebas de Principios SOLID
    ✔ SOLID - SRP: CalculadorImpuestos calcula exactamente IVA 15%
    ✔ SOLID - OCP: PaymentFactory procesa diferentes medios por estrategia
    ✔ SOLID - LSP & DIP: VentaService orquesta con repositorio desacoplado
  ▶ Pruebas de Transaccionalidad y Rollback (Resiliencia de Base de Datos)
    ✔ CP-SIS-02 & CP-DB-03: Sobregiro detiene la venta y ejecuta ROLLBACK compensatorio
✔ Suite de Pruebas: 6 aprobadas, 0 fallidas (146 ms)
```

---

## 📁 Estructura del Repositorio
```text
├── css/
│   └── presentation.css           # Estilos Stitch UI, animaciones y glassmorphism
├── docs/                          # Informes técnicos formales
│   ├── 01_INFORME_SOLID_UX.md
│   ├── 02_INFORME_PROGRAMACION_SEGURA_ISO27001.md
│   ├── 03_INFORME_PRUEBAS_SISTEMA_Y_DB.md
│   └── 04_INFORME_INFRAESTRUCTURA_LOCAL_VS_NUBE.md
├── js/
│   └── presentation.js            # Lógica interactiva, atajos de teclado y modales
├── src/
│   ├── modules/                   # Módulos desacoplados (ventas, pagos, inventario)
│   └── security/                  # RBAC, InputValidator y AuditLogger (ISO 27001)
├── test/
│   └── system-and-db.test.js      # Suite automatizada de pruebas de sistema y DB
├── index.html                     # Presentación interactiva lista para exposición
├── package.json                   # Configuración del proyecto y scripts
└── .gitignore                     # Exclusión de confidencial, secretos y dependencias
```

*Nota de Seguridad:* La carpeta local `confidential/` está excluida permanentemente de Git mediante [.gitignore](file:///c:/Users/Elder/Desktop/proyectos/trabajo%20ing%20sofware/ing%20s/.gitignore) para resguardar los documentos fuente originales.
