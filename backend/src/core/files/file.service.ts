import {Injectable} from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs'
import {existedFilePrefixForGenerateFullPath} from '../../configs/files.config'

@Injectable()
export class FileService {
  async deleteFile(filePath?: string): Promise<void> {
    const absolutePath = path.resolve(existedFilePrefixForGenerateFullPath + filePath)
    if (fs.existsSync(absolutePath)) {
      await fs.promises.unlink(absolutePath)
    }
  }
}
