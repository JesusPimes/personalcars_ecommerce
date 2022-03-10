import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from '../../../environments/environment';
import { Product } from "../../shared/classes/product";
import { ProductService } from "../../shared/services/product.service";
import { OrderService } from "../../shared/services/order.service";
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConexionesService } from '../../services/conexiones.service';





declare var Stripe; // : stripe.StripeStatic;


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  @Input() amount: number;
  @Input() description: string;
  @ViewChild('cardElement') cardElement: ElementRef;
  @ViewChild('divStripe') divStripe: ElementRef;
  @ViewChild('toggleBtn') toggleBtn: ElementRef;

  stripe; // : stripe.Stripe;
  card;
  cardErrors;

  public checkoutForm:  FormGroup;
  public products: Product[] = [];
  public payPalConfig ? : IPayPalConfig;
  public payment: string = 'Stripe';
  mensaje="";
  logeado= false;
  //public amount:  any;
  uid="";
  constructor(private fb: FormBuilder,
    public productService: ProductService,
    private orderService: OrderService,
    private functions: AngularFireFunctions, 
    private auth: AuthService,
    public db:ConexionesService,
    private activatedRoute: ActivatedRoute,
    public router: Router, public route: ActivatedRoute) { 
    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['USA', Validators.required],
      town: ['Laredo', Validators.required],
      state: ['Texas', Validators.required],
      postalcode: ['', Validators.required]
    })
  }
  ngAfterViewInit() {
    this.creaPago()
    this.initConfig();
  }
  ngOnInit(): void {
    this.validaUser()
    this.productService.cartItems.subscribe(response => this.products = response);
    this.getTotal.subscribe(amount => this.amount = amount);
   
  }
  validaUser(){
    this.db.isLoggedIn().then((user)=>{
      if(user){
          this.logeado = true;
          this.uid = user['uid'];      
          this.firebaseToken(this.uid);
      }else{
        this.router.navigate(['/pages/login']);
      }
    })
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

   

  creaPago(){
   
       this.stripe = Stripe('pk_test_51KVJn1KYWuj7MKshN8lUmHkLnIxtlXWgrgpadLfhtSms6oDiesyTbmWvlmvsOFXcHICjOpgdl61tpI1JOKHYfpM200ZgbivjDY');

       const elements = this.stripe.elements();

       this.card = elements.create('card',{
        hidePostalCode: true,
        style: {
          base: {
            iconColor: '#F99A52',
            color: '#32315E',
            lineHeight: '48px',
            fontWeight: 400,
            fontFamily: '"Open Sans", "Helvetica Neue", "Helvetica", sans-serif',
            fontSize: '15px',
      
            '::placeholder': {
              color: '#CFD7DF',
            }
          },
        }
      });
       this.card.mount(this.cardElement.nativeElement);
      
       this.card.addEventListener('change', ({ error }) => {
           this.cardErrors = error && error.message;
       });
 }
 async handleForm(e) {
  this.toggleBtn.nativeElement.setAttribute('disabled', true);
  
           e.preventDefault();

            const { source, error } = await this.stripe.createSource(this.card);

            if (error) {const cardErrors = error.message;
            } else {
                 this.sourceHandler(source)
            }
}
async sourceHandler(source){
       
        this.mensaje="processing payment...wait";
 
        this.functions.httpsCallable('stripeAttachSource')({ source: source.id })
                  .subscribe((data)=>{   
                       
                        if(data.id){
                          this.createCharge(source)
                        }
                  })
}
async createCharge(source){
 
      this.functions.httpsCallable('stripeCreateCharge')({ source: source.id, amount: this.amount })
                    .subscribe((resp)=>{
                    
                    if(resp.id){
                      this.mensaje ="successful payment";
                      localStorage.removeItem("cartItems");
                      this.orderService.createOrder(this.products, this.checkoutForm.value, resp.id, this.amount);
                    }else{
                    
                      alert("Error, No se pudo realizar la Transaccion")
                    }
                       
                    },error=>{
                        alert("Error, No se pudo realizar la Transaccion")
                    })
    
}
async firebaseToken(uidd){
    
      this.functions.httpsCallable('callback')({ uid:uidd })
                    .subscribe((token)=>{
                  
                        if(token){
                              this.customSignIn(token)}      
                    })
}
customSignIn(token) {
   
      this.auth.customSignIn(token).then((user:any)=>{
      
         if(user){ }
        
      })
} 

private initConfig(): void {
  this.payPalConfig = {
      currency: this.productService.Currency.currency,
    //  clientId: environment.paypal_token,
      // clientId:'AUWQixgBIqoIe-2plbh8zj44kkt4sa10qwDJpS7gJiOwyJkjxQCb7e_NcrTAbvALzZWCo5pmMyMKB7Qx',
      clientId:'AYpoxXHeeeAepggDIjQ747JJDMmLdZ8zH6W9Y0Qaz0mPOR2FGY5NywJelrx2G8wTxvx5m87GlwXSw73x',
      createOrderOnClient: (data) => < ICreateOrderRequest > {
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
              currency_code: this.productService.Currency.currency,
              value: this.amount.toString(),
              breakdown: {
                  item_total: {
                      currency_code: this.productService.Currency.currency,
                      value: this.amount.toString()
                  }
              }
            }
        }]
    },
      advanced: {
          commit: 'true'
      },
      style: {
          label: 'paypal',
          layout: 'horizontal',
          size:  'small', // small | medium | large | responsive
          shape: 'rect', // pill | rect
      },
      onApprove: (data, actions) => {
        var DOEC_URL = 'http://localhost:4200/shop/checkout/success/';

        return fetch(DOEC_URL, {
          method: 'post',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            token:   data.orderID,
            payerID: data.payerID
          })
        }).then((resp)=>{
          console.log(data)
          if(data.orderID){
            actions.order.capture().then((resp)=>{
              console.log(resp)
              if(resp.status=="COMPLETED"){
                this.test(data.orderID)
              }
            })
            
          }
             
        })
     
      },
      onClientAuthorization: (data) => {
         // console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
      },
      onError: err => {
          console.log('OnError', err);
      },
      onClick: (data, actions) => {
          console.log('onClick', data, actions);
      }
  };
}
test(id){
  this.orderService.createOrder(this.products, this.checkoutForm.value, id, this.amount);
}


stripeclick(value){
  if(value==1){
    this.divStripe.nativeElement.setAttribute('style', 'visibility: visible;');
  }else{
    this.divStripe.nativeElement.setAttribute('style', 'visibility: hidden;');
  }   

  
}



}  
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /*
  stripeCheckout() {
    
    var handler = (<any>window).StripeCheckout.configure({
      key: environment.stripe_token, // publishble key
      locale: 'auto',
      token: (token: any) => {

        this.orderService.createOrder(this.products, this.checkoutForm.value, token.id, this.amount);
      }
    });
    handler.open({
      name: 'Multikart',
      description: 'Online Fashion Store',
      amount: this.amount * 100
    }) 
  }
  */
    
    // Paypal Payment Gateway
 /* private initConfig(): void {
    this.payPalConfig = {
        currency: this.productService.Currency.currency,
        clientId: environment.paypal_token,
        createOrderOnClient: (data) => < ICreateOrderRequest > {
          intent: 'CAPTURE',
          purchase_units: [{
              amount: {
                currency_code: this.productService.Currency.currency,
                value: this.amount,
                breakdown: {
                    item_total: {
                        currency_code: this.productService.Currency.currency,
                        value: this.amount
                    }
                }
              }
          }]
      },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            size:  'small', // small | medium | large | responsive
            shape: 'rect', // pill | rect
        },
        onApprove: (data, actions) => {
            this.orderService.createOrder(this.products, this.checkoutForm.value, data.orderID, this.getTotal);
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });
        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
        },
        onError: err => {
            console.log('OnError', err);
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
        }
    };
  }*/

