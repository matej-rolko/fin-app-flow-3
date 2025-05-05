import {
  Contains,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsString()
  @MinLength(6, {
    message: 'Username must be at least 6 characters long',
  })
  @MaxLength(24, {
    message: 'Password can be maximum 24 characters long',
  })
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @MaxLength(24, {
    message: 'Password can be maximum 24 characters long',
  })
  password: string;
}
