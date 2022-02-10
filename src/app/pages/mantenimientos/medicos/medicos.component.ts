
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';



import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos:Medico[]=[];

  public cargando:boolean=true;

  public totalMedicos:number = 0;
  public medicosTemp:Medico[]=[];
  public desde:number=0;
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

  constructor(private medicoService:MedicoService,  private busquedaService:BusquedasService,  private modalImagenService:ModalImagenService) {
    this.imgSub=this.modalImagenService.nuevaImagen.pipe(
      delay(100)
    )
    .subscribe(img =>
      {
      console.log(img);
      this.cargarMedicos();
      });
   }
  ngOnDestroy(): void {
    this.imgSub.unsubscribe();
  }


  cargarMedicos(){
    this.cargando=true;
    this.medicoService.cargarMedicos(this.desde)
      .subscribe(({totalRegistros, medicos})=>{
        this.cargando=false;
        this.totalMedicos=totalRegistros;
        this.medicosTemp=medicos;
        this.medicos=medicos;
      })
  }



  ngOnInit(): void {
    this.cargarMedicos();
  }

  cambiarPagina(valor:number){
    this.desde+=valor;
    if (this.desde < 0){
      this.desde=0;
    }else if( this.desde>= this.totalMedicos){
      this.desde-=valor;
    }
    this.cargarMedicos();
  }

  buscar(termino:string){
    if (termino.length===0){
      return this.cargarMedicos();
    }
      this.busquedaService.buscar('medicos', termino)
      .subscribe((resp:any)=>{
        console.log(resp);
        this.medicos=resp;
      });

  }
  abrirModal(medico:Medico){
    console.log(medico);
    this.modalImagenService.abrirModal('medicos', medico._id||'', medico.img||'');

  }
  borrarMedico(medico:Medico){

    Swal.fire({
      title: '¿Estas seguro?',
      text: "¿Quieres eliminar al médico "+medico.nombre+"?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(medico)
          .subscribe(resp=>{
            this.cargarMedicos();
            Swal.fire(
              'Eliminado!',
              `El médico ${medico.nombre} fue eliminado.`,
              'success'
            );

          });

      }
    })
  }

}
