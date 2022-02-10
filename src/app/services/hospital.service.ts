import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CargarHospitales } from '../interfaces/cargar-hospitales.interface';
import { Hospital } from '../models/hospital.model';

const base_url=environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class HospitalService {

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

  cargarHospitales(desde:number=0){
    const url=`${base_url}/hospitales?desde=${desde}`;

    return this.http.get<CargarHospitales>(url, this.headers)
      .pipe(
        delay(1000),
        map(resp => {
          const hospi = resp.hospitales.map(
            hosp => new Hospital(hosp._id, hosp.nombre, hosp.img, hosp.usuario)
          );
          return {
            totalRegistros:resp.totalRegistros,
            hospi
          };
        })
      );

  }

  getHospitales(){
    const url=`${base_url}/hospitales/all`;

    return this.http.get<CargarHospitales>(url, this.headers)
      .pipe(
        delay(1000),
        map(resp => {
          const hospi = resp.hospitales.map(
            hosp => new Hospital(hosp._id, hosp.nombre, hosp.img, hosp.usuario)
          )
          return {
            hospi
          };
        })
      );
  }

  crearHospital(nombre:string){
    const url=`${base_url}/hospitales`;
    return this.http.post(url, {nombre}, this.headers)

  }
  actualizarHospital(_id:string, nombre:string){
    const url=`${base_url}/hospitales/${_id}`;
    return this.http.put(url, {nombre}, this.headers);
  }
  eliminarHospital(_id:string){
    const url=`${base_url}/hospitales/${_id}`;
    return this.http.delete(url,  this.headers);
  }
}
