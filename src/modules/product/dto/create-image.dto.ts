import { IsArray, IsString } from 'class-validator';

export class CreateImageDto {
  @IsString()
  mainImg: string;

  @IsArray()
  @IsString({ each: true })
  detail: string[];
}
