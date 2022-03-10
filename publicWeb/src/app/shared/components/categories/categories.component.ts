import { Component, OnInit } from '@angular/core';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product.service';
import { ConexionesService } from '../../../services/conexiones.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

 // public products: Product[] = [];
  public collapse: boolean = true;
  public categorias: any;
  public products: any;

  constructor(public productService: ProductService, private db:ConexionesService) { 
   
   
   /* this.productService.getProducts.subscribe((product) => {
      console.log(product)
      this.products = product
    });*/


    this.db.getAllDataCategorias("categorias").then((product)=>{
                 
      this.categorias= product;
      
    })
  }

  ngOnInit(): void {
  }

  get filterbyCategory() {
    const category = [...new Set(this.products.map((product) => {
        product.category
    }))]
    return category
  }

}
