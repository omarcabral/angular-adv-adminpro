import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    /*
    let promesa = new Promise( ( resolve, reject ) => {
      if (false)
      {
        resolve('Hola mundo');
      }
      else{
        reject('Algo salio mal');
      }

    });
    promesa.then( (mensaje) => {
      console.log('Hey termine' + mensaje);
    }).catch(error=>console.log("Error en la promesa"));
    console.log('fin del init');
    */

    this.getUsuarios().then(usuarios=>{
      console.log(usuarios);
    });

  }
  getUsuarios(){

    const promesa= new Promise( resolve=>{
      fetch('https://reqres.in/api/users')
    .then(resp => resp.json())
    .then(body => resolve( body.data ));
    });

    return promesa;


  }

}
