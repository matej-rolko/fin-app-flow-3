import {
  Controller,
  Post,
  UseGuards,
  ForbiddenException,
  Body,
  ValidationPipe,
  UsePipes,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './localAuth.guard';
import { JwtAuthGuard } from './jwtAuth.guard';
import { AdminGuard } from './admin.guard';
import { SignUpDto } from './dto/signupDto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('auth/premiumUpgrade')
  premiumUpgrade(@Req() req) {
    return this.authService.upgradeToPremium(req.user.id);
  }

  @UseGuards(AdminGuard)
  @Post('auth/adminUpgrade')
  adminUpgrade(@Req() req) {
    if (req.user.role !== 'admin') {
      return new ForbiddenException('You do not have permission to do this!');
    }
    return this.authService.upgradeToAdmin(req.user.id);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  signIn(@Body() signupDto: SignUpDto) {
    return this.authService.signup(signupDto);
  }
}
