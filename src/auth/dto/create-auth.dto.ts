import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  repassword: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  address: string;
}

export class CodeAuthDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'Id is invalid' })
  _id: string;

  @IsNotEmpty()
  code: string;

}

export class ResetPasswordDto {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  confirmPassword: string;

}
