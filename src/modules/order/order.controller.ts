import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get('count')
  countOrder() {
    return this.orderService.countOrder();
  }

  @Get('user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    return this.orderService.getOrdersByUser(userId);
  }

  @Get('revenue')
  async getRevenue(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('groupBy') groupBy: 'daily' | 'monthly' | 'yearly',
  ) {
    return this.orderService.getRevenueByRange(start, end, groupBy);
  }

  @Get('Hour')
  async getDailyRevenue(@Query() query: { day: string, month: string, year: string }) {
    return this.orderService.getDailyRevenue(query);
  }

  // // Lấy doanh thu theo tháng
  @Get('Day')
  async getMonthlyRevenue(@Query() query: { month: string, year: string }) {
    return this.orderService.getMonthlyRevenue(query);
  }

  // Lấy doanh thu theo năm
  @Get('Month')
  async getYearlyRevenue(@Query() year: string) {
    return this.orderService.getYearlyRevenue(year);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
