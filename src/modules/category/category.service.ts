import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '@/modules/category/entities/category.entity';
import { Subcategory } from '@/modules/subcategory/entities/subcategory.entity';
import mongoose, { Model } from 'mongoose';
import { Product } from '@/modules/product/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { title, subcategory } = createCategoryDto;

    const objectIds = subcategory ? subcategory.map(id => new mongoose.Types.ObjectId(id)) : [];

    if (subcategory && subcategory.length > 0) {
      const subcategories = await this.subcategoryModel.find({
        '_id': { $in: objectIds },
      });

      if (subcategories.length !== objectIds.length) {
        throw new BadRequestException('Some subcategories not found');
      }
    }

    const category = await this.categoryModel.create({
      title: title,
      subcategory: objectIds,
    });

    return category;
  }


  async findAll() {
    return this.categoryModel.find().select('title');
  }

  async getAllProductsByCategory(title: string, sort: string) {
    // Tìm category theo title
    const category = await this.categoryModel.findOne({ title }).exec();
    if (!category) {
      throw new Error('Category not found');
    }

    // Tìm tất cả các subcategory của category này
    const subcategories = await this.subcategoryModel
      .find({ _id: { $in: category.subcategory } })
      .exec();

    // Lấy tất cả product IDs từ các subcategories
    const productIds = subcategories.flatMap((subcategory) => subcategory.product);

    // Lấy tất cả sản phẩm từ các productIds (dùng lean để tránh lỗi)
    let products = await this.productModel
      .find({ _id: { $in: productIds } })
      .lean()
      .exec();

    // Sắp xếp sản phẩm theo yêu cầu
    switch (sort) {
      case"0": // Price Low to High
         return products = products.sort((a, b) => a.price - b.price);
      case "1": // Price High to Low
        return products = products.sort((a, b) => b.price - a.price);
      case "2": // A  Z
        return products = products.sort((a, b) => a.name.localeCompare(b.name));
      case "3": // Z - A
        return products = products.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return products;
    }

  }


  async findBySubcategory(title: string, subcategoryTitle: string, sort: string) {
    const result = await this.categoryModel.aggregate([
      // 1. Tìm Category theo title
      { $match: { title } },

      // 2. Kết hợp Category với Subcategory (lookup)
      {
        $lookup: {
          from: 'subcategories', // Tên collection Subcategory
          localField: 'subcategory', // Trường chứa các ObjectId của Subcategory trong Category
          foreignField: '_id', // Trường _id trong Subcategory
          as: 'subcategories', // Kết quả lookup sẽ được lưu trong subcategories
        },
      },

      // 3. Lọc Subcategory theo title
      {
        $unwind: '$subcategories', // Tách các Subcategory ra khỏi mảng
      },
      {
        $match: { 'subcategories.title': subcategoryTitle }, // Lọc theo title của Subcategory
      },

      // 4. Kết hợp với Product (lookup)
      {
        $lookup: {
          from: 'products', // Tên collection Product
          localField: 'subcategories.product', // Trường product trong Subcategory chứa các ObjectId của Product
          foreignField: '_id', // Trường _id trong Product
          as: 'products', // Kết quả lookup sẽ được lưu trong products
        },
      },

      // 5. Trả về chỉ các trường cần thiết, nếu muốn
      {
        $project: {
          title: 1, // Trả về title của Category
          'subcategories.title': 1, // Trả về title của Subcategory
          products: 1, // Trả về các sản phẩm
        },
      },
    ]);

    if (result.length === 0) {
      throw new Error('Category or Subcategory not found');
    }

    var final;

    return result[0].products;
  }


  async findOne(title: string) {
    const data = await this.categoryModel.aggregate([
      {
        $match: {
          title: title,
        },
      },
      {
        $lookup: {
          from: 'subcategories',        // Tên collection con của bạn
          localField: 'subcategory',     // Trường chứa các ObjectId trong Category
          foreignField: '_id',           // Trường _id của Subcategory
          as: 'subcategoriesDetails',    // Tạo mảng mới chứa thông tin của các subcategory
        },
      },
      {
        $unwind: '$subcategoriesDetails',   // Unwind subcategories để xử lý từng subcategory
      },
      {
        $addFields: {
          subcategoryProductCount: {
            $size: '$subcategoriesDetails.product',  // Đếm số lượng sản phẩm trong mảng product
          },
        },
      },
      {
        $sort: { 'subcategoryProductCount': -1 }, // Sắp xếp theo số lượng sản phẩm giảm dần
      },
      {
        $group: {
          _id: '$_id',
          categoryName: { $first: '$title' },
          subcategories: {
            $push: {               // Gộp lại subcategories
              title: '$subcategoriesDetails.title',  // Chỉ lấy title
            },
          },
        },
      },
    ]);

    return data;
  }


  async update(updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryModel.updateOne({ _id: updateCategoryDto._id }, { ...updateCategoryDto });
  }

  async remove(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return await this.categoryModel.findByIdAndDelete(id);
  }
}
