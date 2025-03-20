import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";

export interface IStateEntity {
  key: string;
  data: any;
}

/*
 * Сервис простого хранилища:
 *
 * В массиве хранятся объекты, key - уникальный идентификатор объекта, data - данные для сохранения
 * */
@Injectable({ providedIn: "root" })
export class StoreService {
  private _store$: BehaviorSubject<IStateEntity[]> = new BehaviorSubject<
    IStateEntity[]
  >([]);

  add(entity: IStateEntity): void {
    const store = this._store$.getValue();
    const storedEntityIndex = store.findIndex((i) => i.key === entity.key);
    storedEntityIndex >= 0
      ? (store[storedEntityIndex] = entity)
      : store.push(entity);
    this._store$.next(store);
  }

  get<T = any>(key: string): Observable<T> {
    return this._store$.asObservable().pipe(
      map((value) => {
        const storedEntityIndex = value.findIndex((i) => i.key === key);
        return storedEntityIndex >= 0 ? value[storedEntityIndex].data : null;
      }),
    );
  }

  remove(key: string): void {
    const store = this._store$.getValue();
    store.filter((i) => i.key !== key);
    this._store$.next(store);
  }
}
