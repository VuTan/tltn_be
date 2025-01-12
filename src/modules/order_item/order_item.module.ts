import { Module } from '@nestjs/common';
import { OrderItemService } from './order_item.service';
import { OrderItemController } from './order_item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderItemEntity, OrderItems } from '@/modules/order_item/entities/order_item.entity';
import { ProductModule } from '@/modules/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OrderItems.name, schema: OrderItemEntity }]),
    ProductModule,
  ],
  controllers: [OrderItemController],
  providers: [OrderItemService],
  exports: [MongooseModule, OrderItemService],
})
export class OrderItemModule {
}
