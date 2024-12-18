import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Subcategory } from '@/modules/subcategory/entities/subcategory.entity';
import { IsNotEmpty } from 'class-validator';
import { Product } from '@/modules/product/entities/product.entity';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop()
  @IsNotEmpty()
  title: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Subcategory.name })
  subcategory: mongoose.Schema.Types.ObjectId[];
}

export const CategoryEntity = SchemaFactory.createForClass(Category);