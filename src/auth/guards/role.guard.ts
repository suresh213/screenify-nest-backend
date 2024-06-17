import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../constants/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    return true;
    // if (!requiredRole) {
    //   return true;
    // }

    // const { user } = context.switchToHttp().getRequest();
    // return user?.role === requiredRole || user?.role === Role.SuperAdmin;
  }
}
