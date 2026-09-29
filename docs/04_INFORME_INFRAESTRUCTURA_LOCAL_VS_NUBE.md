# Informe Técnico de Infraestructura y Red: Local vs Nube
**Caso de Estudio:** Distribuidora Comercial «Moto Repuestos El Centenario»  
**Asignatura:** Ingeniería de Software 1 — DACTIC, Universidad Nacional de Ingeniería (UNI)  
**Equipo Responsable:** Ángel A. Alonso (2021-0087U), Noel I. Alemán, Mendell N. Parrales  
**Docente:** Ing. Roberto Alfaro  
**Fecha:** 29 de septiembre de 2026  
**Líneas Base Rectoras:** `REQ-MREC-001 v1.0` (StRS, SyRS, SRS) y `DA-MREC-001 v1.0` (Vista V-05)

---

## 1. Resumen Ejecutivo del Proyecto
La Distribuidora Comercial **«Moto Repuestos El Centenario»** comercializa repuestos y accesorios de motocicletas en Managua, Nicaragua. Actualmente opera bajo un modelo de facturación e inventario con alto volumen de atención en mostrador (4 cajas registradoras concurrentes, bodega y gerencia).

El objetivo de este informe es evaluar y justificar la arquitectura de infraestructura y red física requerida para el despliegue del sistema comercial, contrastando una solución **On-Premise (Servidor Local en LAN protegido por UPS)** frente a una solución en la **Nube Pública (Amazon Web Services - AWS)**, considerando las restricciones de conectividad, costo operativo y criticidad transaccional del negocio.

---

## 2. Especificaciones Técnicas y Dimensionamiento

### 2.1. Datos Técnicos del Entorno Local (On-Premise)
| Recurso / Componente | Especificación Técnica Confirmada | Justificación Técnica |
| :--- | :--- | :--- |
| **Servidor Central** | CPU Intel Xeon E-2336 (6 núcleos / 12 hilos @ 2.9 GHz - 4.8 GHz) o Intel Core i7-14700 | Capacidad para procesar transacciones concurrentes de las 4 cajas POS sin cuellos de botella. |
| **Memoria RAM** | 32 GB DDR4/DDR5 ECC 3200MHz | 12 GB dedicados al buffer cache de PostgreSQL 16, 8 GB para el backend modular y 12 GB para el SO y servicios auxiliares. |
| **Almacenamiento** | 2x 1TB SSD NVMe en RAID-1 (Espejo por hardware) | Alta velocidad de I/O para escrituras de Kardex y tolerancia a fallos ante rotura de un disco. |
| **Sistema Operativo** | Linux Ubuntu Server 24.04 LTS (64-bit) | Estabilidad empresarial, cero costo de licenciamiento de SO, soporte a largo plazo y kernel endurecido. |
| **Motor de Base de Datos** | PostgreSQL 16 (Relacional con extensiones ACID) | Integridad transaccional estricta, aislamiento serializable para control de inventario y soporte para JSONB. |
| **Topología de Red** | Red de Área Local (LAN) Gigabit Ethernet cableada (Cat 6) | Latencia sub-milisegundo (< 1 ms), inmunidad a interferencias de radiofrecuencia en taller/mostrador. |
| **Dispositivo de Red** | Switch Administrable de 16 puertos Gigabit (ej. Cisco CBS250-16T) | Segmentación mediante VLAN para terminales POS, terminales administrativas y red de invitados/cámaras. |
| **Terminales POS (4)** | Equipos POS táctiles All-in-One (Intel Celeron J6412 / Core i3, 8 GB RAM, 128 GB SSD) | Equipos compactos para mostrador con lector de código de barras USB/LAN y gaveta de dinero RJ11. |
| **Impresoras de Tickets** | 4x Impresoras Térmicas EPSON TM-T20III (Ethernet / USB) | Emisión rápida de comprobantes de venta térmica de 80mm conforme al flujo de caja POS. |
| **Estaciones Bodega/Admin** | 2x PCs de escritorio estándar con escáner óptico Honeywell Voyager | Ingreso de compras, conteo cíclico de inventario físico y reportería gerencial. |
| **Protección Eléctrica** | UPS Online Smart-UPS 1500VA LCD (APC) con regulación AVR | Suministro continuo por 45-60 min ante fluctuaciones de la red eléctrica nacional nicaragüense. |

### 2.2. Dimensionamiento de Carga y Usuarios
* **Usuarios Concurrentes:** 4 cajeros simultáneos en mostrador + 2 operarios en bodega/administración + 1 auditor/gerente = **7 usuarios concurrentes máximos en pico**.
* **Volumen Transaccional Diario:** 400 a 800 facturas emitidas/día; ~3,000 líneas de detalle y movimientos de Kardex diarios.
* **Proyección de Crecimiento de Datos:** 15 a 25 GB/año con almacenamiento de comprobantes, logs de auditoría y estados históricos.

---

## 3. Comparativa Formal: Local (On-Premise) vs Nube (AWS)

| Criterio de Evaluación | Despliegue Local (On-Premise) | Despliegue en Nube (AWS) | Observaciones y Análisis para Nicaragua |
| :--- | :--- | :--- | :--- |
| **Costo Inicial (CAPEX)** | **Medio-Alto:** ~$3,200 USD (Servidor físico, switch Gigabit, cableado Cat 6 y UPS). | **Bajo:** $0 USD en hardware propio de servidor (solo terminales POS y periféricos). | Local requiere compra inicial de servidor; Nube no requiere hardware propio pero sí terminales locales. |
| **Costo Recurrente (OPEX)** | **Muy Bajo:** ~$25 USD/mes (energía eléctrica del servidor y mantenimiento semestral preventivo). | **Medio-Alto:** ~$140 - $210 USD/mes (EC2 t3.xlarge + RDS PostgreSQL Multi-AZ + Transferencia S3 + VPN). | A 3 años, el costo de AWS ($5,400 - $7,500 USD) supera significativamente la inversión del servidor local ($3,200 USD). |
| **Dependencia de Internet** | **CERO dependencia:** Si se cae el enlace de Internet público, el mostrador sigue facturando al 100%. | **CRÍTICA:** Si falla el enlace de Internet o el ISP local, las cajas registradoras quedan paralizadas. | **Factor decisivo:** La regla RNF-02 de REQ-MREC-001 exige continuidad de ventas sin Internet. |
| **Latencia de Red** | **Sub-milisegundo (< 1 ms):** Consulta de stock y confirmación de factura instantánea en LAN. | **70 - 130 ms:** Tráfico internacional hacia data center de AWS (ej. us-east-1 en Virginia). | En horas pico de mostrador, el retraso acumulado por escaneo de código ralentiza la atención al cliente. |
| **Disponibilidad** | 99.5% local (respaldado por UPS y RAID-1). Sujeto a mantenimiento de hardware local. | 99.99% en data centers de AWS (infraestructura redundante con múltiples zonas de disponibilidad). | La nube ofrece mayor redundancia de data center, pero sufre ante la fragilidad del enlace ISP local. |
| **Seguridad de Datos** | Perímetro cerrado en la LAN local; sin exposición a Internet público sin VPN previa. | Alta seguridad física en AWS, pero mayor superficie de ataque expuesta en nube pública. | En local se aplica aislamiento físico contra amenazas externas. |
| **Mantenimiento y Soporte** | Requiere mantenimiento físico (limpieza de polvo, verificación de discos RAID y baterías de UPS). | Mantenimiento de hardware gestionado por AWS; administración de SO/DB a cargo del equipo. | En local el técnico de la empresa debe custodiar el hardware. |
| **Estrategia de Respaldo** | Copia diaria cifrada en almacenamiento externo NAS/disco extraíble + réplica nocturna en nube fría. | Snapshots automáticos en AWS RDS y respaldo en buckets Amazon S3. | La mejor práctica para local es respaldo híbrido (copia local rápida + réplica fuera de sitio). |

---

## 4. Análisis de Riesgos y Mitigaciones

| Riesgo Identificado | Opción Afectada | Nivel de Impacto | Estrategia de Mitigación Adoptada |
| :--- | :--- | :--- | :--- |
| **Corte del suministro de Internet (ISP local)** | Nube (AWS) | **Catastrófico (Paralización de ventas)** | Se adopta despliegue On-Premise local para desacoplar el mostrador de Internet. |
| **Fallo en disco duro del servidor local** | Local | Alto | Arreglo de discos en **RAID-1 espejo**; si un disco falla, el sistema continúa operando sin pérdida de datos. |
| **Corte prolongado de fluido eléctrico** | Local | Medio | **UPS Online de 1500VA** con autonomía para el cierre ordenado de turnos y sincronización de base de datos. |
| **Robo físico o siniestro en el local comercial** | Local | Crítico | Respaldo diario nocturno cifrado con AES-256 subido de forma asíncrona a un bucket de almacenamiento seguro (3-2-1 backup rule). |

---

## 5. Recomendación y Veredicto Arquitectónico
Con base en la evaluación de los criterios de **costo a 3 años**, **latencia en punto de venta**, y en cumplimiento estricto del requisito no funcional **RNF-02 de la línea base REQ-MREC-001**, se concluye formalmente:

> **Decisión Recomendada: Despliegue On-Premise Local en Servidor LAN con PostgreSQL 16 sobre Ubuntu Server LTS y Respaldo Híbrido Asíncrono.**

Esta opción garantiza:
1. **Velocidad máxima** en la cola de atención del mostrador.
2. **Operatividad garantizada aún durante cortes del proveedor de Internet.**
3. **Control total de los datos comerciales y de inventario** de la empresa sin costos recurrentes en dólares.
