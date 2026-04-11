import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  SidemenuHide as NavbarHideMobile,
  SidemenuShow as NavbarShowMobile,
} from './sidemenu.actions';

export interface SidemenuStateModel {
  showNavbarMobile: boolean;
}

@State<SidemenuStateModel>({
  name: 'navbar',
  defaults: {
    showNavbarMobile: true,
  },
})
@Injectable()
export class SidemenuState {
  @Selector()
  static getState(state: SidemenuStateModel) {
    return state;
  }

  @Selector()
  static getShowNavbar(state: SidemenuStateModel) {
    return state.showNavbarMobile;
  }

  @Action(NavbarShowMobile)
  navbarShowMobile(ctx: StateContext<SidemenuStateModel>) {
    ctx.patchState({
      showNavbarMobile: true,
    });
  }

  @Action(NavbarHideMobile)
  navbarHideMobile(ctx: StateContext<SidemenuStateModel>) {
    ctx.patchState({
      showNavbarMobile: false,
    });
  }
}
