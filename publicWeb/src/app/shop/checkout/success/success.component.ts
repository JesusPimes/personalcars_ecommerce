import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Order } from '../../../shared/classes/order';
import { OrderService } from '../../../shared/services/order.service';
import { ProductService } from '../../../shared/services/product.service';
import { Router, ActivatedRoute, Params } from '@angular/router';



@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit, AfterViewInit{

  public orderDetails : Order = {};
  fecha:any
  constructor(public productService: ProductService,
    private orderService: OrderService,public route: Router) { 

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
  
      this.fecha = mm + '/' + dd + '/' + yyyy;
    }

  ngOnInit(): void {
    
   

    this.orderService.checkoutItems.subscribe(response => this.orderDetails = response);
    
  
  }

  ngAfterViewInit() {
   
  }

}
