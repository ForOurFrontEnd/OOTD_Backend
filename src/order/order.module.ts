import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { UserModule } from 'src/member/user/user.module';
import { ItemModule } from 'src/item/item.module';
import { UserService } from 'src/member/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    UserModule,
    ItemModule
  ],
  providers: [UserService],
  exports: [TypeOrmModule],
  
})
export class OrderModule {}
