import { Component, OnInit, Input } from '@angular/core';
import { NewProductSlider } from '../../../data/slider';
import { Product } from '../../../classes/product';
import { ProductService } from '../../../services/product.service';
import { ConexionesService } from 'src/app/services/conexiones.service';


@Component({
  selector: 'app-product-box-vertical-slider',
  templateUrl: './product-box-vertical-slider.component.html',
  styleUrls: ['./product-box-vertical-slider.component.scss']
})
export class ProductBoxVerticalSliderComponent implements OnInit {

  @Input() title: string = 'off sale'; // Default
  @Input() type: string = 'tools'; // Default Fashion

  public products : Product[] = [];

  public NewProductSliderConfig: any = NewProductSlider;

  constructor(public productService: ProductService,private db:ConexionesService) { 

    this.db.getAllDataDescuento("articulos").then((data:any)=>{
this.products = data;
         /* var articulos = data;    
            for(var i=0;i<data.length;i++){
             var  arreglo =data[i]['collection'];
              for(var j=0;j<arreglo.length;j++){
               
                  if(arreglo[j]=="on sale"){
                 
                      this.products.push(articulos[i])
                  }
              }
            }*/
          
    });
  
 
  }

  ngOnInit(): void {
  }

}
