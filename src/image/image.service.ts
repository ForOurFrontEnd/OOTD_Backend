import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  async uploadImage(file: Express.Multer.File, buffer): Promise<string> {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    const filePath = path.join(uploadDir, file.originalname);
    const fileType = file.mimetype?.replace(/^image\//, '') || 'png';
    const fileName = file.fieldname + '_' + Date.now() + '.' + fileType;

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (buffer) {
      fs.writeFileSync(filePath, buffer);
      const imageUrl = `/uploads/${fileName}`;

      return imageUrl;
    } else {
      console.error('File buffer is undefined.');
      return null;
    }
  }
}
