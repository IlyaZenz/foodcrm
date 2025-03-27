import { inject, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { first, fromEvent, map, mergeMap, Observable, of, tap } from 'rxjs'
import { HttpClient } from '@angular/common/http'

export interface ImageLoadOptions {
  fileType?: string[] | 'images'
  multiple?: boolean
}

@Injectable()
export class ImagesService {
  private snackBar = inject(MatSnackBar)
  private http = inject(HttpClient)

  pick(existingFiles: File[] = [], opt?: ImageLoadOptions) {
    const input: HTMLInputElement = document.createElement('input')
    input.type = 'file'

    if (opt?.multiple) input.setAttribute('multiple', 'multiple')

    if (opt?.fileType === 'images') input.accept = 'image/*'
    else if (Array.isArray(opt?.fileType)) input.accept = opt.fileType.join(',')

    input.click()
    return fromEvent(input, 'change').pipe(
      map((event: any) => {
        const selectedFiles: File[] = Array.from(event.target.files)
        const newFiles = [] as File[]
        for (const newFile of selectedFiles) {
          const extension = newFile.name.split('.').pop()
          if (
            Array.isArray(opt?.fileType) &&
            !opt?.fileType.includes(`${extension}`)
          ) {
            this.snackBar.open(`Файл не поддерживается: ${extension}`)
            continue
          }

          if (
            existingFiles.some(
              (existingFile) => existingFile.name === newFile.name
            )
          ) {
            this.snackBar.open(`Файл уже выбран: ${newFile.name}`)
            continue
          }

          newFiles.push(newFile)
        }
        return [...existingFiles, ...newFiles]
      }),first()
    )
  }

  uploadOne(
    files$: Observable<File[]>,
    endpoint: string
  ): Observable<{ image: string } | null> {
    return files$.pipe(
      mergeMap((files: File[]) => {
        if (files.length === 0) return of(null) // Ничего не делать, если нет файлов
        const formData: FormData = new FormData()
        formData.append('file', files[0], files[0].name)
        return this.http.post<{ image: string }>(endpoint, formData).pipe(
          tap({
            next: () => this.snackBar.open(`Загружено`),
            error: () => this.snackBar.open(`Ошибка`)
          })
        )
      }),
      first()
    )
  }
}
