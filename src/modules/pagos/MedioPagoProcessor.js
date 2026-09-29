/**
 * Procesador de Medios de Pago.
 * Aplica Principio Abierto/Cerrado (OCP): Abierto a soportar nuevos medios de pago mediante
 * clases especializadas sin modificar la lógica base de orquestación de cobro.
 */
class BaseMedioPagoHandler {
  procesarPago(monto, datosTransaccion) {
    throw new Error('Método procesarPago debe ser implementado por la subclase.');
  }
}

class PagoEfectivoHandler extends BaseMedioPagoHandler {
  procesarPago(monto, datosTransaccion) {
    const recibido = Number(datosTransaccion.montoRecibido || monto);
    if (recibido < monto) {
      throw new Error(`[PAGO EFECTIVO] Monto insuficiente. Recibido C$${recibido}, Total C$${monto}.`);
    }
    const vuelto = Math.round((recibido - monto) * 100) / 100;
    return {
      exito: true,
      medio: 'EFECTIVO',
      montoCobrado: monto,
      montoRecibido: recibido,
      vuelto,
      referencia: `EFECTIVO-${Date.now()}`
    };
  }
}

class PagoTarjetaHandler extends BaseMedioPagoHandler {
  procesarPago(monto, datosTransaccion) {
    const { autorizacionPos } = datosTransaccion;
    if (!autorizacionPos) {
      throw new Error('[PAGO TARJETA] Falta número de autorización del POS bancario.');
    }
    return {
      exito: true,
      medio: 'TARJETA',
      montoCobrado: monto,
      montoRecibido: monto,
      vuelto: 0,
      referencia: autorizacionPos
    };
  }
}

class PagoTransferenciaHandler extends BaseMedioPagoHandler {
  procesarPago(monto, datosTransaccion) {
    const { numeroReferenciaBancaria } = datosTransaccion;
    if (!numeroReferenciaBancaria) {
      throw new Error('[PAGO TRANSFERENCIA] Falta el número de comprobante o referencia bancaria.');
    }
    return {
      exito: true,
      medio: 'TRANSFERENCIA',
      montoCobrado: monto,
      montoRecibido: monto,
      vuelto: 0,
      referencia: numeroReferenciaBancaria
    };
  }
}

class PaymentFactory {
  static handlers = {
    EFECTIVO: new PagoEfectivoHandler(),
    TARJETA: new PagoTarjetaHandler(),
    TRANSFERENCIA: new PagoTransferenciaHandler()
  };

  static registrarNuevoMedio(nombre, handlerInstance) {
    this.handlers[nombre.toUpperCase()] = handlerInstance;
  }

  static obtenerHandler(medio) {
    const handler = this.handlers[medio.toUpperCase()];
    if (!handler) {
      throw new Error(`[PAGOS] Medio de pago no soportado: '${medio}'.`);
    }
    return handler;
  }
}

module.exports = {
  BaseMedioPagoHandler,
  PagoEfectivoHandler,
  PagoTarjetaHandler,
  PagoTransferenciaHandler,
  PaymentFactory
};
