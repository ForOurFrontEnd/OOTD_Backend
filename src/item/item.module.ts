import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entity/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
  ]
})
export class ItemModule {}
