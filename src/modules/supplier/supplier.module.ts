import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, SupplierEntity } from '@/modules/supplier/entities/supplier.entity';
import { UsersModule } from '@/modules/users/users.module';
import { ProductModule } from '@/modules/product/product.module';
import { OrderModule } from '@/modules/order/order.module';
import { OrderItemModule } from '@/modules/order_item/order_item.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Supplier.name, schema: SupplierEntity }]),
    UsersModule,
    ProductModule,
    OrderModule,
    OrderItemModule
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {
}
