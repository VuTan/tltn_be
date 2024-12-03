import { IsEmail, IsIn, IsNotEmpty, IsString, IsStrongPassword, ValidateIf } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message:
        'The password should contain at least 1 uppercase character, 1 lowercase, 1 number and should be at least 8 characters long.',
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([Math.random()], {
    message: 'Passwords do not match',
  })
  @ValidateIf((o) => o.password !== o.repeatPassword)
  repeatPassword: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
