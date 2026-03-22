import {
  AfterViewInit,
  ApplicationRef,
  ComponentRef,
  createComponent,
  Directive,
  effect,
  ElementRef,
  EnvironmentInjector,
  inject,
  input,
  Renderer2,
  signal,
} from '@angular/core';
import { SpinnerComponent } from '../../../components/spinner/spinner.component/spinner.component';

@Directive()
export abstract class AbstractButtonPrimaryDirective implements AfterViewInit {
  readonly #elementRef = inject(ElementRef);
  readonly #renderer2 = inject(Renderer2);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #appRef = inject(ApplicationRef);

  #spinnerComponentRef: ComponentRef<SpinnerComponent> | undefined;

  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);

  readonly isReady = signal(false);

  protected abstract readonly classes: string[];
  protected abstract readonly disabledClasses: string[];
  protected abstract readonly loadingClasses: string[];

  protected readonly loadingIconClasses: string[] = ['min-w-6', 'max-w-6'];

  #baseClassName: string | undefined;

  constructor() {
    effect(() => {
      if (this.isReady() && !this.loading()) this.effectDisabledHandler(this.disabled());
    });
    effect(() => this.isReady() && this.effectLoadingHandler(this.loading()));
    effect(() => {
      if (!this.isReady()) return;
      if (this.disabled() || this.loading()) {
        this.nativeElement.disabled = true;
      } else {
        this.nativeElement.disabled = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.#baseClassName = this.nativeElement.className;
    this.isReady.set(true);
  }

  get nativeElement(): HTMLButtonElement {
    return this.#elementRef.nativeElement;
  }

  #applyClasses(classes: string[]) {
    this.nativeElement.className = this.#baseClassName!;
    classes.forEach((cls) => {
      this.#renderer2.addClass(this.nativeElement, cls);
    });
  }

  effectDisabledHandler(disabled: boolean) {
    this.#applyClasses(disabled ? this.disabledClasses : this.classes);
  }

  effectLoadingHandler(loading: boolean) {
    this.#applyClasses(loading ? this.loadingClasses : this.classes);

    if (loading) {
      this.#addSpinnerComponentIntoHost();
    } else {
      this.#removeSpinnerComponentFromHost();
    }
  }

  #addSpinnerComponentIntoHost() {
    if (this.#spinnerComponentRef) return;

    this.#spinnerComponentRef = createComponent(SpinnerComponent, {
      environmentInjector: this.#environmentInjector,
    });

    this.loadingIconClasses.forEach((cls) => {
      this.#renderer2.addClass(this.#spinnerComponentRef?.location.nativeElement, cls);
    });

    this.#renderer2.appendChild(
      this.nativeElement,
      this.#spinnerComponentRef.location.nativeElement,
    );
  }

  #removeSpinnerComponentFromHost() {
    if (!this.#spinnerComponentRef) return;
    this.#appRef.detachView(this.#spinnerComponentRef.hostView);
    this.#spinnerComponentRef?.destroy();
    this.#spinnerComponentRef = undefined;
  }
}
