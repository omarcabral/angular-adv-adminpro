import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map, catchError, delay  } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

import { loginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form-interface';
import { Usuario } from '../models/usuario.model';

const base_url=environment.base_url;
declare const gapi:any;
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2:any='';
  public usuario?:Usuario;
  constructor(private http:HttpClient, private router:Router, private ngZone:NgZone) {
    this.googleInit();

   }

  googleInit(){

    return new Promise<void>( resolve =>{
      console.log('google init');
      gapi.load('auth2', ()=>{
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '613169302179-rlfrgncfflrdqo2uvqu9d626juvda3ui.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    })

  }
  logout(){
    localStorage.removeItem('token');

    this.auth2.signOut().then(()=>{
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login');
      });

    });

  }
  validarToken():Observable<boolean>{
    const token=this.token;
    return this.http.get(`${base_url}/login/renew`, {
      headers:{
        'x-token':token
      }
    }).pipe(
      map((resp:any)=>{
        const { email, nombre, apellido, google, role, uid, img=''} = resp.usuario;
        this.usuario=new Usuario(nombre,email, apellido,'', img, uid, role, google);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError(error=> {
        console.log(error);
        return of(false);
      })
    );
  }
  get headers(){
    return {
      headers:{
        'x-token':this.token
      }
    }
  }
  get token():string{
    return localStorage.getItem('token')||'';
  }
  get uid():String{
    return this.usuario?.uid || '';
  }
  crearUSuario( formData:RegisterForm){

    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp:any)=>{
          localStorage.setItem('token', resp.token)

        })
      )
  }

  actualizarPerfil(data:{email:string, nombre:string, apellido:string, role:string }){
    data={
      ...data,
      role:this.usuario?.role||''
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers)

  }

  login( formData:loginForm){

    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp:any)=>{
          localStorage.setItem('token', resp.token)

        })
      )
  }
  loginGoogle( token:any){
    return this.http.post(`${base_url}/login/google`, {token})
      .pipe(
        tap((resp:any)=>{
          localStorage.setItem('token', resp.token)

        })
      )
  }

  cargarUsuarios(desde:number=0){
    const url=`${base_url}/usuarios?desde=${desde}`;

    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        delay(1000),
        map(resp=>{
          const usuarios=resp.usuarios.map(
            user=> new Usuario(user.nombre, user.email, user.apellido, '', user.img, user.uid, user.role, user.google)
            );

          return {
            totalRegistros:resp.totalRegistros,
            usuarios
          };
        })
      )

  }
  eliminarUsuario(usuario:Usuario){
    const url=`${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario:Usuario){

    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);

  }
}
