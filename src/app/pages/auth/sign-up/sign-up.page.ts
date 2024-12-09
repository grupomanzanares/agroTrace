import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  public loginForm = new FormGroup({
    identificacion: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]),
    password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
    name: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    celphone: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$')])
  });

  constructor() { }

  ngOnInit() {
  }

}
