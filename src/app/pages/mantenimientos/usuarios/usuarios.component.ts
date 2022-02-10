import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';


import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios:number = 0;
  public usuarios:Usuario[]=[];
  public usuariosTemp:Usuario[]=[];
  public desde:number=0;
  public cargando:boolean=true;
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  public imgSub:Subscription;

  constructor(private usuarioService:UsuarioService, private busquedaService:BusquedasService, private modalImagenService:ModalImagenService) {
    this.imgSub=this.modalImagenService.nuevaImagen.pipe(
      delay(100)
    )
    .subscribe(img =>
      {
      console.log(img);
      this.cargarUsuarios();
      });
   }
  ngOnDestroy(): void {
    this.imgSub.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cambiarPagina(valor:number){
    this.desde+=valor;
    if (this.desde < 0){
      this.desde=0;
    }else if( this.desde>= this.totalUsuarios){
      this.desde-=valor;
    }
    this.cargarUsuarios();
  }
  cargarUsuarios(){
    this.cargando=true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe(({totalRegistros, usuarios})=>{
      this.totalUsuarios = totalRegistros;
      this.usuarios = usuarios;
      this.usuariosTemp=usuarios;
      this.cargando=false;
    });

  }


  buscar(termino:string){
    if (termino.length===0){
      return this.cargarUsuarios();
    }
      this.busquedaService.buscar('usuarios', termino)
      .subscribe((resp:any)=>{
        console.log(resp);
        this.usuarios=resp;
        console.log(this.usuarioService);
      });

  }

  eliminarUsuario(usuario:Usuario){
    if (usuario.uid===this.usuarioService.uid){
      return Swal.fire('Error', `No puedes eliminarte ${usuario.nombre} `, 'error');
    }else {
      Swal.fire({
        title: '¿Estas seguro?',
        text: "¿Quieres eliminar al usuario "+usuario.nombre+"?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borralo!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuarioService.eliminarUsuario(usuario)
            .subscribe(resp=>{
              this.cargarUsuarios();
              Swal.fire(
                'Eliminado!',
                `El usuario ${usuario.nombre} fue eliminado.`,
                'success'
              );

            });

        }
      })
      return true;

    }

  }
  cambiarRole(usuario:Usuario){
    this.usuarioService.guardarUsuario(usuario)
      .subscribe(resp=>{
        this.Toast.fire({
          title:`Actualizando al role de ${usuario.nombre}`,
          color:'green',
          icon:'success'
        })
      })
    console.log(usuario);
  }
  abrirModal(usuario:Usuario){
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid||'', usuario.img||'');

  }
}
