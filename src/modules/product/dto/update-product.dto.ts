import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateOptionDto } from '@/modules/product/dto/create-option.dto';
import { CreateSpecDto } from '@/modules/product/dto/create_spec.dto';

export class  UpdateProductDto extends PartialType(CreateProductDto) {
  @IsMongoId()
  @IsNotEmpty()
  _id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  base_price?: number;

  @IsOptional()
  @IsNumber()
  rate?: number;

  @IsOptional()
  @IsMongoId()
  subcategory: string;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsString()
  describe?: string;

  @IsOptional()
  @IsString()
  spec?: CreateSpecDto[];

  @IsOptional()
  options?: CreateOptionDto[];

  @IsOptional()
  @IsMongoId()
  comments?: string;
}
