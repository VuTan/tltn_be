import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { OrderItemDocument, OrderItems } from '@/modules/order_item/entities/order_item.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '@/modules/product/entities/product.entity';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectModel(OrderItems.name) private readonly orderItemModel: Model<OrderItemDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {
  }

  async create(createOrderItemDtos: CreateOrderItemDto[]): Promise<OrderItems[]> {
    let totalPrice = 0;
    const orderItems: OrderItems[] = [];

    for (const dto of createOrderItemDtos) {
      const product = await this.productModel.findById(dto.product_id);

      if (!product) {
        throw new Error(`Product with ID ${dto.product_id} does not exist.`);
      }

      const total_item_price = dto.quantity * product.base_price;

      // Tạo OrderItem
      const orderItem = new this.orderItemModel({
        ...dto,
        total_price: total_item_price,
        status: 'Wait for confirmation',
      });

      orderItems.push(orderItem);
    }

    await this.orderItemModel.insertMany(orderItems);
    return orderItems;
  }

  async getTotalQuantityAndPrice(): Promise<{ totalQuantity: number; totalPrice: number }> {
    const orderItems = await this.orderItemModel.aggregate([
      // Kết nối với bảng Product để lấy thông tin sản phẩm (chẳng hạn như tên và giá)
      {
        $lookup: {
          from: 'products',  // Tên collection trong MongoDB (có thể phải điều chỉnh)
          localField: 'product_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true },  // Tạo một bản ghi cho mỗi sản phẩm trong orderItem
      },
      {
        $group: {
          _id: null, // Không nhóm theo bất kỳ trường nào, lấy tất cả
          totalQuantity: { $sum: '$quantity' }, // Tổng số lượng sản phẩm
          totalPrice: { $sum: '$total_price' }, // Tổng giá trị sản phẩm
        },
      },
    ]);

    // Kiểm tra nếu không có kết quả
    if (orderItems.length === 0) {
      return { totalQuantity: 0, totalPrice: 0 };
    }

    return {
      totalQuantity: orderItems[0].totalQuantity,  // Trả về tổng số lượng
      totalPrice: orderItems[0].totalPrice,        // Trả về tổng giá trị
    };
  }

  findAll() {
    return `This action returns all orderItem`;
  }

  findOne(id: string) {
    return this.orderItemModel
      .findById(id)
      .populate({
        path: 'product_id',
        select: 'name imgs',
      });
  }

  async update(updateOrderItemDto: UpdateOrderItemDto) {
    const { _id, ...updateData } = updateOrderItemDto;

    const orderItem = await this.orderItemModel.findById(_id);
    if (!orderItem) {
      throw new NotFoundException(`OrderItem not found`);
    }

    try {
      const updatedOrderItem = await this.orderItemModel.findByIdAndUpdate(
        _id,
        updateData,
        { new: true, runValidators: true },
      );

      return updatedOrderItem;
    } catch (error) {
      throw new BadRequestException('Failed to update OrderItem', error.message);
    }
  }




  remove(id: number) {
    return `This action removes a #${id} orderItem`;
  }
}
