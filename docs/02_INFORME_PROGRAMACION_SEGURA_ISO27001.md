# Informe de Programación Segura Alineada con ISO/IEC 27001
**Caso de Estudio:** Distribuidora Comercial «Moto Repuestos El Centenario»  
**Asignatura:** Ingeniería de Software 1 — DACTIC, Universidad Nacional de Ingeniería (UNI)  
**Equipo Responsable:** Ángel A. Alonso (2021-0087U), Noel I. Alemán, Mendell N. Parrales  
**Docente:** Ing. Roberto Alfaro  
**Fecha:** 29 de septiembre de 2026  
**Líneas Base Rectoras:** `REQ-MREC-001 v1.0` (Requisitos no funcionales RNF-05, RNF-06) y `DA-MREC-001 v1.0` (Vista V-04 Procesos y Seguridad)

---

## 1. Alcance y Marco de Referencia
El desarrollo del software para la Distribuidora Comercial «Moto Repuestos El Centenario» está **alineado con las buenas prácticas de la norma internacional ISO/IEC 27001 (específicamente los controles del Anexo A sobre desarrollo y codificación segura)** y el estándar de la industria **OWASP Top 10**.

El objetivo es garantizar la confidencialidad, integridad y disponibilidad de la información financiera, existencias de inventario, transacciones de venta y datos de clientes y colaboradores.

---

## 2. Prácticas Seguras Aplicadas

### 2.1. Tabla Formal de Evidencia de Seguridad
| Práctica de Seguridad | Archivo / Módulo del Sistema | Cómo se aplicó en el código | Control ISO/IEC 27001 Relacionado |
| :--- | :--- | :--- | :--- |
| **Validación y Saneamiento Estricto en Servidor** | `src/security/InputValidator.js` | Todos los payloads de venta, cotización y compras pasan por validación tipada con esquemas restrictivos en backend. Se rechazan cadenas no permitidas, longitudes anómalas o valores numéricos negativos. | **A.8.28 Codificación segura** |
| **Prevención de Inyección SQL mediante Consultas Parametrizadas** | `src/infrastructure/repositories/*.js` | Se utiliza el cliente parametrizado de PostgreSQL (`$1, $2, ...`) y capas de abstracción seguras. Está terminantemente prohibida la concatenación manual de cadenas SQL. | **A.8.28 Codificación segura** (Mitigación OWASP A03: Injection) |
| **Cero Secretos y Credenciales en Código o Repositorio** | `.gitignore`, `config/environment.js` | Las credenciales de base de datos, llaves de firma JWT y secretos de cifrado se cargan exclusivamente desde variables de entorno locales protegidas, nunca committeadas al repositorio público. | **A.8.24 Uso de criptografía** y **A.5.15 Control de acceso** |
| **Control de Acceso Basado en Roles (RBAC) y Mínimo Privilegio** | `src/security/RbacMiddleware.js` | Se definieron 4 roles estrictos: *Cajero*, *Bodeguero*, *Administrador* y *Auditor*. Los permisos son revalidados en cada petición en el servidor, no solo en la visibilidad de botones del cliente web. | **A.5.15 Control de acceso** y **A.5.18 Derechos de acceso de privilegios** |
| **Almacenamiento Criptográfico Seguro de Contraseñas** | `src/security/PasswordHasher.js` | Las contraseñas de los usuarios nunca se almacenan en texto claro. Se utiliza el algoritmo **Argon2id / bcrypt** con sal aleatoria criptográfica y un factor de costo mínimo de 12 iteraciones. | **A.8.24 Uso de criptografía** |
| **Manejo Seguro de Errores sin Exposición de Trazas** | `src/middleware/ErrorHandler.js` | Ante excepciones o fallos en base de datos, el sistema retorna un código de error de negocio genérico y seguro al frontend. Las trazas completas (*stacktraces*) se registran únicamente en un log interno protegido. | **A.8.26 Arquitectura y principios de ingeniería de seguridad** |
| **Auditoría Transaccional e Historial Inmutable (Kardex Append-Only)** | `src/modules/auditoria/AuditLogger.js` | Cada evento sensible (apertura de caja, descuento especial, anulación de factura, modificación de precios) genera un registro inmutable con usuario, timestamp, IP y estado previo/posterior. | **A.8.15 Registro de eventos (Logging)** |
| **Cifrado de Comunicaciones en Tránsito (HTTPS/TLS)** | Configuración de servidor web local | Todo el tráfico entre las terminales POS, bodegas y el servidor central en LAN viaja cifrado bajo protocolo **TLS 1.3** con certificados locales dedicados. | **A.8.24 Uso de criptografía** (Datos en tránsito) |

---

## 3. Matriz de Mitigación frente a OWASP Top 10

| Riesgo OWASP Top 10 | Nivel de Riesgo para la Distribuidora | Mecanismo de Defensa Implementado |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | **Crítico:** Cajeros otorgando descuentos no autorizados o anulando facturas. | Validación obligatoria en servidor de permisos atómicos; requerimiento de clave de administrador para anulaciones. |
| **A02: Cryptographic Failures** | Alto: Filtración de credenciales de operarios o clientes. | Cifrado en reposo para datos sensibles y contraseñas hasheadas con bcrypt/argon2 con salt. |
| **A03: Injection (SQL/Command)** | **Crítico:** Manipulación indebida de tablas de inventario o precios. | Consultas 100% parametrizadas a nivel de motor PostgreSQL. |
| **A05: Security Misconfiguration** | Medio: Mensajes de error con rutas de directorios o versiones de software. | Modo producción activado por defecto, deshabilitación de banners de servidor e interfaces de debug. |
| **A09: Security Logging & Monitoring Failures** | Alto: Falta de evidencia ante faltantes de caja o inventario. | Tabla de auditoría particionada con disparadores que impiden sentencias `UPDATE` y `DELETE` sobre registros de log. |

---

## 4. Declaración de Cumplimiento
El código y la arquitectura de «Moto Repuestos El Centenario» están diseñados y verificados **alineados con las buenas prácticas de la norma ISO/IEC 27001**. Las restricciones se implementan directamente en la capa transaccional del backend para asegurar que la integridad del negocio no dependa exclusivamente de la interfaz gráfica.
