import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UsersModule } from '@/modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { TransformInterceptor } from '@/core/transform.interceptor';
import { CategoryModule } from '@/modules/category/category.module';
import { SubcategoryModule } from '@/modules/subcategory/subcategory.module';
import { ProductModule } from '@/modules/product/product.module';
import { CommentModule } from '@/modules/comment/comment.module';
import { OrderModule } from '@/modules/order/order.module';
import { OrderItemModule } from '@/modules/order_item/order_item.module';
import { Supplier } from '@/modules/supplier/entities/supplier.entity';
import { SupplierModule } from '@/modules/supplier/supplier.module';
import { StatsModule } from '@/modules/stats/stats.module';
import { VourcherModule } from '@/modules/vourcher/vourcher.module';

@Module({
  imports: [
    UsersModule,
    CategoryModule,
    SubcategoryModule,
    ProductModule,
    CommentModule,
    OrderModule,
    OrderItemModule,
    SupplierModule,
    StatsModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        template: {
          dir: path.join(process.cwd(), 'src', 'mail', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    VourcherModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {
}
