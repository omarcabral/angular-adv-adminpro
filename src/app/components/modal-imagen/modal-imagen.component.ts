import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {


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
  constructor(public modalImagenService:ModalImagenService, public uploadService:FileUploadService) { }

  ngOnInit(): void {
  }
  cerrarModal(){
    this.modalImagenService.cerrarModal();
  }
  cambiarImagen(event:any){
    var file:File;
    file=event.target.files[0];

    this.imagenSubir = file;
    console.log(this.imagenSubir);

    }

    subirImagen(){
      const id=this.modalImagenService.id;
      const tipo=this.modalImagenService.tipo;
      this.uploadService.actualizarFoto(this.imagenSubir, tipo, id)
      .then(img =>{
        this.Toast.fire({
          title:'Guardando imagen',
          icon:'success'
        });
        this.cerrarModal();
        this.modalImagenService.nuevaImagen.emit(img);
      }).catch(err=>{
        this.Toast.fire({
          title:'Error',
          icon:'error',
          text:err.err.msj
        });
      });
    }
}
