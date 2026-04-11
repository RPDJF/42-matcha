import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';

@Component({
  selector: 'app-action-menu',
  imports: [],
  templateUrl: './action-menu.component.html',
  host: {
    class: 'fixed z-50 hidden',
  },
})
export class ActionMenuComponent implements OnInit {
  readonly actionMenuBackdropRef = viewChild<ElementRef<HTMLDivElement>>('actionMenuBackdrop');

  readonly #elementRef = inject(ElementRef);

  ngOnInit(): void {
    this.actionMenuBackdropRef()?.nativeElement.addEventListener('click', (event) => {
      this.close();
    });
    this.nativeElement.addEventListener('click', () => {
      this.close();
    });
  }

  get nativeElement(): HTMLDivElement {
    return this.#elementRef.nativeElement;
  }

  open(x: number, y: number) {
    this.nativeElement.classList.remove('hidden');

    requestAnimationFrame(() => {
      const menuWidth = this.nativeElement.offsetWidth;
      const menuHeight = this.nativeElement.offsetHeight;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let left = x;
      let top = y;

      if (left + menuWidth > vw) {
        left = vw - menuWidth - 8;
      }

      if (top + menuHeight > vh) {
        top = vh - menuHeight - 8;
      }

      left = Math.max(8, left);
      top = Math.max(8, top);

      this.nativeElement.style.left = `${left}px`;
      this.nativeElement.style.top = `${top}px`;
    });
  }

  close() {
    this.nativeElement.classList.add('hidden');
  }
}
