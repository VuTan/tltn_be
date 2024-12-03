import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { CreateProductDto } from '@/modules/product/dto/create-product.dto';

export class CreateProductFromSupplierDto {
  @IsNotEmpty()
  @IsMongoId()
  supplier_id: Types.ObjectId;

  @IsNotEmpty()
  product: CreateProductDto;
}
