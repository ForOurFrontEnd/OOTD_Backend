import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { PhoneService } from '../phone/phone.service';

@Controller('auth')
export class AuthController {
  private verificationCodes: Record<string, { code: number; createdAt: Date }> = {};
  private verificationPhoneCodes: Record<string, { code: number; createdAt: Date }> = {};

  constructor(
    private readonly emailService: EmailService,
    private readonly phoneService: PhoneService,
    private readonly userService: UserService
  ) { }

  @Post('send-verification-email')
  async sendVerificationEmail(@Body() body: { email: string }) {
    const email = body.email;
    const isEmailExist = await this.userService.findByEmail(email)
    const isKakaoEmailExist = await this.userService.findByEmail(email)
    const isGoogleEmailExist = await this.userService.findByEmail(email)

    if (!isEmailExist || !isKakaoEmailExist || !isGoogleEmailExist) {
      const verificationCode = this.generateRandomCode();
      const createdAt = new Date();

      this.verificationCodes[email] = { code: verificationCode, createdAt };
      await this.emailService.sendVerificationEmail(email, verificationCode);

      return {
        message: '이메일이 전송되었습니다.',
        success: true,
      };
    } else {
      return {
        message: '이메일이 이미 사용중입니다.',
        success: false,
      };
    }
  }

  @Post('verify-email')
  verifyEmail(@Body() body: { email: string; code: number }) {
    const email = body.email;
    const code = Number(body.code);
    const storedCode = this.verificationCodes[email];

    if (storedCode && storedCode.code === +code) {
      const currentTime = new Date();
      const timeDifference = currentTime.getTime() - storedCode.createdAt.getTime();
      const expirationTime = 3 * 60 * 1000;

      if (timeDifference <= expirationTime) {
        return {
          message: '이메일 인증이 완료되었습니다.',
          success: true,
        };
      } else {
        return {
          message: '이메일 인증 시간이 만료되었습니다.',
          success: false,
        };
      }
    } else {
      return {
        message: '이메일 인증 코드가 일치하지 않습니다.',
        success: false,
      };
    }
  }

  private generateRandomCode(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
