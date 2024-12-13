import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title: string;  /** recibe la variable de auth.page.html para mostrar en header.component.html  {{ title }} */
  @Input() isModal: boolean;
  @Input() showMenu: boolean = false;

  constructor() { }

  ngOnInit() {}

}
