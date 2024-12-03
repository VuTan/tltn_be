import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@/modules/users/users.module';
import { Order, OrderEntity } from '@/modules/order/entities/order.entity';
import { OrderItemModule } from '@/modules/order_item/order_item.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderEntity }]),
    UsersModule,
    OrderItemModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports:[
    OrderModule, MongooseModule
  ]
})
export class OrderModule {
}
