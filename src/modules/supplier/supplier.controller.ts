import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SetActiveSupplierDto } from '@/modules/supplier/dto/set-active-supplier.dto';
import { CreateProductFromSupplierDto } from '@/modules/supplier/dto/add-product.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {
  }

  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  findAll() {
    return this.supplierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierService.remove(+id);
  }

  @Patch('/set-active')
  async setActive(@Body() setActiveSupplierDto: SetActiveSupplierDto) {
    return this.supplierService.setActive(setActiveSupplierDto);
  }

  @Patch('/add-product')
  async createProductFromSupplier(@Body() createProductFromSupplierDto: CreateProductFromSupplierDto) {
    return this.supplierService.createProductFromSupplier(createProductFromSupplierDto);
  }

  @Get(':user_id/products')
  async getProductsBySupplier(
    @Param('user_id') user_id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'createdAt,desc', // Mặc định sắp xếp theo createdAt giảm dần
    @Query('search') search: string = '',
  ) {
    return this.supplierService.getProductsBySupplier(user_id, page, limit, sort, search);
  }

  // @Get('daily/:supplierId')
  // async getDailyRevenue(
  //   @Param('supplierId') supplierId: string,
  //   @Query() query: { year: number; month: number; day: number },
  // ) {
  //   return this.revenueService.getDailyRevenueBySupplier(query, supplierId);
  // }
  //
  // @Get('monthly/:supplierId')
  // async getMonthlyRevenue(
  //   @Param('supplierId') supplierId: string,
  //   @Query() query: { year: number; month: number },
  // ) {
  //   return this.revenueService.getMonthlyRevenueBySupplier(query, supplierId);
  // }

  @Get('Year/:userId')
  async getYearlyRevenue(
    @Param('userId') userId: string,
    @Query('year') year: number,
  ) {
    return this.supplierService.getYearlyRevenueBySupplier( userId,year);
  }
}
