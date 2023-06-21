import { Component,OnInit } from '@angular/core';
import { GoogleScriptService } from '../../../shared/service/googleScriptService';

@Component({
  selector: 'app-coordenador',
  templateUrl: './coordenador.component.html',
  styleUrls: ['./coordenador.component.css']
})
export class CoordenadorComponent implements OnInit{
  efetivo: any[] = [];

  constructor(private googleService: GoogleScriptService){}

  ngOnInit() {
    this.googleService.getEfetivoData().subscribe(data => {
      this.efetivo = data;
    });
    console.log(this.efetivo)
  }
}
