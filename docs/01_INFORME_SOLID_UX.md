# Informe de Principios SOLID y Buenas Prácticas de Experiencia de Usuario (UX)
**Caso de Estudio:** Distribuidora Comercial «Moto Repuestos El Centenario»  
**Asignatura:** Ingeniería de Software 1 — DACTIC, Universidad Nacional de Ingeniería (UNI)  
**Equipo Responsable:** Ángel A. Alonso (2021-0087U), Noel I. Alemán, Mendell N. Parrales  
**Docente:** Ing. Roberto Alfaro  
**Fecha:** 29 de septiembre de 2026  
**Líneas Base Rectoras:** `DA-MREC-001 v1.0` (Monolito modular en capas) y `DD-MREC-001 v1.0` (Documentación de diseño)

---

## 1. Introducción y Propósito
El diseño y construcción del sistema modular de **«Moto Repuestos El Centenario»** sigue una arquitectura limpia orientada al dominio y desacoplada en capas: Dominio, Aplicación, Infraestructura e Interfaces.

Este informe documenta formalmente la aplicación de los **5 Principios SOLID** en la arquitectura del código fuente y los **6 Criterios Esenciales de UX** implementados en las pantallas del punto de venta (POS) y administración comercial.

---

## 2. Aplicación de los Principios SOLID

### 2.1. Tabla Formal de Evidencia SOLID
| Principio SOLID | Archivo / Módulo / Clase | Cómo se aplicó en el sistema | Justificación Arquitectónica |
| :--- | :--- | :--- | :--- |
| **S** — Responsabilidad Única (*Single Responsibility Principle*) | `src/modules/ventas/VentaService.js` vs `FacturaRepository.js` vs `CalculadorImpuestos.js` | Se separó la orquestación del flujo transaccional de venta de la persistencia SQL en PostgreSQL y de la lógica matemática de cálculo fiscal/descuentos. | Cada clase tiene una sola razón para cambiar: cambios en reglas tributarias modifican solo `CalculadorImpuestos`; cambios en la estructura de almacenamiento afectan solo a `FacturaRepository`. |
| **O** — Abierto / Cerrado (*Open/Closed Principle*) | `src/modules/pagos/MedioPagoHandler.js` (Efectivo, Transferencia, Tarjeta, Crédito) | Se diseñó una interfaz base abstracta `MedioPagoProcessor` y se implementaron clases especializadas por medio de pago. Para soportar un nuevo canal (ej. Billetera Móvil o Débito), se agrega una nueva clase sin modificar el motor de caja. | El núcleo de facturación permanece cerrado a modificaciones pero abierto a extensión mediante polimorfismo. |
| **L** — Sustitución de Liskov (*Liskov Substitution Principle*) | `src/modules/inventario/PostgreSqlInventarioRepository.js` e `InMemoryInventarioRepository.js` | Ambas clases derivan y cumplen el contrato formal `IInventarioRepository`. En las suites de pruebas automatizadas o en modo offline de contingencia, se sustituye la persistencia física sin que el servicio de ventas note diferencias de comportamiento. | Las clases derivadas honran invariantes y postcondiciones del contrato base sin generar excepciones inesperadas ni efectos secundarios. |
| **I** — Segregación de Interfaces (*Interface Segregation Principle*) | `src/interfaces/IVentaReader.js` e `IVentaWriter.js` | En lugar de una interfaz masiva con 25 métodos de lectura y escritura, el módulo de Reportería consume únicamente `IVentaReader` (solo lectura), mientras que el módulo POS consume `IVentaWriter`. | Los clientes del sistema no se ven forzados a depender de métodos transaccionales o mutaciones de estado que jamás van a invocar. |
| **D** — Inversión de Dependencias (*Dependency Inversion Principle*) | `src/modules/ventas/VentaService.js` (Inyección de dependencias por constructor) | `VentaService` no instancia directamente `new PostgreSqlDatabase()` ni servicios concretos de auditoría; recibe abstracciones (`IVentaRepository`, `IStockManager`, `IAuditoriaLogger`) a través de su constructor. | El módulo de alto nivel (lógica de negocio de la distribuidora) no depende de implementaciones de bajo nivel (librerías de base de datos o drivers), sino de contratos estables. |

---

## 3. Aplicación de Criterios de Experiencia de Usuario (UX)

### 3.1. Tabla Formal de Evidencia UX
| Criterio UX | Pantalla / Componente del Sistema | Cómo se aplicó | Justificación en el Entorno Comercial |
| :--- | :--- | :--- | :--- |
| **Claridad** | Pantalla principal de Venta POS (`/pos/caja`) | Se eliminaron códigos internos o jerga técnica de base de datos en pantalla. Se presentan etiquetas directas: *Repuesto*, *Compatibilidad con Moto*, *Stock Disponible*, *Precio Final en Córdobas (C$)*. | Los cajeros atienden con rapidez a clientes de mostrador y requieren información inmediata y comprensible sin ambigüedad. |
| **Feedback Inmediato** | Barra de estado de transacción y modales de confirmación | Cada acción del operario (escaneo de código de barras, cálculo de vuelto, verificación de existencias) emite un indicador visual claro (verde = éxito, amarillo = stock bajo, rojo = error o bloqueo). | El cajero siempre conoce el estado de la transacción y evita reintentos duplicados que causarían doble facturación. |
| **Consistencia** | Sistema de diseño unificado (Design System Web) | La misma paleta de colores (naranja comercial para acciones primarias, azul oscuro para encabezados), idénticos atajos de teclado (`F2` buscar, `F4` cobrar, `ESC` cancelar) y tipografía estandarizada en todas las vistas. | Reduce la curva de aprendizaje del personal y previene errores por desorientación visual entre turnos. |
| **Prevención de Errores** | Flujo de anulación de factura y control de sobregiro de stock | La anulación de una factura confirmada requiere autorización explícita de un Administrador con contraseña y motivo justificado. El sistema impide físicamente digitar cantidades mayores a las existencias reales en bodega. | Cumple la regla de negocio `RN-06` y `RN-08`; evita mermas económicas y diferencias en el cuadre de caja al cierre del turno. |
| **Accesibilidad** | Interfaz adaptativa con contraste cromático WCAG AA | Tamaños de fuente legibles a 1 metro de distancia, contraste superior a 4.5:1 en todos los textos, soporte total de navegación por teclado sin depender exclusivamente del ratón. | Diseñado específicamente para pantallas táctiles de mostrador expuestas a reflejos de luz y operadores con jornadas continuas. |
| **Diseño Responsivo** | Terminales POS (15.6" táctil) y Estación Móvil de Bodega (Tablet / Portátil) | La distribución de elementos se reorganiza fluidamente según el espacio disponible sin perder las acciones prioritarias de escaneo y consulta de inventario. | Permite que el bodeguero consulte compatibilidades y registre conteos cíclicos directamente en los pasillos del almacén. |
