import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type OrderItemDocument = HydratedDocument<OrderItems>;

@Schema()
export class  OrderItems {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
  product_id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  total_price: number;
}

export const OrderItemEntity = SchemaFactory.createForClass(OrderItems);
