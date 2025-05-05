import {
  Controller,
  Post,
  UseGuards,
  Request as Request2,
  ForbiddenException,
  Get,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/authentication/jwtAuth.guard';
import { AdminGuard } from 'src/authentication/admin.guard';

@Controller()
export class UserController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('users/premiumUpgrade')
  premiumUpgrade(@Request2() req) {
    return this.userService.upgradeToPremium(req.user.id);
  }

  @UseGuards(AdminGuard)
  @Post('users/adminUpgrade')
  adminUpgrade(@Request2() req) {
    if (req.user.role !== 'admin') {
      return new ForbiddenException('You do not have permission to do this!');
    }
    return this.userService.upgradeToAdmin(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserById(@Param('id') id: number) {
    return this.userService.findUserById(id);
  }
}
