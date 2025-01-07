import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Option } from '@/modules/product/entities/option.entity';
import { Spec } from '@/modules/product/entities/spec.entity';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  base_price: number;

  @Prop()
  price: number;

  @Prop({ default: 0, min: 0, max: 5 })
  rate: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' })
  subcategory: mongoose.Schema.Types.ObjectId;

  @Prop()
  discount: number;

  @Prop()
  describe: string;

  @Prop()
  spec: Spec[];

  @Prop()
  options: Option[];

  @Prop()
  stock: number

  @Prop()
  imgs: string[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Comment' })
  comments: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', require: true })
  supplier_id: mongoose.Schema.Types.ObjectId;


}

export const ProductEntity = SchemaFactory.createForClass(Product);