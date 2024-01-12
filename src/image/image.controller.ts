import { Controller, Get, Headers, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { diskStorage } from 'multer';
import * as express from 'express';
import { UserService } from 'src/member/user/user.service';
import * as fs from 'fs/promises';


@Controller('image')
export class ImageController {
  constructor(
    private imageService: ImageService,
    private userService: UserService
  ) {}
  
  @Post('upload')
  @UseInterceptors(FileInterceptor('images', { 
    storage: diskStorage({
      destination: './uploads',
      filename: async (req, file, cb) => {
        if (!file) {
          cb(new Error('No file provided'), null);
          return;
        }

        const fileType = file.mimetype?.replace(/^image\//, '') || 'png';
        const fileName = file.fieldname + '_' + Date.now() + '.' + fileType;
        cb(null, fileName);

        req['fileName'] = fileName;
        req['bufferData'] = Buffer.from([]);

        req.on('data', (chunk) => {
          req['bufferData'] = Buffer.concat([req['bufferData'], chunk]);
        });
      },
    })
  }))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: express.Request,
    @Headers('cookie') cookie: string, 
  ) {
    const fileName = req['fileName'];
    const bufferData: Buffer = req['bufferData'];
    if (cookie) {
      const token = cookie.split('Authorization=Bearer%20')[1];
      const user = await this.userService.decodeToken(token);
      const email = await user.user.email

      if (bufferData && fileName) {
        const existingPhotoPath = await this.userService.getProfilePhotoPath(email);

        if (existingPhotoPath && existingPhotoPath.startsWith('http://localhost:4000/')) {
        const relativePath = existingPhotoPath.replace('http://localhost:4000/uploads/', './uploads/');
        
        await fs.unlink(relativePath);
      }

        await this.imageService.uploadImage(file, bufferData);
        await this.userService.changeProfileUrl(email, fileName);
        return { fileName };
      } else {
        return { error: 'BufferData or fileName is not available' };
      }
    }
  }
}

