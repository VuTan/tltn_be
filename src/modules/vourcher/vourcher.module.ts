import { Module } from '@nestjs/common';
import { VourcherService } from './vourcher.service';
import { VourcherController } from './vourcher.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Voucher, VoucherEntity } from '@/modules/vourcher/entities/voucher.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Voucher.name, schema: VoucherEntity }]),
  ],
  controllers: [VourcherController],
  providers: [VourcherService],
})
export class VourcherModule {
}
