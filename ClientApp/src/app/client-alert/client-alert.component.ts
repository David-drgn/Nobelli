import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-client-alert',
  templateUrl: './client-alert.component.html',
  styleUrls: ['./client-alert.component.css'],
})
export class ClientAlertComponent {
  form = this.formBuilder.group({
    // email: ['', Validators.required],
    // password: [
    //   '',
    //   [
    //     Validators.required,
    //     Validators.minLength(8),
    //     Validators.pattern(/[A-Z]/), // letra maiúscula
    //     Validators.pattern(/[a-z]/), // letra minúscula
    //     Validators.pattern(/[0-9]/), // número
    //     Validators.pattern(/[!@#$%^&*(),.?":{}|<>]/), // caracter especial
    //   ],
    // ],
    // check: [false],
  });

  constructor(private formBuilder: FormBuilder) {}
}
