import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import mongoose, { Model } from 'mongoose';
import { Product, ProductDocument } from '@/modules/product/entities/product.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Subcategory, SubcategoryDocument } from '@/modules/subcategory/entities/subcategory.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(Subcategory.name) private subcategoryModel: Model<SubcategoryDocument>,
  ) {
  }

  async create(createProductDto: CreateProductDto) {
    const { title, base_price, subcategory, discount, describe, options } = createProductDto;

    const checkSubcategory = await this.subcategoryModel
      .findOne({ '_id': { $in: subcategory } })
      .exec();
    if (!checkSubcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    const product = await this.productModel.create({
      title, base_price, subcategory, discount, describe, options,
    });

    console.log(product);
    return product;
  }

  async findAll(page: number, limit: number, sort: string, search: string) {
    const skip = (page - 1) * limit;

    const sortObject = this.parseSortParam(sort);
    if (Object.keys(sortObject).length === 0) {
      sortObject['createdAt'] = -1;
    }

    const filter: any = search
      ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ],
      }
      : {};

    const pipeline = [
      { $match: filter },
      {
        $project: {
          name: 1,
          price: 1,
          category: 1,
          stock: 1,
          options: 1,
          rate: 1,
          ratings: 1,
          imgs: 1,
          des: 1,
          spec: 1,
        },
      },
      {
        $addFields: {
          stock: { $ifNull: ['$stock', { $sum: '$options.stock' }] },
        },
      },
      { $skip: skip },
      { $limit: limit },
      { $sort: sortObject },
    ];

    const [products, total] = await Promise.all([
      this.productModel.aggregate(pipeline).exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

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


  async findOne(id: string) {
    if (id === undefined) {
      throw new BadRequestException('ID is empty');
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const product = await this.productModel.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }


  async update(updateProductDto: UpdateProductDto) {
    return await this.productModel.updateOne({ _id: updateProductDto._id }, { ...updateProductDto });
  }

  async remove(id: string) {
    if (id === undefined) {
      throw new BadRequestException('ID is empty');
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const category = await this.productModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return await this.productModel.findByIdAndDelete(id);
  }

  findRandomProduct() {
    return this.productModel.aggregate([
      { $sample: { size: 1 } }, // Lấy ngẫu nhiên 1 sản phẩm
    ]);
  }

  async getTotalProductAndStock(): Promise<{ totalProducts: number; totalStock: number }> {
    const result = await this.productModel.aggregate([
      {
        $facet: {
          totalProducts: [{ $count: 'count' }],
          totalStock: [
            {
              $project: {
                stock: 1,
                options: 1,
              },
            },
            {
              $addFields: {
                stock: {
                  $ifNull: [
                    '$stock',
                    {
                      $sum: {
                        $map: {
                          input: '$options',
                          as: 'option',
                          in: '$$option.stock',
                        },
                      },
                    },
                  ],
                },
              },
            },
            { $group: { _id: null, totalStock: { $sum: '$stock' } } },
          ],
        },
      },
      {
        $project: {
          totalProducts: { $arrayElemAt: ['$totalProducts.count', 0] },
          totalStock: { $arrayElemAt: ['$totalStock.totalStock', 0] },
        },
      },
    ]);

    const totalProducts = result[0]?.totalProducts || 0;
    const totalStock = result[0]?.totalStock || 0;

    return { totalProducts, totalStock };
  }
}
