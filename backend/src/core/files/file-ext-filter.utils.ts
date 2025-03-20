import {BadRequestException} from '@nestjs/common'
import {extname} from 'path'

export function fileFilter(allowedExtensions: string[] | 'image' | null) {
  return (req, file, cb) => {
    const fileExtension = extname(file.originalname).toLowerCase()

    if (allowedExtensions === null) {
      // Все расширения разрешены
      return cb(null, true)
    }

    if (allowedExtensions === 'image') {
      // Разрешены только изображения
      if (file.mimetype.startsWith('image/')) {
        return cb(null, true)
      } else {
        return cb(new BadRequestException('File is not an image'), false)
      }
    }

    // Проверка на конкретные расширения
    if (Array.isArray(allowedExtensions) && allowedExtensions.includes(fileExtension)) {
      return cb(null, true)
    }

    cb(new BadRequestException('Unsupported file type'), false)
  }
}
