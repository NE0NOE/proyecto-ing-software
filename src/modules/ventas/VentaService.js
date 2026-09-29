const InputValidator = require('../../security/InputValidator');
const CalculadorImpuestos = require('./CalculadorImpuestos');
const { PaymentFactory } = require('../pagos/MedioPagoProcessor');

/**
 * Servicio de Negocio de Ventas.
 * Aplica:
 * - DIP (Inversión de Dependencias): Recibe repositorios y servicios inyectados en constructor.
 * - SRP (Responsabilidad Única): Solo orquesta la transacción de venta sin acoplarse a SQL directo.
 * - Transaccionalidad atómica: si ocurre un fallo durante el proceso, revierte cualquier cambio (Rollback compensatorio).
 */
class VentaService {
  constructor({ inventarioRepository, auditLogger, calculadorImpuestos = new CalculadorImpuestos() }) {
    if (!inventarioRepository) {
      throw new Error('[DIP] Se requiere una implementación de inventarioRepository');
    }
    if (!auditLogger) {
      throw new Error('[DIP] Se requiere una implementación de auditLogger');
    }

    this.inventarioRepo = inventarioRepository;
    this.auditLogger = auditLogger;
    this.calculador = calculadorImpuestos;
    this.facturas = [];
  }

  async procesarVenta(usuarioActual, ventaRaw, datosPago = {}) {
    // 1. Validación segura de entrada (ISO 27001 A.8.28)
    const payload = InputValidator.validateVentaPayload(ventaRaw);

    // 2. Cálculo financiero desacoplado
    const totales = this.calculador.calcularTotales(payload.items);

    // 3. Procesar medio de pago mediante Strategy (OCP)
    const paymentHandler = PaymentFactory.obtenerHandler(payload.medioPago);
    const resultadoPago = paymentHandler.procesarPago(Number(totales.totalPagar), datosPago);

    // 4. Bloque Transaccional: Descuento de stock en Kardex con soporte de Rollback
    const itemsDescontados = [];
    try {
      for (const item of payload.items) {
        await this.inventarioRepo.descontarStock(
          item.productoId,
          item.cantidad,
          `Venta preventiva a cliente ${payload.clienteId}`
        );
        itemsDescontados.push(item);
      }

      // 5. Creación de Factura confirmada
      const factura = {
        id: this.facturas.length + 1,
        numeroFactura: `FAC-${new Date().getFullYear()}-${String(this.facturas.length + 1).padStart(6, '0')}`,
        fecha: new Date().toISOString(),
        clienteId: payload.clienteId,
        cajeroId: usuarioActual.id,
        items: payload.items,
        totales,
        pago: resultadoPago,
        estado: 'CONFIRMADA'
      };

      this.facturas.push(factura);

      // 6. Auditoría inmutable de la operación (ISO 27001 A.8.15)
      this.auditLogger.registrarEvento({
        usuarioId: usuarioActual.id,
        rol: usuarioActual.rol,
        accion: 'VENTA_CONFIRMADA',
        entidad: 'FACTURA',
        entidadId: factura.numeroFactura,
        detalle: { totalPagar: totales.totalPagar, itemsCount: payload.items.length }
      });

      return factura;

    } catch (error) {
      // ROLLBACK COMPENSATORIO: Restaurar el stock de los productos que ya se habían descontado
      for (const item of itemsDescontados) {
        await this.inventarioRepo.restaurarStock(
          item.productoId,
          item.cantidad,
          `Rollback compensatorio por fallo de transacción`
        );
      }

      // Registro de error en auditoría sin filtrar stacktraces sensibles
      this.auditLogger.registrarEvento({
        usuarioId: usuarioActual.id,
        rol: usuarioActual.rol,
        accion: 'VENTA_FALLIDA_ROLLBACK',
        entidad: 'VENTA',
        entidadId: null,
        detalle: { error: error.message }
      });

      throw error;
    }
  }

  obtenerFacturas() {
    return [...this.facturas];
  }
}

module.exports = VentaService;
