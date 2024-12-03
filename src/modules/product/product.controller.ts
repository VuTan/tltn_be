import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from '@/decorator/customize';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    // return this.productService.findAll(query, +current, +pageSize);
    return this.productService.findAll();
  }

  @Public()
  @Get('random')
  async findRandomProduct() {
    // return this.productService.findAll(query, +current, +pageSize);
    return this.productService.findRandomProduct();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }


  @Patch()
  update(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(updateProductDto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.productService.remove(id);
  }
}
