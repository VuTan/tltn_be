import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateImageDto } from './create-image.dto';

export class CreateSpecDto {
  @IsString()
  @IsNotEmpty()
  spec: string;

  @IsString()
  @IsNotEmpty()
  value: string;

}
