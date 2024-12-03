export class Stat {}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StatsDocument = HydratedDocument<Stats>;

@Schema({ timestamps: true })
export class Stats {
  @Prop({ required: true })
  totalProducts: number;

  @Prop({ required: true })
  totalUsers: number;

  @Prop({ required: true })
  totalOrders: number;

  @Prop({ required: true })
  totalRevenue: number;

  @Prop({ required: true })
  timestamp: Date; // Mốc thời gian để xác định khi cập nhật

  @Prop({ required: true })
  name: string; // Nếu bạn cần tên cho mục đích phân biệt các thống kê
}

export const StatsEntity = SchemaFactory.createForClass(Stats);
