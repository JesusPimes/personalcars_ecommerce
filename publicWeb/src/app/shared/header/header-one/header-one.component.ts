import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ConexionesService } from '../../../services/conexiones.service';


@Component({
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: ['./header-one.component.scss']
})
export class HeaderOneComponent implements OnInit {
  
  @Input() class: string;
  @Input() themeLogo: string = 'assets/images/icon/logo.png'; // Default Logo
  @Input() topbar: boolean = true; // Default True
  @Input() sticky: boolean = false; // Default false
  
  public stick: boolean = false;
  logeado =  false;
  displayName:any;
  constructor(private db:ConexionesService) { }

  ngOnInit(): void {
    this.db.isLoggedIn().then((user)=>{
     
      if(user){
          this.logeado = true;
          this.displayName = user['displayName']
      }else{
          
      }
    })

  }
  salir(){
    this.db.salir()
    window.location.reload();
  }


  // @HostListener Decorator
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  	if (number >= 150 && window.innerWidth > 400) { 
  	  this.stick = true;
  	} else {
  	  this.stick = false;
  	}
  }

}
