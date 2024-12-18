import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductEntity } from '@/modules/product/entities/product.entity';
import { SubcategoryModule } from '@/modules/subcategory/subcategory.module';
import { CategoryModule } from '@/modules/category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductEntity }]),
    SubcategoryModule,
    forwardRef(() => CategoryModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [MongooseModule, ProductService],
})
export class ProductModule {
}
