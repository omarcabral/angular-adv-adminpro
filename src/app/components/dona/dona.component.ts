import { Component, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {
  @Input() titulo:string="sin titulo"
  @Input() labels: Label[]=['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  @Input() data:MultiDataSet=[
    [350, 450, 100],
  ];
  public colors:Color[]=[
    { backgroundColor:[ '#6857E6', '#009fEE', '#F02059']}
  ];
  public doughnutChartType: ChartType='doughnut';
}
