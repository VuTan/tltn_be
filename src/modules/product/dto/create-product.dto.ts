import {
  IsArray,
  IsEmpty,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOptionDto } from '@/modules/product/dto/create-option.dto';
import { Types } from 'mongoose';
import { CreateSpecDto } from '@/modules/product/dto/create_spec.dto';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  base_price: number;

  @IsNotEmpty()
  @IsMongoId()
  category: string;

  @IsOptional()
  @IsNumber()
  discount: number;

  @IsOptional()
  @IsNumber()
  stock: number;

  @IsOptional()
  @IsArray()
  spec: CreateSpecDto[];

  @IsOptional()
  @IsArray()
  des: string[];

  @IsOptional()
  @IsArray()
  imgs: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}

