import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from '@/modules/product/entities/product.entity';

export type SubcategoryDocument = HydratedDocument<Subcategory>;

@Schema()
export class Subcategory {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Product.name }], default: [] })
  product: mongoose.Schema.Types.ObjectId[];
}

export const SubcategoryEntity = SchemaFactory.createForClass(Subcategory);