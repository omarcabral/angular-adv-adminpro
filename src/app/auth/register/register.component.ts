import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  public formSubmited=false;



  public registerForm= this.fb.group({
    nombre:['Fernando', [Validators.required, Validators.minLength(3)]],
    apellido:['Cabral', [Validators.required, Validators.minLength(3)]],
    email:['test100@gmail.com', [Validators.required, Validators.email]],
    password:['123456', Validators.required],
    password2:['123456', Validators.required],
    terminos:[false, Validators.required],
  },{
    validators:this.passwordsIguales('password', 'password2')
  });
  constructor(private fb:FormBuilder, private usuarioService:UsuarioService, private router:Router) { }

  crearUsuario(){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    this.formSubmited=true;
    console.log(this.registerForm.value);
    if (this.registerForm.invalid){
      return;
    }

    this.usuarioService.crearUSuario(this.registerForm.value)
      .subscribe(resp=>{
        Toast.fire({
          icon: 'success',
          title: 'Usuario creado'
        });
        this.router.navigateByUrl('/');
      }, (err)=> {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }

  campoNoValido(campo:string):Boolean{

    if (!this.registerForm.get(campo)?.valid && this.formSubmited){
      return true;
    }
    else{
      return false;
    }
  }
  aceptaTerminos(){
    return !this.registerForm.get('terminos')?.value && this.formSubmited;
  }
  constrasenasNoValidas(){
    const pass1=this.registerForm.get('password')?.value;
    const pass2=this.registerForm.get('password2')?.value;
    if (pass1!==pass2 && this.formSubmited)
    {
      return true;
    }else{
      return false;
    }

  }
  passwordsIguales(pass1Name:string, pass2Name:string){

    return ( formGroup: FormGroup)=>{
      const pass1Control=formGroup.get(pass1Name);
      const pass2Control=formGroup.get(pass2Name);
      if (pass1Control?.value=== pass2Control?.value){
        pass2Control?.setErrors(null);
      }
      else{
        pass2Control?.setErrors({noEsIgual:true});
      }
    }

  }
}
