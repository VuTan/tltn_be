import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, CategoryEntity } from '@/modules/category/entities/category.entity';
import { SubcategoryModule } from '@/modules/subcategory/subcategory.module';
import { ProductModule } from '@/modules/product/product.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategoryEntity }]),
    SubcategoryModule,
    ProductModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [MongooseModule, CategoryService],
})
export class CategoryModule {
}
