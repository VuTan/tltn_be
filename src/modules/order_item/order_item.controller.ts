import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderItemService } from './order_item.service';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { ObjectId } from 'mongoose';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {
  }



  @Post()
  create(@Body() createOrderItemDto: CreateOrderItemDto[]) {
    return this.orderItemService.create(createOrderItemDto);
  }

  @Get('count')
  async getTotalQuantityAndPrice() {
    return await this.orderItemService.getTotalQuantityAndPrice();
  }

  @Get()
  findAll() {
    return this.orderItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderItemService.findOne(id);
  }

  @Patch()
  update(@Body() updateOrderItemDto: UpdateOrderItemDto) {
    return this.orderItemService.update(updateOrderItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderItemService.remove(+id);
  }
}
