import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {

  /** Recibo el icono, el tipo de item, el autocomplete, lo que va a decir en el label,  y el control  esto lo recibo del html por
   * medio de un app-custom-input  ver aut.html
   */
  @Input() icon: string
  @Input() type: string;
  @Input() autocomplete: string
  @Input() label: string
  @Input() control: FormControl;
  
  isPassword: boolean;   /* Para los campos que sean de tipo password */
  hide: boolean = true;


  constructor() { }

  ngOnInit() {  
    if(this.type =='password') this.isPassword = true 
  }

  showOrHidePassword(){
    /* lo que hace es colocar visible como tipo texto, invisble como tipo password, pero solo para aquellos que sean passowrd */
    this.hide = !this.hide
    if(this.hide){
      this.type="password"
    }else{
      this.type ="text"
    }
  }
}
