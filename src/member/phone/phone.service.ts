import { Injectable } from '@nestjs/common';
import CoolsmsMessageService from 'coolsms-node-sdk';

@Injectable()
export class PhoneService {
  private transporter;
  constructor() {
  }

  async sendVerificationPhoneNumber(phone_number: string, code: number): Promise<void> {
    const messageService = new CoolsmsMessageService("NCSJSLKB8BZOI12Y", "4PLYBDTJIBXRC0JCJDUS6QZXFFU1MXA2");


  }
}
