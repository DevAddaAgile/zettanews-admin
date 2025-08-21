import { Component, inject, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { OwlOptions, CarouselModule } from 'ngx-owl-carousel-o';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoaderState } from '../../../shared/state/loader.state';
import { Category, CategoryModel } from '../../../shared/interface/category.interface';
import { CategoryState } from '../../../shared/state/category.state';
import { GetCategories } from '../../../shared/action/category.action';
import { ProductModel } from '../../../shared/interface/product.interface';
import { ProductState } from '../../../shared/state/product.state';
import { GetProducts } from '../../../shared/action/product.action';
import { Cart, CartAddOrUpdate } from '../../../shared/interface/cart.interface';
import { CartState } from '../../../shared/state/cart.state';
import { GetCartItems, UpdateCart } from '../../../shared/action/cart.action';
import { Params } from '../../../shared/interface/core.interface';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency-symbol.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { HasPermissionDirective } from '../../../shared/directive/has-permission.directive';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { NoDataComponent } from '../../../shared/components/ui/no-data/no-data.component';
import { PaginationComponent } from '../../../shared/components/ui/pagination/pagination.component';
import { ProductBoxComponent } from '../../../shared/components/ui/product-box/product-box.component';
import { ProductBoxSkeletonComponent } from '../../../shared/components/ui/skeleton/product-box-skeleton/product-box-skeleton.component';
import { AdvancedDropdownComponent } from '../../../shared/components/ui/advanced-dropdown/advanced-dropdown.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
    selector: 'app-create-order',
    templateUrl: './create-order.component.html',
    styleUrls: ['./create-order.component.scss'],
    imports: [LoaderComponent, CarouselModule, ReactiveFormsModule,
        FormsModule, AdvancedDropdownComponent, ProductBoxSkeletonComponent,
        ProductBoxComponent, PaginationComponent, NoDataComponent, ButtonComponent,
        HasPermissionDirective, RouterModule, CommonModule, TranslateModule, CurrencySymbolPipe]
})
export class CreateOrderComponent {

  loadingStatus$: Observable<boolean> = inject(Store).select(LoaderState.status) as Observable<boolean>;
  category$: Observable<CategoryModel> = inject(Store).select(CategoryState.category) as Observable<CategoryModel>;
  product$: Observable<ProductModel> = inject(Store).select(ProductState.product);
  cartItem$: Observable<Cart[]> = inject(Store).select(CartState.cartItems);
  cartTotal$: Observable<number> = inject(Store).select(CartState.cartTotal);

  public skeletonItems = Array.from({ length: 8 }, (_, index) => index);
  public activeCategory: Category | null;
  public selectedCategory: Number[] = [];
  public totalItems: number = 0;
  public filter = {
    'search': '',
    'field': '', 
    'sort': '', // current Sorting Order
    'page': 1, // current page number
    'paginate': 20, // Display per page,
    'category_ids': '',
  };

  public customOptions: OwlOptions = {
    loop: true,
    margin: 15,
    dots: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 5
      }
    },
    nav: true
  }
  public term = new FormControl();
  public loading: boolean = true;

  constructor(private store: Store,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2) {
    
    this.store.dispatch(new GetCategories({type: 'product', status: 1}));
    this.product$.subscribe(product => this.totalItems = product?.total);
    this.getProducts(this.filter, true);
    this.store.dispatch(new GetCartItems());

    this.term.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(
        (data: string) => {
          this.filter.search = data
          this.getProducts(this.filter);
      });
  }

  getProducts(filter: Params, loader?: boolean) {
    this.loading = true; 
    filter['status'] = 1;
    this.store.dispatch(new GetProducts(filter)).subscribe({
      complete: () => { 
        this.loading = false;
      }    
    });
    if(!loader)
      this.renderer.addClass(this.document.body, 'loader-none');
  }

  selectCategory(data: Category) {
    this.activeCategory = this.activeCategory?.id != data?.id ? data : null;
    this.selectedCategory = [];
    this.filter.category_ids = String(this.activeCategory ? this.activeCategory?.id! : '')
    this.getProducts(this.filter);
  }

  selectCategoryItem(data: Number[]) {
    this.activeCategory = null;
    this.filter.category_ids = data.join()
    this.getProducts(this.filter);
  }

  updateQuantity(item: Cart, qty: number) {
    this.renderer.addClass(this.document.body, 'loader-none');
    const params: CartAddOrUpdate = {
      id: item?.id,
      product_id: item?.product?.id!,
      product: item?.product,
      variation: item?.variation,
      variation_id: item?.variation_id ? item?.variation_id : null,
      quantity: qty
    }
    this.store.dispatch(new UpdateCart(params));
  }

  setPaginate(data: number) {
    this.filter.page = data;
    this.getProducts(this.filter);
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'loader-none');
  }

}
