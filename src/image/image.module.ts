import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'; 
import { UserService } from 'src/member/user/user.service';
import { User } from 'src/member/user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + file.mimetype);
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.register({
      dest: './uploads',
      storage: storage,
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          console.log('error')
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  providers: [ImageService, UserService],
  controllers: [ImageController]
})
export class ImageModule {}
