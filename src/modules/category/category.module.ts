import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategoryEntity } from '@/modules/category/entities/category.entity';
import { SubcategoryModule } from '@/modules/subcategory/subcategory.module';
import { ProductModule } from '@/modules/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategoryEntity }]),
    SubcategoryModule,
    ProductModule
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {
}
