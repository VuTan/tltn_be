import { BadRequestException, Body, Controller, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { VourcherService } from './vourcher.service';
import { CreateVoucherDto } from '@/modules/vourcher/dto/create-voucher.dto';

@Controller('vourcher')
export class VourcherController {
  constructor(private readonly vourcherService: VourcherService) {
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createVoucher(@Body() createVoucherDto: CreateVoucherDto) {
    return this.vourcherService.createVoucher(createVoucherDto);
  }

  @Post('apply-voucher')
  async applyVoucher(
    @Req() req,
    @Body('voucherCode') voucherCode: string,
    @Body('totalPrice') totalPrice: number,
    @Body('productIds') productIds: string[],

  ) {
    const userId = req.user?.id;
    const result = await this.vourcherService.applyVoucher(
      voucherCode,
      totalPrice,
      productIds,
      userId,
    );

    if (!result.isValid) {
      throw new BadRequestException(result.message);
    }

    return {
      message: 'Áp dụng mã giảm giá thành công!',
      discountAmount: result.discountAmount,
      finalPrice: result.finalPrice,
    };
  }

}
