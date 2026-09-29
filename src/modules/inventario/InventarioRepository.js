/**
 * Contrato e implementaciones de Inventario.
 * Aplica:
 * - ISP (Segregación de Interfaces): interfaces pequeñas de solo lectura vs actualización.
 * - LSP (Sustitución de Liskov): la implementación InMemory puede reemplazar a PostgreSQL
 *   sin que el cliente (VentaService) sufra fallos o rompa invariantes.
 */

// Contrato base abstracto
class IInventarioRepository {
  async obtenerStock(productoId) {
    throw new Error('Método no implementado');
  }

  async descontarStock(productoId, cantidad, motivoTransaccion) {
    throw new Error('Método no implementado');
  }

  async restaurarStock(productoId, cantidad, motivoTransaccion) {
    throw new Error('Método no implementado');
  }
}

// Implementación en memoria (para pruebas automatizadas y modo contingencia offline)
class InMemoryInventarioRepository extends IInventarioRepository {
  constructor(stockInicial = {}) {
    super();
    this.stock = { ...stockInicial };
    this.kardex = [];
  }

  async obtenerStock(productoId) {
    return this.stock[productoId] !== undefined ? this.stock[productoId] : 0;
  }

  async descontarStock(productoId, cantidad, motivoTransaccion) {
    const actual = await this.obtenerStock(productoId);
    if (actual < cantidad) {
      throw new Error(`[STOCK INSUFICIENTE] Producto ${productoId} no cuenta con stock suficiente. Disponible: ${actual}, Solicitado: ${cantidad}`);
    }

    this.stock[productoId] = actual - cantidad;
    this.kardex.push({
      tipo: 'SALIDA_VENTA',
      productoId,
      cantidad,
      saldoAnterior: actual,
      saldoPosterior: this.stock[productoId],
      motivo: motivoTransaccion,
      fecha: new Date().toISOString()
    });

    return this.stock[productoId];
  }

  async restaurarStock(productoId, cantidad, motivoTransaccion) {
    const actual = await this.obtenerStock(productoId);
    this.stock[productoId] = actual + cantidad;
    this.kardex.push({
      tipo: 'COMPENSACION_ROLLBACK',
      productoId,
      cantidad,
      saldoAnterior: actual,
      saldoPosterior: this.stock[productoId],
      motivo: motivoTransaccion,
      fecha: new Date().toISOString()
    });
    return this.stock[productoId];
  }
}

module.exports = {
  IInventarioRepository,
  InMemoryInventarioRepository
};
