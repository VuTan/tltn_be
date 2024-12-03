import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '@/modules/order/entities/order.entity';
import { isValidObjectId, Model } from 'mongoose';
import { OrderItemService } from '@/modules/order_item/order_item.service';
import { User, UserDocument } from '@/modules/users/entities/user.entity';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly orderItemService: OrderItemService,  // Inject OrderItemService
  ) {
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const user = this.userModel.findById(createOrderDto.user);
    if (!user) {
      throw new BadRequestException('User is invalid');
    }

    const orderItems = await this.orderItemService.create(createOrderDto.orderItems);

    const total_price = orderItems.reduce((sum, item) => sum + item.total_price, 0);

    const createdOrder = new this.orderModel({
      ...createOrderDto,
      total_price,
      orderItems,
    });

    return createdOrder.save();
  }

  async getOrdersByUser(userId: string): Promise<any> {
    // Kiểm tra xem userId có phải là ObjectId hợp lệ không
    if (!isValidObjectId(userId)) {
      throw new BadRequestException(`Invalid user ID`);
    }

    const orders = await this.orderModel
      .find({ user: userId })
      .populate({
        path: 'orderItems', // Populate orderItems
        model: 'OrderItems',
        select: '_id total_price delivery_fee option quantity status createdAt',
        populate: {
          path: 'product_id',
          model: 'Product',
          select: '_id rate ratings name quantity price imgs',
        }, // Tên model của OrderItem
      })
      .exec();

    // Nếu không tìm thấy đơn hàng
    if (!orders || orders.length === 0) {
      throw new NotFoundException(`No orders found for user`);
    }

    // Tính toán tổng số tiền của tất cả đơn hàng và tổng số lượng đơn hàng
    let totalMoneySpent = 0;  // Tổng tiền đã chi tiêu
    let totalOrders = orders.length;  // Tổng số lượng đơn hàng
    let totalQuantity = 0;  // Tổng số lượng sản phẩm đã mua

    // Lặp qua tất cả các đơn hàng để tính toán
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        totalMoneySpent += item.total_price;  // Cộng tổng tiền của từng item vào tổng
        totalQuantity += item.quantity;  // Cộng số lượng sản phẩm vào tổng
      });
    });

    return {
      orders: orders,
      totalOrders: totalOrders,  // Tổng số lượng đơn hàng
      totalMoneySpent: totalMoneySpent,  // Tổng số tiền đã chi tiêu
      totalQuantity: totalQuantity,  // Tổng số lượng sản phẩm đã mua
    };
  }


  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  countOrder() {
    return this.orderModel.countDocuments();
  }


  async getDailyRevenue(query: any) {
    dayjs.extend(utc);

    const startOfDay = dayjs().utc().year(query.year).month(query.month - 1).date(query.day).startOf('day').toDate();
    const endOfDay = dayjs().utc().year(query.year).month(query.month - 1).date(query.day).endOf('day').toDate();

    console.log('date', query.year, query.month, query.day);
    console.log('start', startOfDay);
    console.log('end', endOfDay);

    // Lấy dữ liệu từ MongoDB
    const data = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $project: {
          orderItemsCount: { $size: '$orderItems' },
          total_price: 1,
          delivery_fee: 1,
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d-%H:00', // Lọc theo giờ (ví dụ: 2024-01-01-08:00)
              date: '$createdAt',
            },
          },
          totalRevenue: { $sum: '$total_price' },
          totalDeliveryFee: { $sum: '$delivery_fee' },
          totalProductsSell: { $sum: '$orderItemsCount' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).exec();

    // Tạo danh sách đầy đủ các giờ trong ngày
    const hoursInDay = Array.from({ length: 24 }, (_, i) =>
      dayjs(startOfDay).add(i, 'hour').format('YYYY-MM-DD-HH:00'),
    );

    // Điền dữ liệu mặc định cho các giờ không có dữ liệu
    const result = hoursInDay.map(hour => {
      const found = data.find(d => d._id === hour);
      return {
        title: hour,
        totalRevenue: found?.totalRevenue || 0,
        totalDeliveryFee: found?.totalDeliveryFee || 0,
        totalProductsSell: found?.totalProductsSell || 0,
      };
    });

    return result;
  }


  async getMonthlyRevenue(query: any) {
    dayjs.extend(utc);

    const startOfMonth = dayjs().utc().year(query.year).month(query.month - 1).startOf('month').toDate(); // Ngày bắt đầu tháng
    const endOfMonth = dayjs().utc().year(query.year).month(query.month - 1).endOf('month').toDate();   // Ngày kết thúc tháng

    console.log('month', query.month, query.year);
    console.log('startOfMonth', startOfMonth);
    console.log('endOfMonth', endOfMonth);

    const daysInMonth = dayjs(startOfMonth).daysInMonth(); // Lấy tổng số ngày trong tháng
    const days = Array.from({ length: daysInMonth }, (_, i) =>
      dayjs(startOfMonth).add(i, 'day').format('YYYY-MM-DD'),
    ); // Danh sách tất cả các ngày trong tháng

    const data = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth, // Ngày bắt đầu tháng
            $lte: endOfMonth,   // Ngày kết thúc tháng
          },
        },
      },
      {
        $project: {
          orderItemsCount: { $size: '$orderItems' },  // Tính số lượng sản phẩm trong orderItems
          total_price: 1,
          delivery_fee: 1,
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d', // Lọc theo ngày
              date: '$createdAt',
            },
          },
          totalRevenue: { $sum: '$total_price' }, // Tổng giá trị đơn hàng
          totalDeliveryFee: { $sum: '$delivery_fee' }, // Tổng phí giao hàng
          totalProductsSell: { $sum: '$orderItemsCount' }, // Tổng sản phẩm bán được
        },
      },
      {
        $sort: { _id: 1 }, // Sắp xếp theo ngày
      },
    ]).exec();

    // Điền giá trị 0 cho các ngày không có dữ liệu
    const result = days.map(day => {
      const found = data.find(d => d._id === day);
      return {
        title: day,
        totalRevenue: found?.totalRevenue || 0,
        totalDeliveryFee: found?.totalDeliveryFee || 0,
        totalProductsSell: found?.totalProductsSell || 0,
      };
    });

    return result;
  }


  async getYearlyRevenue(year) {
    dayjs.extend(utc);

    const startOfYear = dayjs().utc().year(year.year).startOf('year').toDate();
    const endOfYear = dayjs().utc().year(year.year).endOf('year').toDate();

    console.log('year', year.year);
    console.log('startOfYear', startOfYear);
    console.log('endOfYear', endOfYear);

    const months = Array.from({ length: 12 }, (_, i) => dayjs().utc().year(year.year).month(i).format('YYYY-MM'));

    const data = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear, // Ngày bắt đầu năm
            $lte: endOfYear,   // Ngày kết thúc năm
          },
        },
      },
      {
        $project: {
          orderItemsCount: { $size: '$orderItems' },  // Tính số lượng sản phẩm trong orderItems
          total_price: 1,
          delivery_fee: 1,
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',  // Lọc theo năm-tháng (ví dụ: 2024-01)
              date: '$createdAt', // Trường `createdAt` của đơn hàng
            },
          },
          totalRevenue: { $sum: '$total_price' }, // Tính tổng giá trị đơn hàng (total_price)
          totalDeliveryFee: { $sum: '$delivery_fee' }, // Tính tổng phí vận chuyển (delivery_fee)
          totalProductsSell: { $sum: '$orderItemsCount' }, // Tính tổng số sản phẩm
        },
      },
      {
        $sort: { _id: 1 }, // Sắp xếp kết quả theo thời gian (từ cũ đến mới)
      },
    ]).exec();

    // Xử lý điền 0 cho các tháng thiếu
    const result = months.map(month => {
      const found = data.find(d => d._id === month);
      return {
        title: month,
        totalRevenue: found?.totalRevenue || 0,
        totalDeliveryFee: found?.totalDeliveryFee || 0,
        totalProductsSell: found?.totalProductsSell || 0,
      };
    });

    return result;
  }

  async getRevenueByRange(start: string, end: string, groupBy: 'daily' | 'monthly' | 'yearly') {
    dayjs.extend(utc);

    // Xử lý thời gian bắt đầu và kết thúc
    const startDate = dayjs(start).utc().startOf('day').toDate();
    const endDate = dayjs(end).utc().endOf('day').toDate();

    // Xác định định dạng và danh sách các khoảng thời gian
    let format: string;
    let periods: string[];

    if (groupBy === 'daily') {
      format = '%Y-%m-%d'; // Lọc theo ngày
      const days = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
      periods = Array.from({ length: days }, (_, i) =>
        dayjs(start).add(i, 'day').format('YYYY-MM-DD'), // Định dạng ngày
      );
    } else if (groupBy === 'monthly') {
      format = '%Y-%m'; // Lọc theo tháng
      const months = dayjs(endDate).diff(dayjs(startDate), 'month') + 1;
      periods = Array.from({ length: months }, (_, i) =>
        dayjs(start).add(i, 'month').format('YYYY-MM'), // Định dạng tháng
      );
    } else if (groupBy === 'yearly') {
      format = '%Y-%m'; // Lọc theo năm
      const years = dayjs(endDate).diff(dayjs(startDate), 'year') + 1;
      periods = Array.from({ length: years }, (_, i) =>
        dayjs(start).add(i, 'year').format('YYYY'), // Định dạng năm
      );
    } else {
      throw new BadRequestException('Invalid groupBy value. Must be daily, monthly, or yearly.');
    }

    // Lấy dữ liệu từ MongoDB
    const data = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $project: {
          orderItemsCount: { $size: '$orderItems' }, // Đếm số lượng sản phẩm
          total_price: 1,
          delivery_fee: 1,
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format, date: '$createdAt' },
          },
          totalRevenue: { $sum: '$total_price' },
          totalDeliveryFee: { $sum: '$delivery_fee' },
          totalProductsSell: { $sum: '$orderItemsCount' },
        },
      },
      {
        $sort: { _id: 1 }, // Sắp xếp theo thời gian
      },
    ]).exec();

    // Điền dữ liệu mặc định cho các khoảng thời gian không có dữ liệu
    const result = periods.map(period => {
      const found = data.find(d => d._id === period);
      return {
        title: period,
        totalRevenue: found?.totalRevenue || 0,
        totalDeliveryFee: found?.totalDeliveryFee || 0,
        totalProductsSell: found?.totalProductsSell || 0,
      };
    });

    return result;
  }


}
