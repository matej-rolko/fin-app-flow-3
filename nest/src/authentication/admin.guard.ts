import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Role } from './../users/role';
import { UsersService } from './../users/users.service';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from './jwtAuth.guard';

@Injectable()
export class AdminGuard extends JwtAuthGuard implements CanActivate {
  constructor(@Inject(UsersService) private usersService: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First we check if the user is authenticated
    const isAuthenticated = super.canActivate(context);
    if (!isAuthenticated) return false;

    const request = context.switchToHttp().getRequest();
    const userId: number = request.user.id;

    const user = await this.usersService.findUserById(userId);
    // console.log("user in admin guard", user);

    // This returns true if there is a user and the user is an admin
    return user && user.role === Role.Admin;
  }
}
