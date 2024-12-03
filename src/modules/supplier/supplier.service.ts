import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Schema, Types } from 'mongoose';
import { Supplier, SupplierDocument } from '@/modules/supplier/entities/supplier.entity';
import { User } from '@/modules/users/entities/user.entity';
import { UsersModule } from '@/modules/users/users.module';
import { SetActiveSupplierDto } from '@/modules/supplier/dto/set-active-supplier.dto';
import { ProductService } from '@/modules/product/product.service';
import { CreateProductFromSupplierDto } from '@/modules/supplier/dto/add-product.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name) private readonly supplierModel: Model<SupplierDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UsersModule>,
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
}
