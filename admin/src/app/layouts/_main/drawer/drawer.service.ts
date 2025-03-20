import {
  inject,
  Injectable,
  Injector,
  Type,
  ViewContainerRef
} from '@angular/core'
import { MatSidenav } from '@angular/material/sidenav'
import { NavigationStart, Router } from '@angular/router'
import { BehaviorSubject, filter, first, Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class DrawerService {
  private drawer: MatSidenav | null = null
  private drawerContent: ViewContainerRef | null = null
  private router = inject(Router)
  private largeMode = new BehaviorSubject<boolean>(false)

  get isLargeMode$(): Observable<boolean> {
    return this.largeMode.asObservable()
  }

  close() {
    if (this.drawer?.opened) {
      this.drawer?.close()
    }
    this.drawerContent?.clear()
  }

  setDrawerAndDrawerContentRef(
    sidenavRef: MatSidenav,
    drawerContentRef: ViewContainerRef
  ) {
    this.drawer = sidenavRef
    this.drawerContent = drawerContentRef
  }

  openDrawer(
    // component для динамического рендеринга
    cmp: Type<any>,
    options: {
      mode?: 'push' | 'over' | 'side'
      position?: 'start' | 'end'
      closeOnNavigation?: boolean
      largeMode?: boolean
      // для доступа к данным в динамическом компоненте нужно объявить @Input data
      cmpData?: any
      // для доступа к данным из сервисов родительских компонентов,
      // в компоненте, в котором вызывается открытие drawer, нужно
      // передать injector этого компонента
      injector?: Injector
    } = {},
    /*
     * Для доступа к событию из компонента, нужно зарегистрировать в компоненте
     * @Output output = new EventEmitter<unknown>()
     *
     * Пример использования:
     * this.drawer.openDrawer(
     *   MyComponentForRenderInMatDrawer,
     *   {
     *     cmpData: {items: someData},
     *     closeOnNavigation:true,
     *     mode:'over',
     *     position:'start',
     *     largeMode:true,
     *     injector:this.injector
     *   },
     *   (data) => (console.log(data))
     * )
     * */
    outputEvent?: (data: any) => void
  ) {
    if (!this.drawer)
      throw new Error('Нельзя открыть drawer так как он не был инициализирован')

    if (options.closeOnNavigation) {
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationStart),
          first()
        )
        .subscribe(() => this.close())
    }

    this.drawer.mode = options.mode ?? 'over'
    this.drawer.position = options.position ?? 'start'

    this.largeMode.next(options.largeMode ?? false)
    if (options.largeMode) {
      this.drawer.mode = 'over'
      this.drawer.position = 'end'
    }

    this.drawer?.open()

    // создание динамического компонента внутри drawer
    if (this.drawerContent) {
      this.drawerContent.clear()
    }
    const component = this.drawerContent?.createComponent(cmp, {
      injector: options.injector
    })

    // добавление данных в компонент,
    // компонент должен содержать @Input() data
    if (options.cmpData && component) {
      component.instance.data = options.cmpData
    }

    // выходные данные из динамического компонента
    // компонент должен содержать @Output output = new EventEmitter<unknown>()

    if (outputEvent && component) {
      // в контексте динамически создаваемых компонентов подписка будет автоматически очищена
      // при уничтожении компонента. Это происходит потому, что при уничтожении компонента
      // уничтожается и его контекст, что включает в себя все подписки, созданные внутри компонента
      component.instance.output.subscribe(outputEvent)
    }
  }
}
