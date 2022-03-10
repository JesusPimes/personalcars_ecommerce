import { Component, OnInit } from '@angular/core';
import { ConexionesService } from '../../../services/conexiones.service';
import { ActivatedRoute, NavigationStart, NavigationExtras, Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  correo:any;
  password:any;
  constructor(private db:ConexionesService,public router: Router, public route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  login(){
    console.log(this.correo)
    console.log(this.password)
    this.db.login(this.correo,this.password).then((user)=>{
      console.log(user)
      if(user){
        this.router.navigate(['/home/tools']);
      }
    })
  }

}
