import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPasswordHelper } from '@/helper/utils';
import { User } from '@/modules/users/entities/user.entity';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CodeAuthDto, CreateAuthDto, ResetPasswordDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {
  }


  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email: email });
    return user ? true : false;
  };

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address } = createUserDto;

    //check Email
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(`Email ${email} is Exist`);
    }

    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({ name, email, password: hashPassword, phone, address });
    return { _id: user._id };
  }

  async findAll(page: number, limit: number, sort: string, search: string) {
    const skip = (page - 1) * limit;

    const sortObject = this.parseSortParam(sort);

    // Tạo query filter cho tìm kiếm
    const filter: any = search
      ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
      : {};
    console.log(filter);

    const [result, total] = await Promise.all([
      this.userModel
        .find(filter) // Áp dụng bộ lọc tìm kiếm
        .skip(skip)
        .limit(limit)
        .sort(sortObject)
        .exec(),
      this.userModel.countDocuments(filter).exec(), // Đếm tổng số bản ghi khớp với tìm kiếm
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users: result,
      total,
      totalPages,
      currentPage: page,
      limit,
    };
  }

  private parseSortParam(sort: string): Record<string, 1 | -1> {

    const sortObject: Record<string, 1 | -1> = {};

    if (sort) {
      const sortPairs = sort.split('&'); // Tách các cặp bằng dấu `&`

      for (const pair of sortPairs) {
        const [field, direction] = pair.split(','); // Tách field và direction bằng dấu `,`
        if (field && (direction === 'asc' || direction === 'desc')) {
          sortObject[field] = direction === 'asc' ? 1 : -1;
        }
      }
    }

    return sortObject;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    const res = await this.userModel.findOne({ email });
    console.log(res);
    return res;
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto });
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return this.userModel.deleteOne({ _id });
    } else {
      throw new BadRequestException('Id is Invalid');
    }
  }

  async handleActive(checkCodeDto: CodeAuthDto) {
    const user = await this.userModel.findById(checkCodeDto._id);

    if (!user) {
      throw new BadRequestException('The account register is invalid');
    }

    if (user.codeId !== checkCodeDto.code) {
      throw new BadRequestException('Invalid code');
    }

    //check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      //valid => update user
      await this.userModel.updateOne({ _id: checkCodeDto._id }, {
        isActive: true,
      });
      return true;
    } else {
      throw new BadRequestException('The code is expried');
    }
  }

  async retryActive(email: string) {
    //check email
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Email is invalid');
    }
    if (user.isActive) {
      throw new BadRequestException('Email is actived');
    }

    //send Email
    const codeId = uuidv4();

    //update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes'),
    });

    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Activate your account', // Subject line
      template: 'register',
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId,
        timeExpires: '10 minutes',
      },
    });
    return { _id: user._id };
  }

  async forgotPassword(email: string) {
    //check email
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Email is invalid');
    }

    //send Email
    const codeId = uuidv4();

    //update user
    await user.updateOne({
      resetPasswordId: codeId,
      resetPasswordExpired: dayjs().add(5, 'minutes'),
    });

    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Reset your account', // Subject line
      template: 'resetPassword',
      context: {
        name: user?.name ?? user.email,
        link: 'http://localhost:3000/reset_password/' + codeId,
        timeExpires: '10 minutes',
      },
    });
    return { _id: user._id };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('New Password and Confirm Password not math');
    }

    //check email
    const user = await this.userModel.findOne({ resetPasswordId: resetPasswordDto._id });

    if (!user) {
      throw new BadRequestException('Code is invalid');
    }

    const isBeforeCheck = dayjs().isBefore(user.resetPasswordExpired);

    if (isBeforeCheck) {
      const newPassword = await hashPasswordHelper(resetPasswordDto.newPassword);
      await user.updateOne({
        password: newPassword,
        resetPasswordExpired: dayjs(),
      });
      return true;
    } else {
      throw new BadRequestException('The code is expried');
    }
    return false;
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password, repassword, phone, address } = registerDto;

    if (password !== repassword) {
      throw new BadRequestException('Passwords and repassword do not match');
    }

    //check Email
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(`Email ${email} is Exist`);
    }

    //hash password
    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      isActive: false,
      codeId: uuidv4(),
      codeExpired: dayjs().add(10, 'minute'),
    });

    //send mail
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Activate your account', // Subject line
      template: 'register',
      context: {
        name: user?.name ?? user.email,
        activationCode: user.codeId,
        timeExpires: '10 minutes',
      },
    });

    return { _id: user._id };
  }

  findRandomUser() {
    return this.userModel.aggregate([
      { $sample: { size: 1 } }, // Lấy ngẫu nhiên 1 sản phẩm
    ]);
  }
}
