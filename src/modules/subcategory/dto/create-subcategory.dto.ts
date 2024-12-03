import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  products: string[];
}
