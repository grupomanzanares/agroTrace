import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent  implements OnInit {
  public subtittle : string = "Sistema de Trazabilidad en el Agro"
  constructor() { }

  ngOnInit() {}

}
