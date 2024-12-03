import { PartialType } from '@nestjs/mapped-types';
import { CreateSubcategoryDto } from './create-subcategory.dto';
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddProductDto {
  @IsMongoId({ message: 'Id subcategory is not valid' })
  @IsNotEmpty()
  subcategoryId: string;

  @IsMongoId({ message: 'Id product is not valid' })
  @IsNotEmpty()
  productId: string;
}
