import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';
import { Stats } from '@/modules/stats/entities/stat.entity';
import { Product } from '@/modules/product/entities/product.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Order } from '@/modules/order/entities/order.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Stats.name) private readonly statsModel: Model<Stats>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async updateStats() {
    // Tính tổng số sản phẩm, người dùng và đơn hàng
    const totalProducts = await this.productModel.countDocuments();
    const totalUsers = await this.userModel.countDocuments();
    const totalOrders = await this.orderModel.countDocuments();

    // Tính tổng doanh thu (giả sử bạn có trường totalPrice trong Order)
    const totalRevenue = await this.orderModel.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: "$total_price" } } }
    ]);

    const revenue = totalRevenue[0]?.totalRevenue || 0;

    // Lưu thông tin thống kê vào cơ sở dữ liệu
    await this.statsModel.create({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue: revenue,
      timestamp: new Date(),
      name: 'Statistics Update',
    });

    console.log(`Stats updated at ${new Date()}`);
  }

  // Lấy số liệu theo tuần
  async getStatsByWeek() {
    const startOfWeek = dayjs().startOf('week').toDate();
    const endOfWeek = dayjs().endOf('week').toDate();

    const stats = await this.statsModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $group: {
          _id: { $week: "$timestamp" }, // Nhóm theo tuần của năm
          totalProducts: { $sum: "$totalProducts" },
          totalUsers: { $sum: "$totalUsers" },
          totalOrders: { $sum: "$totalOrders" },
          totalRevenue: { $sum: "$totalRevenue" },  // Thêm tổng doanh thu
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    return stats;
  }

  // Lấy số liệu theo tháng
  async getStatsByMonth() {
    const startOfMonth = dayjs().startOf('month').toDate();
    const endOfMonth = dayjs().endOf('month').toDate();

    const stats = await this.statsModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
          }, // Nhóm theo tháng và năm
          totalProducts: { $sum: "$totalProducts" },
          totalUsers: { $sum: "$totalUsers" },
          totalOrders: { $sum: "$totalOrders" },
          totalRevenue: { $sum: "$totalRevenue" },  // Thêm tổng doanh thu
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return stats;
  }

  // Lấy số liệu theo năm
  async getStatsByYear() {
    const startOfYear = dayjs().startOf('year').toDate();
    const endOfYear = dayjs().endOf('year').toDate();

    const stats = await this.statsModel.aggregate([
      {
        $match: {
          timestamp: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: { $year: "$timestamp" }, // Nhóm theo năm
          totalProducts: { $sum: "$totalProducts" },
          totalUsers: { $sum: "$totalUsers" },
          totalOrders: { $sum: "$totalOrders" },
          totalRevenue: { $sum: "$totalRevenue" },  // Thêm tổng doanh thu
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    return stats;
  }


}
