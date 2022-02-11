import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { FileUploadService } from 'src/app/services/file-upload.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})


export class PerfilComponent implements OnInit {

  public perfilForm:FormGroup;

  public imagenSubir!: File;

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
  public usuario:Usuario= new Usuario('','','','USER_ROLE');

  constructor(private fb:FormBuilder, private usuarioService:UsuarioService, private uploadService:FileUploadService) {
    this.usuario=this.usuarioService.usuario||new Usuario('', '', '','USER_ROLE', '');

    this.perfilForm = this.fb.group({
      nombre:[this.usuario.nombre, Validators.required],
      apellido:[this.usuario.apellido, Validators.required],
      email:[this.usuario.email, [Validators.email, Validators.required]]
    });

  }

  actualizarPerfil(){
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
    .subscribe(()=>
      {
        const{nombre, apellido, email}=this.perfilForm.value;
        this.usuario.nombre=nombre;
        this.usuario.apellido=apellido;
        this.usuario.email=email;
        this.Toast.fire({
          title:'Guardando...',
          color:'green',
          icon:'success'
        })
    }, (err:any)=>{
      this.Toast.fire({
        title:'Error',
        text:err.error.msj,
        color:'red',
        icon:'error'
      })
    });

  }

  cambiarImagen(event:any){
    var file:File;
    file=event.target.files[0];

    this.imagenSubir = file;

    }



  subirImagen(){
    this.uploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid||'')
    .then(img =>{
      this.usuario.img=img;
      this.Toast.fire({
        title:'Guardando imagen',
        icon:'success'
      });
    }).catch(err=>{
      this.Toast.fire({
        title:'Error',
        icon:'error',
        text:err.err.msj
      });
    });
  }

  ngOnInit(): void {
  }


}
