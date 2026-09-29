/**
 * Control de Acceso Basado en Roles (RBAC) alineado con ISO/IEC 27001 A.5.15 y A.5.18.
 * Aplica principio de mínimo privilegio en servidor.
 */
class RbacMiddleware {
  static ROLES = {
    ADMINISTRADOR: 'ADMINISTRADOR',
    CAJERO: 'CAJERO',
    BODEGUERO: 'BODEGUERO',
    AUDITOR: 'AUDITOR'
  };

  static PERMISOS = {
    VENTA_CREAR: ['ADMINISTRADOR', 'CAJERO'],
    VENTA_ANULAR: ['ADMINISTRADOR'],
    INVENTARIO_CONSULTAR: ['ADMINISTRADOR', 'CAJERO', 'BODEGUERO', 'AUDITOR'],
    INVENTARIO_AJUSTAR: ['ADMINISTRADOR', 'BODEGUERO'],
    REPORTE_FINANCIERO: ['ADMINISTRADOR', 'AUDITOR'],
    AUDITORIA_CONSULTAR: ['ADMINISTRADOR', 'AUDITOR']
  };

  static autorizar(usuario, accionRequerida) {
    if (!usuario || !usuario.rol) {
      throw new Error('[SEGURIDAD RBAC] Error 401: Usuario no autenticado.');
    }
    const rolesPermitidos = this.PERMISOS[accionRequerida];
    if (!rolesPermitidos) {
      throw new Error(`[SEGURIDAD RBAC] Permiso no configurado para acción: ${accionRequerida}`);
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      throw new Error(`[SEGURIDAD RBAC] Error 403: Acceso denegado. El rol '${usuario.rol}' no tiene autorización para '${accionRequerida}'.`);
    }

    return true;
  }
}

module.exports = RbacMiddleware;
