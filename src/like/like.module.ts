import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entity/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
  ]
})
export class LikeModule {}
