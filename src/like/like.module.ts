import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entity/like.entity';
import { UserService } from 'src/member/user/user.service';
import { UserModule } from 'src/member/user/user.module';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    UserModule,
    ItemModule,
  ],
  providers: [UserService],
  exports: [TypeOrmModule],
})
export class LikeModule {}
