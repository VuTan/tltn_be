import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OrderItems } from '@/modules/order_item/entities/order_item.entity';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  total_price: number;

  @Prop({ required: true })
  delivery_fee: number;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'OrderItems' })
  orderItems: OrderItems[];

  @Prop()
  status: string;

  // @Prop({ type: Types.ObjectId, ref: 'Voucher' })
  // voucher?: Types.ObjectId | Voucher;

}

export const OrderEntity = SchemaFactory.createForClass(Order);