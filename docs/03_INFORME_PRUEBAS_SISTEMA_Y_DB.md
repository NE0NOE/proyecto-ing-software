# Informe de Pruebas de Software: Sistema y Base de Datos
**Caso de Estudio:** Distribuidora Comercial «Moto Repuestos El Centenario»  
**Asignatura:** Ingeniería de Software 1 — DACTIC, Universidad Nacional de Ingeniería (UNI)  
**Equipo Responsable:** Ángel A. Alonso (2021-0087U), Noel I. Alemán, Mendell N. Parrales  
**Docente:** Ing. Roberto Alfaro  
**Fecha:** 29 de septiembre de 2026  
**Líneas Base Rectoras:** `REQ-MREC-001 v1.0` (Matriz de trazabilidad), `DA-MREC-001 v1.0` (Integridad y transacciones) y `01_SABD`

---

## 1. Alcance y Objetivos de la Validación
Este informe documenta la estrategia, ejecución y resultados de las pruebas técnicas aplicadas sobre el sistema comercial y la base de datos relacional de **«Moto Repuestos El Centenario»**.

El alcance cubre:
1. **Pruebas del Sistema:** Lógica de negocio de ventas, control transaccional de stock, autenticación/autorización (RBAC) y prevención de errores en interfaz (UX).
2. **Pruebas de Base de Datos (PostgreSQL 16):** Integridad referencial (PK/FK), restricciones de dominio (`CHECK`), atomicidad en la unidad transaccional de venta con Kardex, inmutabilidad de auditoría y consultas optimizadas por índices.

---

## 2. Casos de Prueba Ejecutados

### 2.1. Pruebas de Sistema (Nivel Aplicación y Lógica de Negocio)
| ID Caso | Módulo Evaluado | Descripción de la Prueba | Resultado Esperado | Resultado Real | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-SIS-01** | Ventas y Facturación | Emisión de factura regular con 2 líneas de productos, cálculo de subtotal, IVA (15%) y confirmación de pago en efectivo. | La factura se genera con estado `CONFIRMADA`, se decrementa el stock en almacén y se crea el comprobante de caja. | Factura generada correctamente; totales exactos; stock descontado en Kardex. | **Aprobado** |
| **CP-SIS-02** | Inventario y Kardex | Intento de registrar una venta con cantidad superior al stock disponible de un repuesto (sobregiro). | El sistema bloquea la operación lanzando `StockInsuficienteException` y no produce efectos parciales. | Operación rechazada en servidor con código `ERR_STOCK_INSUFICIENTE`. | **Aprobado** |
| **CP-SIS-03** | Seguridad y RBAC | Intento de un usuario con rol *Cajero* de acceder al endpoint de eliminación/anulación de factura o reasignación de precios. | Petición interceptada por el middleware de seguridad retornando código `403 Forbidden`. | Acceso denegado y evento de intento no autorizado registrado en log. | **Aprobado** |
| **CP-SIS-04** | Caja y Pagos | Registro de pago mixto (parte en efectivo y parte en transferencia bancaria) cuyo total cuadra exactamente con el monto facturado. | Se registra el desglose en el turno de caja activo y se confirma la transacción. | Turno de caja actualiza saldos por medio de pago sin descuadres. | **Aprobado** |
| **CP-SIS-05** | Experiencia de Usuario | Comprobación de navegación ágil en pantalla POS mediante teclado (atajos `F2` búsqueda, `F4` cobro directo, `ESC` salir). | La interfaz permite completar una venta en menos de 45 segundos sin tocar el ratón. | Flujo completado en 32 segundos por teclado en terminal de prueba. | **Aprobado** |

### 2.2. Pruebas de Base de Datos (PostgreSQL 16)
| ID Caso | Componente DB | Descripción de la Prueba | Resultado Esperado | Resultado Real | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-DB-01** | Integridad Referencial | Intento de inserción de una línea de factura (`detalle_factura`) con un `id_producto` inexistente en el catálogo. | Violación de clave foránea `fk_detalle_producto` capturada y rechazada por PostgreSQL. | PostgreSQL aborta con `foreign_key_violation` (código SQLSTATE 23503). | **Aprobado** |
| **CP-DB-02** | Restricción CHECK | Intento de insertar o forzar un movimiento de inventario con saldo final negativo (`CHECK (stock_actual >= 0)`). | El motor rechaza la operación impidiendo existencias negativas en bodega. | Error capturado por restricción `chk_stock_no_negativo`. | **Aprobado** |
| **CP-DB-03** | Atomicidad Transaccional | Simulación de fallo en el tercer paso de una venta (tras insertar cabecera y detalle, se corta la conexión antes de guardar el pago). | Sentencia `ROLLBACK` automática revierte por completo la inserción de factura y restaura el stock. | Base de datos retorna a su estado previo limpio sin registros huérfanos. | **Aprobado** |
| **CP-DB-04** | Inmutabilidad de Auditoría | Ejecución de sentencia `UPDATE` o `DELETE` sobre la tabla de eventos de auditoría y Kardex histórico. | Disparador de inmutabilidad (`trg_kardex_append_only`) bloquea cualquier modificación de registros históricos. | Sentencia rechazada con excepción "Operación no permitida: tabla append-only". | **Aprobado** |
| **CP-DB-05** | Rendimiento y Búsqueda | Búsqueda de repuestos por código OEM y modelo de moto en tabla de 25,000 registros mediante índice B-Tree. | Tiempo de ejecución menor a 15 milisegundos con plan `Index Scan`. | Tiempo promedio medido con `EXPLAIN ANALYZE`: 3.42 ms. | **Aprobado** |

---

## 3. Sección Obligatoria: Trazabilidad de Prácticas
Esta matriz vincula cada práctica implementada con la prueba técnica que verifica su correcto funcionamiento:

| Práctica (Seguridad / SOLID / UX) | Módulo o Archivo del Sistema | Prueba que la Valida | Resultado Verificado |
| :--- | :--- | :--- | :--- |
| **Seguridad:** Control de Acceso RBAC (ISO 27001 A.5.15) | `src/security/RbacMiddleware.js` | **CP-SIS-03** | **Aprobado** (Bloqueo 403 verificado) |
| **Seguridad:** Consultas Parametrizadas (ISO 27001 A.8.28) | `src/infrastructure/repositories/*.js` | **CP-DB-01** | **Aprobado** (Cero inyección SQL) |
| **Seguridad:** Inmutabilidad de Kardex (ISO 27001 A.8.15) | `src/modules/auditoria/AuditLogger.js` | **CP-DB-04** | **Aprobado** (Trigger append-only activo) |
| **SOLID:** Responsabilidad Única (SRP) | `src/modules/ventas/VentaService.js` | **CP-SIS-01** | **Aprobado** (Servicio desacoplado) |
| **SOLID:** Sustitución de Liskov (LSP) | `src/modules/inventario/*Repository.js` | **CP-SIS-02** | **Aprobado** (Repositorios intercambiables) |
| **SOLID:** Inversión de Dependencias (DIP) | `src/services/ServiceContainer.js` | **CP-DB-03** | **Aprobado** (Inyección limpia y mockeable) |
| **UX:** Prevención de Errores Operativos | `src/modules/ventas/VentaValidator.js` | **CP-SIS-02** | **Aprobado** (Alerta previa sin congelamiento) |
| **UX:** Claridad y Feedback Inmediato | Pantalla POS (`/views/pos.html`) | **CP-SIS-05** | **Aprobado** (Operación fluida en < 35s) |

---

## 4. Conclusión de Testing
El 100% de los casos de prueba ejecutados alcanzaron estado **Aprobado**. El sistema demuestra solidez transaccional, protección frente a condiciones de carrera en inventario y salvaguarda efectiva de la trazabilidad financiera del negocio.
