import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from '@/helper/utils';
import { CodeAuthDto, CreateAuthDto, ResetPasswordDto } from '@/auth/dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
  }


  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (!user) return null;
    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) return null;
    return user;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id };
    return {
      user: {
        email: user.email,
        _id: user._id,
        name: user.name,
        role: user.role
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: CreateAuthDto) {
    return await this.usersService.handleRegister(registerDto);
  }

  async checkCode(checkCodeDto: CodeAuthDto) {
    return await this.usersService.handleActive(checkCodeDto);
  }

  async retryActive(email: string) {
    return await this.usersService.retryActive(email);
  }

  async forgotPassword(email: string) {
    return await this.usersService.forgotPassword(email);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return await this.usersService.resetPassword(resetPasswordDto);
  }

}