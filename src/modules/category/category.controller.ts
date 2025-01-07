import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from '@/decorator/customize';
import { Product } from '@/modules/product/entities/product.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Public()
  @Get('find')
  findOne(@Query('title') title: string) {
    return this.categoryService.findOne(title);
  }

  @Public()
  @Get(':title/products')
  async getAllProductsByCategory(@Param('title') title: string, @Query('sort') sort: string): Promise<Product[]> {
    return this.categoryService.getAllProductsByCategory(title, sort);
  }

  @Public()
  @Get(':title')
  findProductBySubcategory(@Param('title') title: string, @Query('subcategory') subcategory: string, @Query('sort') sort:string) {
    return this.categoryService.findBySubcategory(title, subcategory, sort);
  }

  @Public()
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Patch()
  update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.categoryService.remove(id);
  }
}
