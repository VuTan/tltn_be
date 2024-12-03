import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { CommentModule } from '@/modules/comment/comment.module';
import { Product, ProductDocument } from '@/modules/product/entities/product.entity';
import { User, UserDocument } from '@/modules/users/entities/user.entity';
import { Comment } from '@/modules/comment/entities/comment.entity';


@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentModule>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {
  }

  async create(createCommentDto: CreateCommentDto) {
    const { user_id, product_id, time, content, rate, image } = createCommentDto;

    //check useras
    const user = await this.userModel.findOne({ _id: user_id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //check product
    const product = await this.productModel.findById({ _id: product_id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    console.log(product.comments);
    if (!Array.isArray(product.comments)) {
      product.comments = [];
    }

    //create comment
    const newComment = await this.commentModel.create({
      ...createCommentDto,
    });

    product.comments.push(newComment._id as Schema.Types.ObjectId);
    await product.save();


    console.log(product.comments);
  }


  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
