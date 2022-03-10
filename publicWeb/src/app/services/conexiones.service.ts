import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import { AngularFireAuth } from '@angular/fire/auth';
//import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
//import * as firebase from 'firebase/app'
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';


import 'firebase/storage';


@Injectable({
  providedIn: 'root'
})
export class ConexionesService {
  dbCollection:AngularFirestoreCollection<any>;
  arreglo:any;
 
  constructor(private http:HttpClient,private db:AngularFirestore,public afAuth: AngularFireAuth) {}

  isLoggedIn() {
  
   var promise = new Promise((resolve, reject) => {
     this.afAuth.authState.subscribe((user)=>{
        resolve(user);
     })
    })
    return promise;
   }
   salir(){
    
      return this.afAuth.auth.signOut();
    
   }
   
  addData(tabla,datos){
   
    let promesa = new Promise( (resolve, reject)=>{

          this.db.collection(tabla).add(datos).then((resp)=>{
            let id= resp.id;
            this.db.collection(tabla).doc(id).update({
              id:id
          
            });
            resolve(true)
          }).catch((err)=>{ reject(false) })


    })
    return promesa;
  }
  setData(tabla,datos,uid){
   
    let promesa = new Promise( (resolve, reject)=>{
          this.db.collection(tabla).doc(uid).set(datos).then((resp)=>{              
           
           
            resolve(true)
          }).catch((err)=>{ 
            reject(false) 
          })
    })
    return promesa;
  }
  setDataUser(tabla,datos,uid){
   
    let promesa = new Promise( (resolve, reject)=>{
          this.db.collection(tabla).doc(uid).set(datos).then((resp)=>{              
            this.afAuth.auth.currentUser.updateProfile({
              displayName:datos.displayName
            })
           
            resolve(true)
          }).catch((err)=>{ 
            reject(false) 
          })
    })
    return promesa;
  }

  getAllData(tabla,uid){
     
        var promise = new Promise((resolve, reject) => {
            this.arreglo=[];
            this.arreglo=this.db.collection(tabla,ref => ref.where('uid',"==",uid).where("estatus","==","pendiente")).valueChanges().subscribe(resp=>{
              resolve(resp)
            });
           
        })
        return promise
  }
 
getAllDataPopular(tabla){
     
  var promise = new Promise((resolve, reject) => {
      this.arreglo=[];
      this.arreglo=this.db.collection(tabla,ref => ref.orderBy("fecha", "desc").limit(20)).valueChanges().subscribe(resp=>{
        resolve(resp)
      });
     
  })
  return promise
}
getAllDataDescuento(tabla){
     
  var promise = new Promise((resolve, reject) => {
      this.arreglo=[];
      this.arreglo=this.db.collection(tabla,ref => ref.where("discount2",">=",10).orderBy("discount2","asc").orderBy("fecha","asc")).valueChanges().subscribe(resp=>{
        resolve(resp)
      });
     
  })
  return promise
}
getId(tabla,id){
     
  var promise = new Promise((resolve, reject) => {
      this.arreglo=[];
      this.arreglo=this.db.collection(tabla,ref => ref.where("id","==",id)).valueChanges().subscribe(resp=>{
        resolve(resp)
      });
     
  })
  return promise
}
getAllData2(tabla){
     
  var promise = new Promise((resolve, reject) => {
      this.arreglo=[];
      this.arreglo=this.db.collection(tabla).valueChanges().subscribe(resp=>{
        resolve(resp)
      });
     
  })
  return promise
}
getAllDataEstatus(tabla){
     
  var promise = new Promise((resolve, reject) => {
      this.arreglo=[];
      this.arreglo=this.db.collection(tabla).valueChanges().subscribe(resp=>{
        resolve(resp)
      });
     
  })
  return promise
}
getAllDataCategorias(tabla){
     
  var promise = new Promise((resolve, reject) => {
      this.arreglo=[];
      this.arreglo=this.db.collection(tabla).valueChanges().subscribe(resp=>{
        resolve(resp)
      });
     
  })
  return promise
}

getCliente(uid){
  // console.log(uid)
   var promise = new Promise((resolve, reject) => {

       this.db.collection("users", ref => ref.where('uid',"==",uid))
       .valueChanges().subscribe((data)=>{
      //   console.log(data)
           if(data.length>=1){
                 resolve(data)
           }else{
             resolve(false)
           }
       })
   })
   return promise;
 } 
  
  delete(id){
   console.log(id)
       this.db.collection("compras").doc(id).delete()
   
  }

  Registrar(email,password){
 
    var promise = new Promise((resolve,reject)=>{
     
      this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((user:any) => {
      
       console.log(user)

        resolve(user.user.uid)


    })
    
  })
  return promise;  
}
  
  login(email,password){
    
  
   
    var promise = new Promise((resolve,reject)=>{
      this.afAuth.auth.signInWithEmailAndPassword(email,password).then((user)=>{
       
        resolve(user);
     
      }).catch((err)=>{
    
        if(err.code=="auth/wrong-password"){
          alert("Contraseña Incorrecta")
        }else{
          alert("Requieres Registrarte");
        }
       
       
        
      })
    })
    return promise;   
  }
  search(tabla,columna,val) {

 
    return this.db.collection(tabla, ref => ref.orderBy(columna).startAt(val.charAt(0).toUpperCase() + val.slice(1)).endAt(val.charAt(0).toUpperCase() + val.slice(1) + '\uf8ff'));
  }

 /* subirImagen(img){
   
    let promesa = new Promise( (resolve, reject)=>{
    console.log(img)
      let storeRef = firebase.storage().ref();
      let nombreArchivo:string = new Date().valueOf().toString(); 

        var uploadTask: firebase.storage.UploadTask = storeRef.child(`firmas/${ nombreArchivo }`).putString(img.substring(22),'base64', { contentType: 'image/jpeg' }  );

     
        uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,(resp)=>{
          console.log(resp)
        }, (error) =>{ 
              
            reject(false);
        },()=>{
              uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
             
                resolve(downloadURL);
              });      
         })
    });
    return promesa;

}*/
/*
envarArray(array,nombre,correo,descripcion,telefono,cp,direccion,ciudad,total,pais,shipping){
            const httpOptions = {
              headers: new HttpHeaders({
                'Content-Type':  'application/x-www-form-urlencoded'
              })
            };
              
          this.http.post('https://codetrend.com.mx/hardcorefitness/email.php?nombre='+nombre+'&correo='+correo+'&descripcion='+descripcion+'&telefono='+telefono+'&cp='+cp+'&ciudad='+ciudad+'&total='+total+'&direccion='+direccion+'&pais='+pais+'&shipping='+shipping,array,httpOptions).subscribe((data) => {
               console.log(data)
          })            
}
envarEmail(nombre,correo,inscripcion,descripcion,tipo,total){
    
  this.http.get('https://indeweb.net/sistema/php/correoAut.php?nombre='+nombre+'&correo='+correo+'&descripcion='+descripcion+'&inscripcion='+inscripcion+'&tipo='+tipo+'&total='+total).subscribe((data) => {
      console.log(data)
  })  
}
updateArt(id,nombre,correo,descripcion,telefono,cp,direccion,ciudad,pais,shipping){
    
  this.db.collection("compras").doc(id).update({
    estatus:"pagado",
    fechaPago: new Date(),
    nombre:nombre,
    correo:correo,
    descripcion:descripcion,
    telefono:telefono,
    cp:cp,
    direccion:direccion,
    ciudad:ciudad,
    pais:pais,
    shipping:shipping
  })
}

updateStock(id,stock){
    
  this.db.collection("articulos").doc(id).update({
    stock:stock
  })
}
*/



/*
 getPagos(uid){
  
   var promise = new Promise((resolve, reject) => {
      var arreglo = [];
       this.db.collection("pagos", ref => ref.where('uid',"==",uid))
       .valueChanges().subscribe((data:any)=>{
         console.log(data)
           if(data.length>=1){

              for(var i=0;i<data.length;i++){
                 
                if(data[i].mes==0){var mess="January";}
                if(data[i].mes==1){var mess="February";}
                if(data[i].mes==2){var mess="March";}
                if(data[i].mes==3){var mess="April";}
                if(data[i].mes==4){var mess="May";}
                if(data[i].mes==5){var mess="June";}
                if(data[i].mes==6){var mess="July";}
                if(data[i].mes==7){var mess="August";}
                if(data[i].mes==8){var mess="September";}
                if(data[i].mes==9){var mess="October";}
                if(data[i].mes==10){var mess="November";}
                if(data[i].mes==11){var mess="December";}

                let datos = {
                  descripcion:data[i].descripcion,
                  estatus:data[i].estatus,
                  mes:mess,
                  year:data[i].year
                }

                arreglo.push(datos);
              }

                 resolve(arreglo)
           }else{
             resolve(false)
           }
       })
   })
   return promise;
 }*/
  
 

      
    

  
}
