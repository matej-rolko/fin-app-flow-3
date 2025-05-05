import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/signupDto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async upgradeToPremium(userId: number) {
    return this.usersService.upgradeToPremium(userId);
  }

  async upgradeToAdmin(userId: number) {
    return this.usersService.upgradeToAdmin(userId);
  }

  async signup(signupDto: SignUpDto) {
    return this.usersService.create(signupDto.username, signupDto.password);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      id: user.id,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
