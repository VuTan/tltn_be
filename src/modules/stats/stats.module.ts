import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Stats, StatsEntity } from '@/modules/stats/entities/stat.entity';
import { ProductModule } from '@/modules/product/product.module';
import { OrderModule } from '@/modules/order/order.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stats.name, schema: StatsEntity }]),
    ProductModule,
    OrderModule,
    UsersModule,
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [
    StatsService,
  ],
})
export class StatsModule {
}
