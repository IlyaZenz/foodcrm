import {BadRequestException, Injectable, PipeTransform} from '@nestjs/common'
import * as sharp from 'sharp'
import * as path from 'path'
import * as fs from 'fs'
import * as util from 'util'

export interface FileSharpPipeOptions {
  width: number
  height: number
}

@Injectable()
export class FileSharpPipe implements PipeTransform {
  private readonly params: FileSharpPipeOptions

  constructor(params: FileSharpPipeOptions) {
    this.params = params
  }

  async transform(image: Express.Multer.File): Promise<any> {
    const originalImagePath = image.path
    const originalExtension = path.extname(originalImagePath)
    const tempFilePath = path.join(path.dirname(originalImagePath), `temp${originalExtension}`)

    try {
      const imageHandle = sharp(originalImagePath)
        .resize(this.params.width, this.params.height, {fit: sharp.fit.cover})

      switch (image.mimetype) {
        case 'image/jpeg':
        case 'image/jpg':
          imageHandle.jpeg({ quality: 80, mozjpeg: true })
          break
        case 'image/png':
          imageHandle.png({ compressionLevel: 9 })
          break
      }

      await imageHandle.toFile(tempFilePath)


//      await sharp(originalImagePath)
//        .resize(this.params.width, this.params.height, {fit: sharp.fit.cover})
//        .toFile(tempFilePath)

      // Удалить исходный файл
      await util.promisify(fs.unlink)(originalImagePath)
      // Переместить временный файл обратно на место исходного
      await util.promisify(fs.rename)(tempFilePath, originalImagePath)

      return image
    } catch (e) {
      console.log(e)
      // Удалить временный файл в случае ошибки
      if (fs.existsSync(tempFilePath)) {
        await util.promisify(fs.unlink)(tempFilePath)
      }
      throw new BadRequestException('Resized image failed')
    }
  }
}
