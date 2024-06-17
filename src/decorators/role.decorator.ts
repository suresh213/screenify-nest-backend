import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/enums/role.enum';

export const HasRoles = (role: Role) => SetMetadata('role', role);