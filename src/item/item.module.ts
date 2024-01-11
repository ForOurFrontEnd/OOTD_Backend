import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entity/item.entity';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { UserService } from 'src/member/user/user.service';
import { UserModule } from 'src/member/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    UserModule
  ],
  controllers: [ItemController],
  providers: [ItemService,UserService],
  exports: [TypeOrmModule, ItemService],
})
export class ItemModule {}
