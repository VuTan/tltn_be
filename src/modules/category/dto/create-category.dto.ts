import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateCategoryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true})
  subcategory: string[];
}

