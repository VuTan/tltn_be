import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema({ timestamps: true })
export class Supplier {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  @IsNotEmpty()
  user_id: mongoose.Schema.Types.ObjectId;

  @Prop()
  @IsNotEmpty()
  name: string;

  @Prop()
  @IsNotEmpty()
  address: string;

  @Prop()
  @IsNotEmpty()
  email: string;

  @Prop()
  @IsNotEmpty()
  phone: string;

  @Prop()
  story: string;

  @Prop()
  mission: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Product' })
  products: mongoose.Schema.Types.ObjectId[];

  @Prop({ default: false })
  isActive: boolean;
}

export const SupplierEntity = SchemaFactory.createForClass(Supplier);