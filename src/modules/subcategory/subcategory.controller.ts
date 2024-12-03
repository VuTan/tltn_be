import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Public } from '@/decorator/customize';
import { AddProductDto } from '@/modules/subcategory/dto/add-product.dto';

@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {
  }

  @Post()
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoryService.create(createSubcategoryDto);
  }

  @Post('add-product')
  async addProductToSubcategory(@Body() addProduct: AddProductDto) {
    const { subcategoryId, productId } = addProduct;
    const updatedSubcategory = await this.subcategoryService.addProduct(
      subcategoryId,
      productId,
    );

    return updatedSubcategory;
  }

  @Public()
  @Get()
  findAll() {
    return this.subcategoryService.findAll();
  }

  @Public()
  @Get('find')
  findOne(@Query('id') id: string) {
    return this.subcategoryService.findOne(id);
  }

  @Patch()
  update(@Body() updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.subcategoryService.update(updateSubcategoryDto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.subcategoryService.remove(id);
  }
}
