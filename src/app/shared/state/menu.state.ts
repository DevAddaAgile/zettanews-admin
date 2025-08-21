import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { GetMenu, GetBadges, UpdateBadgeValue } from "../action/menu.action";
import { Menu, Badges } from "../interface/menu.interface";
import { NavService } from "../services/nav.service";
import { tap } from "rxjs";
import * as data from '../data/menu';

export class MenuStateModel {
  menu = {
    data: [] as Menu[],
  }
  badges: Badges | null
}

@State<MenuStateModel>({
  name: "menu",
  defaults: {
    menu: {
      data: [],
    },
    badges: null
  },
})
@Injectable()
export class MenuState {

  constructor(private store: Store,
    private navService: NavService) {}

  @Selector()
  static menu(state: MenuStateModel) {
    return state.menu;
  }

  @Selector()
  static badges(state: MenuStateModel) {
    return state.badges;
  }
 
  private updateBadgeValueRecursive(
    menuItems: Menu[],
    path: string,
    badgeValue: number
  ) {
    for (const item of menuItems) {
      if (item.path && item.path.toString() == path.toString()) {
        item.badgeValue = badgeValue;
        break;
      }
      if (item.children) {
        this.updateBadgeValueRecursive(item.children, path, badgeValue);
      }
    }
  }

  @Action(GetMenu)
  getMenu(ctx: StateContext<MenuStateModel>) {
    ctx.patchState({
      menu: {
        data: data.menu,
      }
    });
  }

  @Action(GetBadges)
  getBadges(ctx: StateContext<MenuStateModel>, action: GetBadges) {
    // Disable API call to prevent JSON parsing errors
    ctx.patchState({
      badges: {
        product: { total_products: 0, total_approved_products: 0, total_in_approved_products: 0 },
        store: { total_stores: 0, total_approved_stores: 0, total_in_approved_stores: 0 },
        refund: { total_refunds: 0, total_pending_refunds: 0, total_approved_refunds: 0, total_rejected_refunds: 0 },
        withdraw_request: { total_withdraw_requests: 0, total_pending_withdraw_requests: 0, total_approved_withdraw_requests: 0, total_rejected_withdraw_requests: 0 }
      }
    });
  }

  @Action(UpdateBadgeValue)
  updateBadgeValue(ctx: StateContext<MenuStateModel>, { path, badgeValue }: UpdateBadgeValue) {
    const state = ctx.getState();
    this.updateBadgeValueRecursive(state?.menu?.data, path, badgeValue);
    ctx.patchState({
      ...state,
    });
  }

}