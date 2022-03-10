import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuickViewComponent } from "../../modal/quick-view/quick-view.component";
import { CartModalComponent } from "../../modal/cart-modal/cart-modal.component";
import { Product } from "../../../classes/product";
import { ProductService } from "../../../services/product.service";
import { ActivatedRoute, NavigationStart, NavigationExtras, Router } from '@angular/router';


@Component({
  selector: 'app-product-box-three',
  templateUrl: './product-box-three.component.html',
  styleUrls: ['./product-box-three.component.scss']
})
export class ProductBoxThreeComponent implements OnInit {

  @Input() product: Product;
  @Input() currency: any = this.productService.Currency; // Default Currency
  @Input() cartModal: boolean = false; // Default False
  
  @ViewChild("quickView") QuickView: QuickViewComponent;
  @ViewChild("cartModal") CartModal: CartModalComponent;

  constructor(private productService: ProductService,public router: Router, public route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  redirect(product: any) {
   
   /* let navigationExtras: NavigationExtras = {
      queryParams: { 'slug': product.id }
     
    };*/
    
    // Navigate to the login page with extras
    
    this.router.navigate(['shop/product/left/sidebar/'+product.title]);
  }

  addToCart(product: any) {
    this.productService.addToCart(product);
  }

  addToWishlist(product: any) {
   
    let img=product['images'][0];
    this.productService.addToWishlist(product,img);
  }

  addToCompare(product: any) {
    this.productService.addToCompare(product);
  }

}
