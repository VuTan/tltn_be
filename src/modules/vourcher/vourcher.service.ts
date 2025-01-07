import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Voucher, VoucherDocument } from '@/modules/vourcher/entities/voucher.entity';
import { CreateVoucherDto } from '@/modules/vourcher/dto/create-voucher.dto';

@Injectable()
export class VourcherService {
  constructor(
    @InjectModel(Voucher.name)
    private voucherModel: Model<Voucher>,
  ) {
  }

  async createVoucher(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
    return (await this.voucherModel.create(createVoucherDto));
  }

  async findOne(code: string): Promise<VoucherDocument | null> {
    return this.voucherModel.findOne({ code }).exec();
  }

  async applyVoucher(code: string, totalPrice: number, productIds: string[] = [], userId?: string) {
    const voucher = await this.findOne(code);

    if (!voucher) {
      return { isValid: false, message: 'Mã giảm giá không tồn tại.' };
    }

    if (!voucher.isActive) {
      return { isValid: false, message: 'Mã giảm giá đã bị vô hiệu hóa.' };
    }

    const now = new Date();
    if (now < voucher.validFrom || now > voucher.validUntil) {
      return { isValid: false, message: 'Mã giảm giá đã hết hạn hoặc chưa có hiệu lực.' };
    }

    if (voucher.applicableProducts && voucher.applicableProducts.length > 0) {
      const hasApplicableProduct = productIds.some((productId) =>
        voucher.applicableProducts.some(applicableProductId => applicableProductId.toString() === productId)
      );
      if (!hasApplicableProduct) {
        return {
          isValid: false,
          message: 'Mã giảm giá không áp dụng cho các sản phẩm trong giỏ hàng của bạn.',
        };
      }
    }

    if (voucher.minimumOrderValue && totalPrice < voucher.minimumOrderValue) {
      return {
        isValid: false,
        message: `Đơn hàng chưa đạt giá trị tối thiểu ${voucher.minimumOrderValue}.`,
      };
    }

    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return { isValid: false, message: 'Mã giảm giá đã hết lượt sử dụng.' };
    }

    if (userId && voucher.usedUsers && voucher.usedUsers.includes(userId as any)) {
      return { isValid: false, message: 'Bạn đã sử dụng mã giảm giá này rồi.' };
    }

    if (voucher.applicableProducts && voucher.applicableProducts.length > 0) {
      const hasApplicableProduct = productIds.some((productId) =>
        voucher.applicableProducts.some(applicableProductId => applicableProductId.toString() === productId)
      );
      if (!hasApplicableProduct) {
        return {
          isValid: false,
          message: 'Mã giảm giá không áp dụng cho các sản phẩm trong giỏ hàng của bạn.',
        };
      }
    }

    let discountAmount = 0;
    if (voucher.discountType === 'percentage') {
      discountAmount = (totalPrice * voucher.discountValue) / 100;
      if (voucher.maximumDiscountAmount && discountAmount > voucher.maximumDiscountAmount) {
        discountAmount = voucher.maximumDiscountAmount;
      }
    } else if (voucher.discountType === 'fixed') {
      discountAmount = voucher.discountValue;
    }

    const finalPrice = totalPrice - discountAmount;

    return {
      isValid: true,
      discountAmount,
      finalPrice,
      voucher,
    };
  }

  async useVoucher(voucher: VoucherDocument, userId?: string): Promise<void> {
    await this.voucherModel.findByIdAndUpdate(voucher._id, {
      $inc: { usedCount: 1 },
      ...(userId ? { $push: { usedUsers: userId } } : {}),
    });
  }

}
