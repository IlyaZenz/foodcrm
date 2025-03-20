import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core'
import { MatButton } from '@angular/material/button'

@Component({
  imports: [MatButton],
  standalone: true,
  selector: 'infinity-scroll',
  template: `
    <ng-content></ng-content>
    <button mat-stroked-button (click)="emitEvent()">Загрузить</button>
    <div #anchor></div>
  `,
})
export class InfinityScrollComponent implements AfterViewInit, OnDestroy {
  @Input() options = {}
  @Output() scrolled: EventEmitter<boolean> = new EventEmitter()
  @ViewChild('anchor') anchor!: ElementRef<HTMLElement>

  private _observer!: IntersectionObserver
  private _host: ElementRef = inject(ElementRef)

  ngAfterViewInit(): void {
    const options = {
      root: this._isHostScrollable() ? this._host.nativeElement : null,
      ...this.options,
    }
    this._observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && this.emitEvent(),
      options,
    )
    this._observer.observe(this.anchor.nativeElement)
  }

  ngOnDestroy() {
    this._observer.disconnect()
  }

  emitEvent() {
    this.scrolled.emit()
  }

  private _isHostScrollable() {
    const style = window.getComputedStyle(this._host.nativeElement)
    return (
      style.getPropertyValue('overflow') === 'auto' ||
      style.getPropertyValue('overflow-y') === 'scroll'
    )
  }
}
