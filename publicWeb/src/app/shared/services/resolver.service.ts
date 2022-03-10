import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Product } from '../classes/product';
import { ProductService } from './product.service';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';


@Injectable({
	providedIn: 'root'
})
export class Resolver implements Resolve<Product> {
  
  public product: Product = {};

  constructor(
    private router: Router,
    public productService: ProductService,private db:AngularFirestore
  ) {}

  // Resolver
  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));    
//   this.db.collection("articulos",ref => ref.where("id","==",route.params.slug)).subscribe(products => {
    // let product = products[0];
  this.productService.getProductBySlug(route.params.slug).subscribe(product => {
      if(!product) { // When product is empty redirect 404
          this.router.navigateByUrl('/pages/404', {skipLocationChange: true});
      } else {
          this.product = product
      }
    })
    return this.product;
  }
}
