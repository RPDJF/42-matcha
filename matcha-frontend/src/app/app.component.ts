import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { UserState } from './core/stores/user/user.state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidemenuComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  readonly #store = inject(Store);
  readonly #elementRef = inject(ElementRef);

  readonly sidemenuComponentRef = viewChild(SidemenuComponent);

  readonly userMe = this.#store.selectSignal(UserState.getMe);

  #touchStartY: number = 0;

  get nativeElement(): HTMLElement {
    return this.#elementRef.nativeElement;
  }

  ngAfterViewInit() {
    const sidemenuComponentRef = this.sidemenuComponentRef();
    if (sidemenuComponentRef) {
      this.nativeElement.addEventListener('touchstart', (e) => {
        this.#touchStartY = e.touches[0].clientY;
      });

      this.nativeElement.addEventListener('touchend', (e) => {
        const endY = e.changedTouches[0].clientY;
        const diffY = this.#touchStartY - endY;

        if (diffY > 50) {
          sidemenuComponentRef.focusMenu();
        }
      });
      sidemenuComponentRef.focusMenu('instant');
    }
  }
}
