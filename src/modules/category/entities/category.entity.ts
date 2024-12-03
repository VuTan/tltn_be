import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Subcategory } from '@/modules/subcategory/entities/subcategory.entity';
import { IsNotEmpty } from 'class-validator';

@Schema()
export class Category {
  @Prop()
  @IsNotEmpty()
  title: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Subcategory.name })
  subcategory: mongoose.Schema.Types.ObjectId[];
}

export const CategoryEntity = SchemaFactory.createForClass(Category);