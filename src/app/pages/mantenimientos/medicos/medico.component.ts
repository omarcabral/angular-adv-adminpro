import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit, OnDestroy{

  public medicoSeleccionado:Medico = new Medico('','','');
  public medicoForm:FormGroup;
  public imgSub:Subscription;
  public hospitales:Hospital[]=[];
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
  public hospitalSeleccionado:Hospital= new Hospital('','');
  constructor(private fb:FormBuilder, private router:Router, private modalImagenService:ModalImagenService, private medicoService:MedicoService, private hospitalService:HospitalService, private activateRoute:ActivatedRoute) {

    this.medicoForm=this.fb.group({
      nombre:[this.medicoSeleccionado.nombre, Validators.required],
      hospital:[this.medicoSeleccionado.hospital, Validators.required]
    });


    this.imgSub=this.modalImagenService.nuevaImagen.pipe(
      delay(100)
    )
    .subscribe(img =>
      {
      this.medicoSeleccionado.img=img;
      });
   }
  ngOnDestroy(): void {
    this.imgSub.unsubscribe();
  }

  cargarMedico(id:string){
    console.log('este'+id);
    this.medicoService.getMedico(id).subscribe(
      (medico)=>{
        console.log("este es"+medico);
        if (medico._id===''){
          return this.router.navigateByUrl(`/dashboard/medicos`);
        }

        this.medicoSeleccionado=medico;
        this.hospitalSeleccionado=this.hospitales.find(h=> h._id===this.medicoSeleccionado.hospital?._id)|| new Hospital('', '');
        this.medicoForm.setValue({'nombre': medico.nombre, 'hospital':medico.hospital?._id});
        return;
      },(err=>{
        this.Toast.fire('Error', 'ocurrio un error al obtener los datos del médico', 'error');
        return this.router.navigateByUrl(`/dashboard/medicos`);
      })
    )
  }
  ngOnInit(): void {
    this.medicoForm.get('hospital')?.valueChanges.subscribe(
      (hospitalId)=>{
        this.hospitalSeleccionado=this.hospitales.find(h=> h._id===hospitalId)|| new Hospital('', '');

      }
    )
    this.cargarHospitales();
    this.activateRoute.params.subscribe(({id})=>
    {
        if (id && id!=='nuevo'){
          this.cargarMedico(id);
        }
      }
    );
  }
  cargarHospitales(){
    this.hospitalService.getHospitales()
      .subscribe(resp=>{
        this.hospitales=resp.hospi;
        this.hospitalSeleccionado=this.hospitales.find(h=> h._id===this.medicoSeleccionado.hospital?._id)|| new Hospital('', '');
      })


  }

  onChange(deviceValue:any) {
    console.log(deviceValue);
  }
  guardarMedico(){
    this.medicoSeleccionado.nombre=this.medicoForm.get('nombre')?.value;
    this.medicoSeleccionado.hospital=this.medicoForm.get('hospital')?.value;
    console.log(this.medicoSeleccionado._id);
    if (this.medicoSeleccionado._id===''){
      //crear medico
      this.medicoService.crearMedico(this.medicoSeleccionado).subscribe
        (resp=>{
          this.Toast.fire('Guardado', this.medicoSeleccionado.nombre+ ' guardado', 'success');
          this.router.navigateByUrl(`/dashboard/medico/${resp._id}`);
        }, error=>{
          this.Toast.fire('Error', error.msj, 'error');
        })
    }
    else{
      console.log('va a actualizar');
      //actualizar
      this.medicoService.actualizarMedico(this.medicoSeleccionado).subscribe
        (resp=>{
          this.Toast.fire('Editado', this.medicoSeleccionado.nombre+ ' editado', 'success');
        }, error=>{
          this.Toast.fire('Error', error.msj, 'error');
        })
    }


  }

  abrirModal(medico:Medico){
    console.log(medico);
    this.modalImagenService.abrirModal('medicos', medico._id||'', medico.img||'');

  }
}
