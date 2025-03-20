import {extname} from 'path'
import {diskStorage} from 'multer'
import slugify from 'slugify'
import {filesDestination} from '../../configs/files.config'

export const fileStorageAndNameTransform = (dest: string, randomName = true) => {
  return diskStorage({
    destination: `${filesDestination}${dest}`,
    filename: async (req, file, cb) => {
      let fileName = ''
      if (randomName) {
        fileName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
      } else {
        fileName = slugify(file.originalname.replace(extname(file.originalname), ''), {lower: true})
        fileName = `${fileName}-${Date.now()}`
      }
      cb(null, `${fileName}${extname(file.originalname)}`)
    }
  })
}
