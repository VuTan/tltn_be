import { IsEmpty, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOptionDto } from '@/modules/product/dto/create-option.dto';
import { Types } from 'mongoose';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  base_price: number;

  @IsNotEmpty()
  @IsMongoId()
  subcategory: string;

  @IsOptional()
  @IsNumber()
  discount: number;

  @IsOptional()
  @IsString()
  describe: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}

