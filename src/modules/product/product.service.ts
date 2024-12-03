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

  //to do
  findAll() {
    return this.productModel.find();
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
      { $sample: { size: 1 } } // Lấy ngẫu nhiên 1 sản phẩm
    ]);
  }

}
