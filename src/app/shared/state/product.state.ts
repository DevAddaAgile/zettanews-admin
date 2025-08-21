import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { UpdateBadgeValue } from "../action/menu.action";
import { GetProducts, CreateProduct, EditProduct, 
         UpdateProduct, UpdateProductStatus, ApproveProductStatus, DeleteProduct, 
         DeleteAllProduct, ReplicateProduct } from "../action/product.action";
import { Product, ProductModel } from "../interface/product.interface";
import { ProductService } from "../services/product.service";
import { NotificationService } from "../services/notification.service";

export class ProductStateModel {
  product = {
    data: [] as Product[],
    total: 0
  }
  selectedProduct: Product | null;
  topSellingProducts: Product[]
}

@State<ProductStateModel>({
  name: "product",
  defaults: {
    product: {
      data: [],
      total: 0
    },
    selectedProduct: null,
    topSellingProducts: []
  },
})
@Injectable()
export class ProductState {
  
  constructor(private store: Store,
    private notificationService: NotificationService,
    private productService: ProductService) {}

  @Selector()
  static product(state: ProductStateModel) {
    return state.product;
  }

  @Selector()
  static products(state: ProductStateModel) {
    return state.product.data.filter(data => data.id !== state.selectedProduct?.id).map((res: Product) => { 
      return { label: res?.name, value: res?.id, data: { 
        type: res.type,
        name: res.name,
        slug: res.slug,
        stock_status: res.stock_status,
        image: res.product_thumbnail ? res.product_thumbnail.original_url : 'assets/images/product.png' 
      }}
    })
  }
 
  @Selector()
  static selectedProduct(state: ProductStateModel) {
    return state.selectedProduct;
  }

  @Selector()
  static topSellingProducts(state: ProductStateModel) {
    return state.topSellingProducts;
  }

  @Action(GetProducts)
  getProducts(ctx: StateContext<ProductStateModel>, action: GetProducts) {
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: ProductModel) => { 
          if(action?.payload!['top_selling']) {
            const state = ctx.getState();
            ctx.patchState({
              ...state,
              topSellingProducts: result?.data?.slice(0,7)
            });
          } else {
            ctx.patchState({
              product: {
                data: result?.data,
                total: result?.total ? result?.total : result.data ? result.data.length : 0
              }
            });
          }
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(CreateProduct)
  create(ctx: StateContext<ProductStateModel>, action: CreateProduct) {
    // Product Create Logic Here
  }

  @Action(EditProduct)
  edit(ctx: StateContext<ProductStateModel>, { id }: EditProduct) {
    return this.productService.getProducts().pipe(
      tap({
        next: results => {
          const state = ctx.getState();
          const result = results.data.find(product => product.id == id);
          ctx.patchState({
            ...state,
            selectedProduct: result
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateProduct)
  update(ctx: StateContext<ProductStateModel>, { payload, id }: UpdateProduct) {
    // Product Update Logic Here
  }

  @Action(UpdateProductStatus)
  updateStatus(ctx: StateContext<ProductStateModel>, { id, status }: UpdateProductStatus) {
    // Product Update Status Logic Here
  }

  @Action(ApproveProductStatus)
  approveStatus(ctx: StateContext<ProductStateModel>, { id, status }: ApproveProductStatus) {
    // Product Approve Status Logic Here
  }

  @Action(DeleteProduct)
  delete(ctx: StateContext<ProductStateModel>, { id }: DeleteProduct) {
    // Product Delete Logic Here
  }

  @Action(DeleteAllProduct)
  deleteAll(ctx: StateContext<ProductStateModel>, { ids }: DeleteAllProduct) {
    // Product Delete All Logic Here
  }

  @Action(ReplicateProduct)
  replicateProduct(ctx: StateContext<ProductStateModel>, { ids }: ReplicateProduct) {
    // Product Replicate Logic Here
  }

}
