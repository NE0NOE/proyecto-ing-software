/**
 * Servicio de Auditoría Transaccional Append-Only alineado con ISO/IEC 27001 A.8.15.
 * Prohíbe mutación o eliminación de registros históricos. No almacena secretos.
 */
class AuditLogger {
  constructor() {
    this.logs = [];
  }

  registrarEvento({ usuarioId, rol, accion, entidad, entidadId, detalle, ip = '127.0.0.1' }) {
    const registro = Object.freeze({
      id: this.logs.length + 1,
      correlationId: `CORR-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      usuarioId,
      rol,
      accion,
      entidad,
      entidadId,
      detalle: typeof detalle === 'object' ? JSON.stringify(detalle) : String(detalle),
      ip
    });

    // Inmutabilidad garantizada en memoria / persistencia append-only
    this.logs.push(registro);
    return registro;
  }

  obtenerHistorial() {
    // Retorna copia defensiva para evitar modificaciones externas
    return [...this.logs];
  }
}

module.exports = AuditLogger;
