import { UserEntity } from 'src/authentication/entities/user.entity';

export class CreateCategoryDto {
  title: string;
  user: UserEntity;
}
