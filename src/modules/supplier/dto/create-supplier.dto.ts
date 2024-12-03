import { IsNotEmpty, IsEmail, IsString, IsArray, IsMongoId, IsOptional } from 'class-validator';

export class CreateSupplierDto {
  @IsMongoId()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  story?: string;

  @IsString()
  @IsOptional()
  mission?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  products?: string[];
}
