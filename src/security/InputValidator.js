/**
 * Validador estricto de entradas en el servidor alineado con ISO/IEC 27001 A.8.28.
 * Mitiga OWASP A03 (Injection) y A04 (Insecure Design) validando tipos, formatos y límites.
 */
class InputValidator {
  static sanitizeString(input, maxLength = 100) {
    if (typeof input !== 'string') return '';
    // Elimina caracteres de control y recorta a longitud máxima permitida
    return input.replace(/[\x00-\x1F\x7F<>]/g, '').trim().substring(0, maxLength);
  }

  static validatePositiveInteger(value, fieldName = 'campo') {
    const num = Number(value);
    if (!Number.isInteger(num) || num <= 0) {
      throw new Error(`[VALIDACIÓN SEGURA] El valor de '${fieldName}' debe ser un entero positivo mayor que cero.`);
    }
    return num;
  }

  static validateDecimal(value, fieldName = 'monto', min = 0) {
    const num = Number(value);
    if (isNaN(num) || num < min || !isFinite(num)) {
      throw new Error(`[VALIDACIÓN SEGURA] El valor de '${fieldName}' debe ser un número decimal válido mayor o igual a ${min}.`);
    }
    // Redondeo a 2 decimales para precisión contable
    return Math.round(num * 100) / 100;
  }

  static validateVentaPayload(payload) {
    if (!payload || typeof payload !== 'object') {
      throw new Error('[VALIDACIÓN SEGURA] Payload de venta inválido o ausente.');
    }
    const clienteId = this.validatePositiveInteger(payload.clienteId, 'clienteId');
    const usuarioId = this.validatePositiveInteger(payload.usuarioId, 'usuarioId');
    
    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      throw new Error('[VALIDACIÓN SEGURA] La venta debe contener al menos un producto.');
    }

    const itemsValidados = payload.items.map((item, index) => ({
      productoId: this.validatePositiveInteger(item.productoId, `items[${index}].productoId`),
      cantidad: this.validatePositiveInteger(item.cantidad, `items[${index}].cantidad`),
      precioUnitario: this.validateDecimal(item.precioUnitario, `items[${index}].precioUnitario`, 0.01)
    }));

    const medioPago = this.sanitizeString(payload.medioPago || 'EFECTIVO', 20).toUpperCase();
    const permitido = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CREDITO'];
    if (!permitido.includes(medioPago)) {
      throw new Error(`[VALIDACIÓN SEGURA] Medio de pago no permitido: '${medioPago}'.`);
    }

    return { clienteId, usuarioId, items: itemsValidados, medioPago };
  }
}

module.exports = InputValidator;
