import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subcategory } from '@/modules/subcategory/entities/subcategory.entity';
import mongoose, { Model, Types } from 'mongoose';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
  ) {
  }

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    const { title, products } = createSubcategoryDto;
    console.log(title);
    const subcategory = await this.subcategoryModel.create({
      title,
      products,
    });
    console.log(subcategory);
    return subcategory;
  }

  findAll() {
    return this.subcategoryModel
      .find()
      .select('-__v');
  }

  findOne(id: string) {
    if (id === undefined) {
      throw new BadRequestException('ID is empty');
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const subcategory = this.subcategoryModel
      .findOne({ _id: id })
      .select('title')
      .populate('products');

    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    return subcategory;
  }

  async update(updateSubcategoryDto: UpdateSubcategoryDto) {
    return await this.subcategoryModel.updateOne({ _id: updateSubcategoryDto._id }, { ...updateSubcategoryDto });
  }

  async addProduct(subcategoryId: string, productId: string) {
    const updatedSubcategory = await this.subcategoryModel.findByIdAndUpdate(
      subcategoryId,
      { $addToSet: { products: new Types.ObjectId(productId) } },
      { new: true },
    );

    if (!updatedSubcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    return updatedSubcategory;
  }

  async remove(id: string) {
    if (id === undefined) {
      throw new BadRequestException('ID is empty');
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const category = await this.subcategoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Subcategory with id ${id} not found`);
    }

    return await this.subcategoryModel.findByIdAndDelete(id);
  }
}
