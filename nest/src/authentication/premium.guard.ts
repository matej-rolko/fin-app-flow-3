import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Role } from '../users/role';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwtAuth.guard';

@Injectable()
export class PremiumUserGuard extends JwtAuthGuard implements CanActivate {
  constructor(@Inject(UsersService) private usersService: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId: number = request.user.id;

    const user = await this.usersService.findUserById(userId);

    return (user && user.role === Role.PremiumUser) || user.role === Role.Admin;
  }
}
