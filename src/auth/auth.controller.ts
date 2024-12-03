import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '@/auth/passport/local-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customize';
import { CodeAuthDto, CreateAuthDto, ResetPasswordDto } from '@/auth/dto/create-auth.dto';
import e from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('login')
  @Public()
  @ResponseMessage('Fetch login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto);
  }

  @Post('check-code')
  @Public()
  async checkCode(@Body() checkCodeDto: CodeAuthDto) {
    return this.authService.checkCode(checkCodeDto);
  }

  @Post('retry-active')
  @Public()
  async retryActive(@Body('email') email: string) {
    return this.authService.retryActive(email);
  }

  @Post('forgot-password')
  @Public()
  async fotgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @Public()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

}
