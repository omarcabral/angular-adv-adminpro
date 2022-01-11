import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs:Subscription;

  constructor() {


/*
    this.retornaObservable().pipe(
      retry(1)
    )
    .subscribe(
      valor => console.log('Subs:', valor),
      (err)=>console.warn('Error', err),
      ()=> console.info("Terminado")
    ); */

    this.intervalSubs=this.retornaIntervalo()
    .subscribe(
      (valor)=>console.log( valor )
    );
  }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo():Observable<number>{
    return interval(100)
    .pipe(
      map(valor=>valor+1),
      filter( valor => (valor % 2 === 0)? true : false),
      take(10)
      );
  }

  retornaObservable():Observable<number>{
    let i=-1;

    const obs$=new Observable<number>( observer => {

      const intervalo=setInterval(()=>{
        i++;
        observer.next(i);

        if (i === 4){
          clearInterval(intervalo);
          observer.complete();
        }

        if (i===2){
          console.log('2... error');
          observer.error("i llego al valor de 2");
        }
      }, 1000)
    } );
    return  obs$;
  }


}
