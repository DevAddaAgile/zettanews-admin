import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetShippings, CreateShipping, EditShipping, 
         UpdateShipping, DeleteShipping, CreateShippingRule,
         UpdateShippingRule, DeleteShippingRule } from "../action/shipping.action";
import { Shipping } from "../interface/shipping.interface";
import { ShippingService } from "../services/shipping.service";
import { NotificationService } from "../services/notification.service";

export class ShippingStateModel {
  shipping = {
    data: [] as Shipping[]
  }
  selectedShipping: Shipping | null;
}

@State<ShippingStateModel>({
  name: "shipping",
  defaults: {
    shipping: {
      data: []
    },
    selectedShipping: null
  },
})
@Injectable()
export class ShippingState {
  
  constructor(private notificationService: NotificationService,
    private shippingService: ShippingService) {}

  @Selector()
  static shipping(state: ShippingStateModel) {
    return state.shipping;
  }

  @Selector()
  static selectedShipping(state: ShippingStateModel) {
    return state.selectedShipping;
  }

  @Action(GetShippings)
  getShippings(ctx: StateContext<ShippingStateModel>) {
    return this.shippingService.getShippings().pipe(
      tap({
        next: result => { 
          ctx.patchState({
            shipping: {
              data: result
            }
          });
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(CreateShipping)
  create(ctx: StateContext<ShippingStateModel>, action: CreateShipping) {
    // Shipping Create Logic Here
  }

  @Action(EditShipping)
  edit(ctx: StateContext<ShippingStateModel>, { id }: EditShipping) {
    return this.shippingService.getShippings().pipe(
      tap({
        next: results => { 
          const state = ctx.getState();
          const result = results.find(shipping => shipping.id == id);
          ctx.patchState({
            ...state,
            selectedShipping: result
          });
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateShipping)
  update(ctx: StateContext<ShippingStateModel>, { payload, id }: UpdateShipping) {
    // Shipping Update Logic Here
  }

  @Action(DeleteShipping)
  delete(ctx: StateContext<ShippingStateModel>, { id }: DeleteShipping) {
    // Shipping Delete Logic Here
  }

  @Action(CreateShippingRule)
  createRule(ctx: StateContext<ShippingStateModel>, action: CreateShippingRule) {
    // Shipping Create Rule Logic Here
  }

  @Action(UpdateShippingRule)
  updateRule(ctx: StateContext<ShippingStateModel>, { payload, id }: UpdateShippingRule) {
    // Shipping Update Rule Logic Here
  }

  @Action(DeleteShippingRule)
  deleteRule(ctx: StateContext<ShippingStateModel>, { id }: DeleteShippingRule) {
    // Shipping Delete Rule Logic Here
  }


}
