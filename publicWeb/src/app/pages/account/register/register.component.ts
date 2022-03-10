import { Component, OnInit } from '@angular/core';
import { ConexionesService } from '../../../services/conexiones.service';
import { ActivatedRoute, NavigationStart, NavigationExtras, Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  correo:any;
  password:any;
  displayName:any;
  constructor(private db:ConexionesService,public router: Router, public route: ActivatedRoute) { }

  ngOnInit(): void {
  }



  registrar(){
    this.db.Registrar(this.correo,this.password).then((user)=>{
     
      if(user){
        let datos = {
         
          displayName:this.displayName,
          activo:true,
          fecha: new Date(),
          img:'',
          password: this.password,
          uid:user,
          correo:this.correo
        }
        this.db.setDataUser("users",datos,user).then((resp)=>{
          this.router.navigate(['/home/tools']);
        })
        
      
          
        

      }else{
        alert("Error. You need an account / Requiere de una cuenta");
      }
     
    })
  }
}
