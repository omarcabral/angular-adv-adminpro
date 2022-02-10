import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { CargarMedicos } from '../interfaces/cargar-medicos.interface';
import { Medico } from '../models/medico.model';
import { CargarMedico } from '../interfaces/cargar-medico.interface';


const base_url=environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class MedicoService {

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
  cargarMedicos(desde:number=0){
    const url=`${base_url}/medicos?desde=${desde}`;

    return this.http.get<CargarMedicos>(url, this.headers)
      .pipe(
        delay(1000),
        map(resp => {
          const medicos = resp.medicos.map(
            medi => new Medico(medi._id, medi.nombre, medi.img, medi.usuario, medi.hospital)
          );
          return {
            totalRegistros:resp.totalRegistros,
            medicos
          };
        })
      );

  }

  eliminarMedico(medico:Medico){
    const url=`${base_url}/medicos/${medico._id}`;
    return this.http.delete(url, this.headers);
  }

  crearMedico(medico:Medico){
    const url=`${base_url}/medicos/`;
    return this.http.post<CargarMedico>(url, medico, this.headers)
      .pipe(
        map( resp=> {
          return resp.medico;
        })
      )
  }

  actualizarMedico(medico:Medico){
    const url=`${base_url}/medicos/${medico._id}`;
    return this.http.put<CargarMedico>(url, medico, this.headers)
      .pipe(
        map( resp=> {
          return resp.medico;
        })
      )
  }

  getMedico(id:string){
    const url=`${base_url}/medicos/${id}`;
    return this.http.get<CargarMedico>(url, this.headers)
    .pipe(
      map( resp => {
        return resp.medico;
      })
    );
  }
}


