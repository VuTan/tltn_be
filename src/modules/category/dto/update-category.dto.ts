import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsMongoId({ message: 'Id is not valid' })
  @IsNotEmpty()
  _id: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  subcategory: string[];
}
