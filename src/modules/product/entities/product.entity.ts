import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Option } from '@/modules/product/entities/option.entity';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop()
  base_price: number;

  @Prop({ default: 0, min: 0, max: 5 })
  rate: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' })
  subcategory: mongoose.Schema.Types.ObjectId;

  @Prop()
  discount: number;

  @Prop()
  describe: string;

  @Prop()
  spec: string[];

  @Prop()
  options: Option[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Comment' })
  comments: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', require: true })
  supplier_id: mongoose.Schema.Types.ObjectId;
}

export const ProductEntity = SchemaFactory.createForClass(Product);