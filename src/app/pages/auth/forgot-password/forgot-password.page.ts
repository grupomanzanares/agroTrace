import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  public inputs = new FormGroup({
    cedula: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$')])
  })

  constructor() { }

  ngOnInit() {
  }

}
