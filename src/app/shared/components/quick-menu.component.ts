import {
  Component,
  Input,
  HostListener,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Renderer2,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'bt-quick-menu',
  template: `
  <div style='position: relative; padding: 4px 12px;'>
    <div class="ad-quick-menu__ctrl" [ngStyle]="ctrlStyle">
      <i [ngClass]="icon"></i>
    </div>
    <ng-content></ng-content>
  </div>
  `,
  host: { '[class.ad-quick-menu]': 'true' },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickMenuComponent implements OnInit, OnChanges {

  @Input()
  foldIcon = 'anticon anticon-right-circle-o';

  @Input()
  unFoldIcon = 'anticon anticon-left-circle-o';

  get icon(): string {
    if (this.show) return this.foldIcon;

    return this.unFoldIcon;
  }

  @Input() top = 120;

  @Input() width = 200;

  @Input() bgColor = '#fff';

  @Input() borderColor = '#ddd';

  // endregion

  constructor(
    private cd: ChangeDetectorRef,
    private el: ElementRef,
    private render: Renderer2,
  ) {}

  private show = false;

  @HostListener('click')
  _click() {
    this.show = !this.show;
    this.setStyle();
  }

  ctrlStyle: { [key: string]: string } = {};
  private setStyle() {
    this.ctrlStyle = {
      'background-color': this.bgColor,
      'border-color': this.borderColor,
    };

    const res: string[] = [
      `top:${this.top}px`,
      `width:${this.width}px`,
      `background-color:${this.bgColor}`,
      `border-color:${this.borderColor}`,
      `margin-right:-${this.show ? 0 : this.width}px`,
    ];
    this.render.setAttribute(this.el.nativeElement, 'style', res.join(';'));
    this.cd.detectChanges();
  }

  private initFlag = false;
  ngOnInit(): void {
    this.initFlag = true;
    this.setStyle();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.initFlag) this.setStyle();
  }
}
