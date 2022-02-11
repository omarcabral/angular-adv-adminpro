import { Component, OnDestroy, OnInit } from '@angular/core';
import { pipe, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})

export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales:Hospital[]=[];
  public cargando:boolean=true;

  public totalHospitales:number = 0;
  public hospitalesTemp:Hospital[]=[];
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

  constructor(private hospitalService:HospitalService, private busquedaService: BusquedasService, private modalImagenService:ModalImagenService) {
    this.imgSub=this.modalImagenService.nuevaImagen.pipe(
      delay(100)
    )
    .subscribe(img =>
      {
      this.cargarHospitales();
      });
   }
  ngOnDestroy(): void {
    this.imgSub.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();
  }
  cargarHospitales(){
    this.cargando=true;
    this.hospitalService.cargarHospitales(this.desde)
      .subscribe(({totalRegistros, hospi})=>{
        this.cargando=false;
        this.totalHospitales=totalRegistros;
        this.hospitalesTemp=hospi;
        this.hospitales=hospi;
      })
  }

  cambiarPagina(valor:number){
    this.desde+=valor;
    if (this.desde < 0){
      this.desde=0;
    }else if( this.desde>= this.totalHospitales){
      this.desde-=valor;
    }
    this.cargarHospitales();
  }
  buscar(termino:string){
    if (termino.length===0){
      return this.cargarHospitales();
    }
      this.busquedaService.buscar('hospitales', termino)
      .subscribe((resp:any)=>{
        this.hospitales=resp;
      });

  }
  guardarCambios(hospital:Hospital){
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(resp=>{
        this.Toast.fire({
          title:'actualizando datos',
          icon:'success',
          text:hospital.nombre
        })
      })
  }
  eliminarHospital(hospital:Hospital){
    this.hospitalService.eliminarHospital(hospital._id)
      .subscribe(()=>{
        this.Toast.fire({
          title:'Eliminando hospital',
          icon:'info',
          text:hospital.nombre
        });

        this.cargarHospitales();
      });
  }

  async nuevoHospital(){
    const { value: valor } = await Swal.fire({
      input:'text',
      title:'Agregar hospital',
      showCancelButton:true,
      confirmButtonText:'Guardar',
      inputPlaceholder: 'Nombre del hospital'
    })

    if (valor) {
      this.hospitalService.crearHospital(valor)
        .subscribe((resp: any)=>{
          Swal.fire(`hospital  ${valor} guardado`);
          this.cargarHospitales();
        });


    }
  }
  abrirModal(hospital:Hospital){
    this.modalImagenService.abrirModal('hospitales', hospital._id||'', hospital.img||'');

  }
}
