import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
    private router: Router,
    private toastr: ToastrService,
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
        next: (user) => {
          this.toastr.success("You're successfully logged in.", `Welcome ${user.username ? ',' + user.username : '!'}`);
          this.router.navigate(['/']).then(() => {
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          });
        },
        error: (err) => {
          this.toastr.error('Error during login', 'Error!');
          console.error(`Error during registration: ${JSON.stringify(err)}`);
        },
      });
  }
}
