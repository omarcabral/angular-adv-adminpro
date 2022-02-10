import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';
import { Usuario } from '../models/usuario.model';

const base_url=environment.base_url;
@Injectable({
  providedIn: 'root'
})

export class BusquedasService {

  constructor(private http:HttpClient) { }

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

  private transformarUsuarios(resultdos:any[]):Usuario[]{

    return resultdos.map(
      user=> new Usuario(user.nombre, user.email, user.apellido, '', user.img, user.uid, user.role, user.google)
    );
  }
  private transformarHospitales(resultados:any[]):Hospital[]{
    return resultados;
  }
  private transformarMedicos(resultados:any[]):Medico[]{
    return resultados;
  }

  buscar(
    tipo:'usuarios'|'medicos'|'hospitales',
    termino:string
    ){
    const url=`${base_url}/todo/coleccion/${tipo}/${termino}`;

    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map((resp:any) =>{
          switch (tipo) {
            case 'usuarios':
                return this.transformarUsuarios(resp.resultados);
            case 'hospitales':
                return this.transformarHospitales(resp.resultados);
            case 'medicos':
                return this.transformarMedicos(resp.resultados);
            default:
              return this.transformarUsuarios(resp.resultados);
              break;
          }
        })
      )

  }

}
