import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { Category } from '@/modules/category/entities/category.entity';
import { Subcategory, SubcategoryEntity } from '@/modules/subcategory/entities/subcategory.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subcategory.name, schema: SubcategoryEntity }]),
  ],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  exports: [MongooseModule],
})
export class SubcategoryModule {
}
