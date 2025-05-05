import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './../authentication/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from './role';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async upgradeToPremium(userId: number) {
    const user = await this.findUserById(userId);
    user.role = Role.PremiumUser;

    return this.userRepository.save(user);
  }

  async upgradeToAdmin(userId: number) {
    const user = await this.findUserById(userId);
    user.role = Role.Admin;

    return this.userRepository.save(user);
  }

  async findUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async findOne(username: string): Promise<UserEntity> {
    if (!username) return null;

    const result = await this.userRepository.findOne({
      where: { username: username },
    });
    return result;
  }

  async create(username: string, password: string) {
    return this.userRepository.save({
      username,
      password: await bcrypt.hash(password, 10),
    });
  }

  async createWithRole(username: string, password: string, role: Role) {
    return this.userRepository.save({
      username,
      password: await bcrypt.hash(password, 10),
      role: role,
    });
  }

  // An example to retrieve data with related data. Can be used for
  // finding one tenant or one board member.
  // const result = await this.tenantRepository.findOne({ where:
  //     {
  //         id: savedTenant.id
  //     }, relations: {
  //         user: true
  //     }
  // }
  // );
  // console.log("result", result);
  // return result;
  // await this.userRepository.save({username, password}); // Never save passwords in clear text!
}
