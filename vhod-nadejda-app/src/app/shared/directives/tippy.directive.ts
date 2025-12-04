import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import tippy, { Instance, Props } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

@Directive({
  selector: '[vnTippy]',
  standalone: true,
})
export class TippyDirective implements OnInit, OnDestroy {
  @Input('vnTippy') content: string | undefined = '';
  @Input() tippyOptions: Partial<Props> = {};

  private instance: Instance<Props> | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.content) {
      const result = tippy(this.el.nativeElement, {
        content: this.content,
        allowHTML: true,
        placement: 'top',
        interactive: false,
        ...this.tippyOptions,
      });

      // tippy() returns Instance or Instance[] - get first if array
      this.instance = Array.isArray(result) ? result[0] : result;
    }
  }

  ngOnDestroy() {
    if (this.instance) {
      this.instance.destroy();
    }
  }
}
