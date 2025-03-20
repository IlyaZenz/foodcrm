import { Injectable } from '@angular/core'
import { environment } from '../../../../environments/environment'

interface LocalStoreServiceInterface {
  setItem(key: string, value: any): void

  getItem<T>(key: string): T | null

  removeItem(key: string): void
}

@Injectable({ providedIn: 'root' })
export class LocalStoreService implements LocalStoreServiceInterface {
  private appName = environment.appName

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key + this.appName)
    return item === null ? null : JSON.parse(item)
  }

  removeItem(key: string): void {
    localStorage.removeItem(key + this.appName)
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key + this.appName, JSON.stringify(value))
  }
}
