import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserEntity } from '@/modules/users/entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserEntity }]),
    ScheduleModule.forRoot(),
  ],
  controllers: [UsersController],
  providers: [UsersService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {
}
