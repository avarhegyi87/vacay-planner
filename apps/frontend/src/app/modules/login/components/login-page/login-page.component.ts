import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern(/@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/),
        ]),
      ],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  onKeyDown(event: { keyCode: number }) {
    if (event.keyCode === 13) this.onSubmit();
  }

  onSubmit(): void {
    if (this.formGroup.invalid) return;

    this.authService
      .login({
        email: this.formGroup.controls['email'].value,
        password: this.formGroup.controls['password'].value,
      })
      .pipe(first())
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) =>
          alert(`Error during registration: ${JSON.stringify(err)}`),
      });
  }
}
