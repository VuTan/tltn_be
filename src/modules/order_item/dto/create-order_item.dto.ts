import { IsMongoId, IsNumber, Min } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderItemDto {
  @IsMongoId()
  product_id: string;

  @IsNumber()
  @Min(1)
  quantity: number;

}
