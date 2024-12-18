import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Supplier, SupplierDocument } from '@/modules/supplier/entities/supplier.entity';
import { User, UserDocument } from '@/modules/users/entities/user.entity';
import { SetActiveSupplierDto } from '@/modules/supplier/dto/set-active-supplier.dto';
import { ProductService } from '@/modules/product/product.service';
import { CreateProductFromSupplierDto } from '@/modules/supplier/dto/add-product.dto';
import { Product, ProductDocument } from '@/modules/product/entities/product.entity';
import dayjs from 'dayjs';
import { Order, OrderDocument } from '@/modules/order/entities/order.entity';
import utc from 'dayjs/plugin/utc';
import { OrderItemDocument, OrderItems } from '@/modules/order_item/entities/order_item.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name) private readonly supplierModel: Model<SupplierDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(OrderItems.name) private readonly orderItemModel: Model<OrderItemDocument>,
    private readonly productService: ProductService,
  ) {
  }

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const user = await this.userModel.findById(createSupplierDto.user_id);
    if (!user) {
      throw new NotFoundException('User not found with the provided user_id');
    }

    const existingSupplier = await this.supplierModel.findOne({ user_id: createSupplierDto.user_id });
    if (existingSupplier) {
      throw new BadRequestException('A supplier already exists for this user_id');
    }

    const supplier = new this.supplierModel(createSupplierDto);
    return supplier.save();
  }

  findAll() {
    return `This action returns all supplier`;
  }

  findOne(id: number) {
    return `This action returns a #${id} supplier`;
  }

  update(id: number, updateSupplierDto: UpdateSupplierDto) {
    return `This action updates a #${id} supplier`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplier`;
  }

  async setActive(setActiveSupplierDto: SetActiveSupplierDto): Promise<Supplier> {
    const { supplier_id, isActive } = setActiveSupplierDto;

    const supplier = await this.supplierModel.findById(supplier_id);
    if (!supplier) {
      throw new NotFoundException('Supplier not found with the provided ID');
    }

    supplier.isActive = isActive;
    return supplier.save();
  }

  async createProductFromSupplier(createProductFromSupplierDto: CreateProductFromSupplierDto) {
    const { supplier_id, product } = createProductFromSupplierDto;

    // Kiểm tra xem nhà cung cấp có tồn tại không
    const supplier = await this.supplierModel.findById(supplier_id);
    if (!supplier) {
      throw new NotFoundException('Supplier not found with the provided ID');
    }

    const createProduct = await this.productService.create(product);


    createProduct.supplier_id = (supplier._id as unknown) as mongoose.Schema.Types.ObjectId;
    await createProduct.save();

    supplier.products.push(createProduct._id as unknown as mongoose.Schema.Types.ObjectId);

    await supplier.save();

    return product;
  }

  async getProductsBySupplier(
    user_id: string,
    page: number,
    limit: number,
    sort: string,
    search: string,
  ) {
    const skip = (page - 1) * limit;

    // Parse tham số sort
    const sortObject = this.parseSortParam(sort);
    if (Object.keys(sortObject).length === 0) {
      sortObject['createdAt'] = -1; // Sắp xếp theo ngày tạo giảm dần nếu không có tham số sort
    }

    // Tìm nhà cung cấp theo user_id
    const supplier = await this.supplierModel
      .findOne({ user_id: new mongoose.Types.ObjectId(user_id) })
      .exec();

    if (!supplier) {
      throw new BadRequestException('Supplier not found');
    }

    // Tạo filter nếu có search
    const filter: any = search
      ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ],
        _id: { $in: supplier.products }, // Lọc trong danh sách sản phẩm thuộc nhà cung cấp
      }
      : {
        _id: { $in: supplier.products }, // Lọc sản phẩm thuộc nhà cung cấp
      };

    // Tính tổng sản phẩm và thực hiện truy vấn với phân trang
    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    // Tính số trang
    const totalPages = Math.ceil(total / limit);

    return {
      products,
      total,
      totalPages,
      currentPage: page,
      limit,
    };
  }

  private parseSortParam(sort: string): Record<string, 1 | -1> {
    const sortObject: Record<string, 1 | -1> = {};

    if (sort) {
      const sortPairs = sort.split('&');

      for (const pair of sortPairs) {
        const [field, direction] = pair.split(',');
        if (field && (direction === 'asc' || direction === 'desc')) {
          sortObject[field] = direction === 'asc' ? 1 : -1;
        }
      }
    }

    return sortObject;
  }

  async getYearlyRevenueBySupplier(user_id, year) {
    dayjs.extend(utc);

    const startOfYear = dayjs().utc().year(year).startOf('year').toDate();
    const endOfYear = dayjs().utc().year(year).endOf('year').toDate();

    const supplier = await this.supplierModel.findOne({ user_id }).select('products');

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    const objectIdSupplierProducts = supplier.products.map((productId) =>
      new mongoose.Types.ObjectId(productId + ''),
    );

    console.log('Product id: ', objectIdSupplierProducts);

    const data = await this.orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lte: endOfYear,
          },
        },
      },
      {
        $lookup: {
          from: 'order_items',
          localField: '_id',
          foreignField: 'order_id',
          as: 'orderItems',
        },
      },
      {
        $unwind: '$orderItems',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $project: {
          'orderItems.product_id': 1,  // Log product_id của orderItems
          'orderItems.quantity': 1,    // Log quantity của orderItems
          'orderItems.total_price': 1, // Log total_price của orderItems
          'product._id': 1,           // Log _id của product
          'product.name': 1,          // Log tên của product (nếu cần)
        },
      },
      // Kiểm tra xem `product_id` có trong `objectIdSupplierProducts` không
      {
        $match: {
          'product._id': { $in: objectIdSupplierProducts },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$createdAt',
            },
          },
          totalRevenue: {
            $sum: { $multiply: ['$orderItems.quantity', '$orderItems.total_price'] },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const months = Array.from({ length: 12 }, (_, i) =>
      dayjs().utc().year(year).month(i).format('YYYY-MM'),
    );
    console.log('data:', data);

    const result = months.map(month => {
      const found = data.find(d => d._id === month);
      return {
        month,
        totalRevenue: found?.totalRevenue || 0,
      };
    });

    console.log(result);
    return result;
  }

  async getAllOrderItemsBySupplier(user_id: string) {
    // Tìm nhà cung cấp theo ID và lấy product_ids
    const supplier = await this.supplierModel.findOne({user_id});
    console.log(supplier);

    if (!supplier) {
      throw new BadRequestException('Supplier not found');
    }

    // Lấy tất cả OrderItems có product_id nằm trong product_ids của nhà cung cấp
    const orderItems = await this.orderItemModel
      .find({ product_id: { $in: supplier.products } })
      .populate('product_id', 'name');

    return orderItems;
  }

}
