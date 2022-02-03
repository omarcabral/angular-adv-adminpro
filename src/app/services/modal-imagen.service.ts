import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EventEmitter } from '@angular/core';

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal:boolean=true;
  public tipo:'usuarios'|'medicos'|'hospitales'='usuarios';
  public id:string='';
  public img:string='no-img';

  public nuevaImagen:EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal(){
    return this._ocultarModal;
  }
  abrirModal(
    tipo:'usuarios'|'medicos'|'hospitales',
    id:string,
    img:string
  ){
    this.id=id;
    this.img=img;
    this.tipo=tipo;
    this._ocultarModal=false;
    if (img.includes('hhtps'))
    {
      this.img=img;
    }
    else {
      this.img=`${base_url}/upload/${tipo}/${img}`;
      console.log(`ruta:o${base_url}/upload/${tipo}/${img}`);
    }
  }
  cerrarModal(){
    this._ocultarModal=true;
  }
  // http://localhost:3000/api/upload/usuarios/64594504-31d3-4eaa-873d-e49aeae5d54a.jpg
  constructor() { }
}
