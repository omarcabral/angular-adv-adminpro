import { Component } from '@angular/core';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {
  public labels1: string[]=['Ventas en tienda', 'Ventas en linea', 'Ventas por otro lado'];
  public data1=[
    [50, 200, 500],
  ];

  public labels2: string[]=['Ventas en tienda Sucursal', 'Ventas en linea Sucursal', 'Ventas por otro lado Sucursal'];
  public data2=[
    [20, 300, 300],
  ];
  public colors1:Color[]=[
    { backgroundColor:[ '#6857E6', '#009fEE', '#F02059']}
  ]
}
