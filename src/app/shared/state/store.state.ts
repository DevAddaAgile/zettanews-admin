import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { UpdateBadgeValue } from "../action/menu.action";
import { GetStores, CreateStore, EditStore, UpdateStore, UpdateStoreStatus, DeleteStore, 
         DeleteAllStore, ApproveStoreStatus} from "../action/store.action";
import { Stores } from "../interface/store.interface";
import { StoreService } from "../services/store.service";
import { NotificationService } from "../services/notification.service";

export class StoreStateModel {
  store = {
    data: [] as Stores[],
    total: 0
  }
  selectedStore: Stores | null;
}

@State<StoreStateModel>({
  name: "store",
  defaults: {
    store: {
      data: [],
      total: 0
    },
    selectedStore: null
  },
})
@Injectable()
export class StoreState {
  
  constructor(private store: Store,
    private notificationService: NotificationService,
    private storeService: StoreService) {}

  @Selector()
  static store(state: StoreStateModel) {
    return state.store;
  }

  @Selector()
  static stores(state: StoreStateModel) {
    return state.store.data.map(store => {
      return { label: store?.store_name, value: store?.id }
    });
  }

  @Selector()
  static selectedStore(state: StoreStateModel) {
    return state.selectedStore;
  }

  @Action(GetStores)
  getStores(ctx: StateContext<StoreStateModel>, action: GetStores) {
    return this.storeService.getStores(action.payload).pipe(
      tap({
        next: result => { 
          ctx.patchState({
            store: {
              data: result.data,
              total: result?.total ? result?.total : result.data ? result.data.length : 0
            }
          });
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(CreateStore)
  create(ctx: StateContext<StoreStateModel>, action: CreateStore) {
    // Store Create Logic Here
  }

  @Action(EditStore)
  edit(ctx: StateContext<StoreStateModel>, { id }: EditStore) {
    return this.storeService.getStores().pipe(
      tap({
        next: results => { 
          const state = ctx.getState();
          const result = results.data.find(store => store.id == id);
          ctx.patchState({
            ...state,
            selectedStore: result
          });
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateStore)
  update(ctx: StateContext<StoreStateModel>, { payload, id }: UpdateStore) {
    // Store Update Logic Here
  }

  @Action(UpdateStoreStatus)
  updateStatus(ctx: StateContext<StoreStateModel>, { id, status }: UpdateStoreStatus) {
    // Store Update Status Logic Here
  }

  @Action(ApproveStoreStatus)
  approveStatus(ctx: StateContext<StoreStateModel>, { id, status }: ApproveStoreStatus) {
    // Store Approve Status Logic Here
  }

  @Action(DeleteStore)
  delete(ctx: StateContext<StoreStateModel>, { id }: DeleteStore) {
    // Store Delete Logic Here
  }

  @Action(DeleteAllStore)
  deleteAll(ctx: StateContext<StoreStateModel>, { ids }: DeleteAllStore) {
    // Store Delete All Logic Here
  }

}
