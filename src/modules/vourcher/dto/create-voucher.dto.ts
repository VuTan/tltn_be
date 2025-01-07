import { IsNotEmpty, IsString, IsNumber, IsDate, IsOptional, IsArray, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVoucherDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  discountType: string;

  @IsNotEmpty()
  @IsNumber()
  discountValue: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  validFrom: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  validUntil: Date;

  @IsOptional()
  @IsNumber()
  minimumOrderValue?: number;

  @IsOptional()
  @IsNumber()
  maximumDiscountAmount?: number;

  @IsOptional()
  @IsNumber()
  usageLimit?: number;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  applicableProducts?: string[];


  @IsOptional()
  @IsString()
  description?: string;


}