import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderItemDto } from './create-order_item.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { OrderItemStatus } from '@/modules/order_item/entities/order_item_status';

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {
  @IsMongoId()
  @IsNotEmpty()
  _id: string;

  @IsOptional()
  status?: OrderItemStatus[];
}
