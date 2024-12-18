import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OrderItemStatus } from '@/modules/order_item/entities/order_item_status';

export type OrderItemDocument = HydratedDocument<OrderItems>;

@Schema()
export class OrderItems {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
  product_id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  total_price: number;

  @Prop()
  status: OrderItemStatus[];
}

export const OrderItemEntity = SchemaFactory.createForClass(OrderItems);
