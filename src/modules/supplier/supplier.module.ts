import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, SupplierEntity } from '@/modules/supplier/entities/supplier.entity';
import { UsersModule } from '@/modules/users/users.module';
import { ProductModule } from '@/modules/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Supplier.name, schema: SupplierEntity }]),
    UsersModule,
    ProductModule,
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {
}