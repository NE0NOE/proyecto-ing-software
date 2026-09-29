/**
 * Calculador de impuestos y totales fiscales.
 * Aplica Principio de Responsabilidad Única (SRP): solo calcula importes y tasas fiscales vigentes.
 */
class CalculadorImpuestos {
  constructor(tasaIva = 0.15) {
    this.tasaIva = tasaIva; // IVA estándar del 15% en Nicaragua
  }

  calcularTotales(items, descuentoPorcentaje = 0) {
    let subtotalBruto = 0;

    for (const item of items) {
      subtotalBruto += item.cantidad * item.precioUnitario;
    }

    const descuentoMonto = Math.round((subtotalBruto * (descuentoPorcentaje / 100)) * 100) / 100;
    const subtotalNeto = Math.round((subtotalBruto - descuentoMonto) * 100) / 100;
    const impuestoIva = Math.round((subtotalNeto * this.tasaIva) * 100) / 100;
    const totalPagar = Math.round((subtotalNeto + impuestoIva) * 100) / 100;

    return {
      subtotalBruto: subtotalBruto.toFixed(2),
      descuentoMonto: descuentoMonto.toFixed(2),
      subtotalNeto: subtotalNeto.toFixed(2),
      impuestoIva: impuestoIva.toFixed(2),
      totalPagar: totalPagar.toFixed(2)
    };
  }
}

module.exports = CalculadorImpuestos;
