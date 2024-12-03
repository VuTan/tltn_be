import { PartialType } from '@nestjs/mapped-types';
import { CreateSubcategoryDto } from './create-subcategory.dto';
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {
  @IsMongoId({ message: 'Id is not valid' })
  @IsNotEmpty()
  _id: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  products: string[];
}
