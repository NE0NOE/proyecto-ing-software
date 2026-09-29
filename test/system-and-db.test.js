const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const InputValidator = require('../src/security/InputValidator');
const RbacMiddleware = require('../src/security/RbacMiddleware');
const AuditLogger = require('../src/security/AuditLogger');
const { InMemoryInventarioRepository } = require('../src/modules/inventario/InventarioRepository');
const CalculadorImpuestos = require('../src/modules/ventas/CalculadorImpuestos');
const VentaService = require('../src/modules/ventas/VentaService');
const { PaymentFactory } = require('../src/modules/pagos/MedioPagoProcessor');

describe('Suite de Pruebas: Moto Repuestos El Centenario', () => {

  describe('Pruebas de Seguridad ISO/IEC 27001 y RBAC', () => {
    test('CP-SIS-03: RbacMiddleware permite acceso al Cajero para VENTA_CREAR pero deniega VENTA_ANULAR', () => {
      const cajero = { id: 101, nombre: 'Noel Alemán', rol: 'CAJERO' };
      
      // Permitido
      assert.equal(RbacMiddleware.autorizar(cajero, 'VENTA_CREAR'), true);

      // Bloqueado
      assert.throws(() => {
        RbacMiddleware.autorizar(cajero, 'VENTA_ANULAR');
      }, /Error 403: Acceso denegado/);
    });

    test('InputValidator rechaza entradas maliciosas o tipos numéricos negativos (Mitigación Injection/Overflow)', () => {
      assert.throws(() => {
        InputValidator.validatePositiveInteger(-5, 'cantidad');
      }, /debe ser un entero positivo/);

      assert.throws(() => {
        InputValidator.validateDecimal(-100, 'precio');
      }, /debe ser un número decimal válido mayor o igual a 0/);

      const sanitizado = InputValidator.sanitizeString('<script>alert("hack")</script>Repuesto Bujía', 50);
      assert.equal(sanitizado.includes('<'), false);
      assert.equal(sanitizado.includes('>'), false);
    });
  });

  describe('Pruebas de Principios SOLID', () => {
    test('SOLID - SRP: CalculadorImpuestos calcula exactamente IVA 15% y subtotales contables', () => {
      const calculador = new CalculadorImpuestos(0.15);
      const items = [
        { cantidad: 2, precioUnitario: 100 }, // C$ 200
        { cantidad: 1, precioUnitario: 300 }  // C$ 300
      ]; // Subtotal Bruto: 500

      const resultado = calculador.calcularTotales(items, 10); // 10% desc = 50. Subtotal Neto: 450. IVA 15%: 67.50. Total: 517.50
      assert.equal(resultado.subtotalBruto, '500.00');
      assert.equal(resultado.descuentoMonto, '50.00');
      assert.equal(resultado.subtotalNeto, '450.00');
      assert.equal(resultado.impuestoIva, '67.50');
      assert.equal(resultado.totalPagar, '517.50');
    });

    test('SOLID - OCP: PaymentFactory procesa diferentes medios de pago por estrategia sin mutar la base', () => {
      const handlerEfectivo = PaymentFactory.obtenerHandler('EFECTIVO');
      const resultadoEfectivo = handlerEfectivo.procesarPago(500, { montoRecibido: 600 });
      assert.equal(resultadoEfectivo.exito, true);
      assert.equal(resultadoEfectivo.vuelto, 100);

      const handlerTarjeta = PaymentFactory.obtenerHandler('TARJETA');
      const resultadoTarjeta = handlerTarjeta.procesarPago(500, { autorizacionPos: 'POS-AUTH-987654' });
      assert.equal(resultadoTarjeta.referencia, 'POS-AUTH-987654');
    });

    test('SOLID - LSP & DIP: VentaService orquesta transacción con InMemoryInventarioRepository', async () => {
      const inventarioRepo = new InMemoryInventarioRepository({
        10: 25, // Producto 10 con 25 en stock
        20: 5   // Producto 20 con 5 en stock
      });
      const auditLogger = new AuditLogger();
      const ventaService = new VentaService({ inventarioRepository: inventarioRepo, auditLogger });

      const usuarioCajero = { id: 101, rol: 'CAJERO' };
      const ventaPayload = {
        clienteId: 501,
        usuarioId: 101,
        medioPago: 'EFECTIVO',
        items: [
          { productoId: 10, cantidad: 3, precioUnitario: 150 },
          { productoId: 20, cantidad: 2, precioUnitario: 80 }
        ]
      };

      const factura = await ventaService.procesarVenta(usuarioCajero, ventaPayload, { montoRecibido: 1000 });
      assert.equal(factura.estado, 'CONFIRMADA');
      assert.equal(await inventarioRepo.obtenerStock(10), 22); // 25 - 3 = 22
      assert.equal(await inventarioRepo.obtenerStock(20), 3);  // 5 - 2 = 3

      // Verifica auditoría inmutable
      const logs = auditLogger.obtenerHistorial();
      assert.equal(logs.length, 1);
      assert.equal(logs[0].accion, 'VENTA_CONFIRMADA');
    });
  });

  describe('Pruebas de Transaccionalidad y Rollback (Resiliencia de Base de Datos)', () => {
    test('CP-SIS-02 & CP-DB-03: Sobregiro de stock detiene la venta y ejecuta ROLLBACK compensatorio', async () => {
      const inventarioRepo = new InMemoryInventarioRepository({
        10: 10, // Stock suficiente para producto 10
        30: 1   // Stock INSUFICIENTE para producto 30 (piden 5)
      });
      const auditLogger = new AuditLogger();
      const ventaService = new VentaService({ inventarioRepository: inventarioRepo, auditLogger });

      const usuarioCajero = { id: 101, rol: 'CAJERO' };
      const ventaInvalida = {
        clienteId: 502,
        usuarioId: 101,
        medioPago: 'EFECTIVO',
        items: [
          { productoId: 10, cantidad: 4, precioUnitario: 100 },
          { productoId: 30, cantidad: 5, precioUnitario: 250 } // Fallará aquí
        ]
      };

      await assert.rejects(async () => {
        await ventaService.procesarVenta(usuarioCajero, ventaInvalida, { montoRecibido: 2000 });
      }, /STOCK INSUFICIENTE/);

      // Verificación de atomicidad: el producto 10 debe haber sido restaurado a su stock original (10)
      assert.equal(await inventarioRepo.obtenerStock(10), 10, 'El stock del producto 10 debió restaurarse por rollback');
      assert.equal(await inventarioRepo.obtenerStock(30), 1, 'El stock del producto 30 debió permanecer inalterado');

      // Verifica registro del intento fallido en auditoría
      const logs = auditLogger.obtenerHistorial();
      const logRollback = logs.find(l => l.accion === 'VENTA_FALLIDA_ROLLBACK');
      assert.ok(logRollback, 'Debe existir un evento de auditoría documentando el rollback');
    });
  });

});
