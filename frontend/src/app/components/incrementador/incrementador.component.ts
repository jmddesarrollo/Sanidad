import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {
  @Input() leyenda: string;
  @Input() progreso: number;

  @Output() nuevoValor: EventEmitter <number> = new EventEmitter();

  @ViewChild('txtProgreso') txtProgreso: ElementRef;

  constructor() {
    this.progreso = 50;
    this.leyenda = 'Leyenda';
  }

  ngOnInit() {

  }

  // Al usar la caja de texto del input.
  onChanges(newValue) {
    if (newValue >= 100) {
      this.progreso = 100;
    }

    if (newValue <= 0) {
      this.progreso = 0;
    }

    // const elementHTML: any = (document.getElementsByName('progreso')[0] as HTMLInputElement);
    // elementHTML.value = Number(this.progreso);

    this.txtProgreso.nativeElement.value = this.progreso;

    this.nuevoValor.emit(this.progreso);
  }

  // Al usar botones de aumentar o decrementar.
  cambiarValor(valor: number) {
    this.progreso = this.progreso + valor;

    if (this.progreso >= 100) {
      this.progreso = 100;
    }

    if (this.progreso <= 0) {
      this.progreso = 0;
    }

    this.nuevoValor.emit(this.progreso);

    this.txtProgreso.nativeElement.focus();
  }
}
