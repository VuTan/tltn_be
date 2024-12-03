import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
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
}
