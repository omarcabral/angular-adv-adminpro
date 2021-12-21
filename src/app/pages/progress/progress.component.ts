import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'
  ]
})
export class ProgressComponent implements OnInit {


  progreso1: number=25;
  progreso2: number=35;
  constructor() { }

  ngOnInit(): void {
  }
  getProgreso1(){
    return `${ this.progreso1 }%`;
  }
  getProgreso2(){
    return `${ this.progreso2 }%`;
  }

  cambioValorHijo(numero:number){
    console.log('Hey');
  }
}
