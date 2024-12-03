import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentEntity } from '@/modules/comment/entities/comment.entity';
import { UsersModule } from '@/modules/users/users.module';
import { ProductModule } from '@/modules/product/product.module';
import {Comment} from '@/modules/comment/entities/comment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentEntity }]),
    UsersModule,
    ProductModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {
}
