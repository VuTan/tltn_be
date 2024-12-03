import { IsMongoId, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { CreateOrderItemDto } from '@/modules/order_item/dto/create-order_item.dto';

export class CreateOrderDto {
  @IsMongoId()
  user: Types.ObjectId;

  @IsNumber()
  delivery_fee: number;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];

  // @IsMongoId()
  // @IsOptional()
  // voucher?: Types.ObjectId;
}
