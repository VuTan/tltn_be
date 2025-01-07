import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@/modules/users/entities/user.entity';

export type VoucherDocument = HydratedDocument<Voucher>;

@Schema({ timestamps: true })
export class Voucher {

  @Prop()
  code: string;

  @Prop()
  discountType: string;

  @Prop()
  discountValue: number;

  @Prop()
  validFrom: Date;

  @Prop()
  validUntil: Date;

  @Prop({ nullable: true })
  minimumOrderValue?: number;

  @Prop({ nullable: true })
  maximumDiscountAmount?: number;

  @Prop({ nullable: true })
  usageLimit?: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', require: true })
  applicableProducts?: mongoose.Schema.Types.ObjectId[];

  @Prop({ default: 0 })
  usedCount: number;

  @Prop({ nullable: true })
  description?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true })
  usedUsers: mongoose.Schema.Types.ObjectId[];

}

export const VoucherEntity = SchemaFactory.createForClass(Voucher);
