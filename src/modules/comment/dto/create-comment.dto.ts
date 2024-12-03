import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCommentDto {
  @IsMongoId()
  @IsNotEmpty()
  user_id: string;

  @IsMongoId()
  @IsNotEmpty()
  product_id: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  time: Date;

  @IsString()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  rate: number;

  @IsOptional()
  @IsArray()
  image: string[];
}
