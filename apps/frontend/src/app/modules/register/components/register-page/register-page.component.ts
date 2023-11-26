import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';
import { Subscription, first } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup;
  submitted = false;
  authSubscription: Subscription | undefined;
  pwSubscription: Subscription | undefined;
  pwConfSubscription: Subscription | undefined;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) this.router.navigate(['/']);
    });

    this.formGroup = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required, Validators.pattern(/@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/)])],
      username: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ]+(?:[-\s][a-zA-ZÀ-ÖØ-öø-ÿ]+)*$/),
          Validators.minLength(5),
          Validators.maxLength(40),
        ]),
      ],
      password: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,25}$/)])],
      passwordConfirm: ['', Validators.compose([Validators.required])],
    });

    this.pwSubscription = this.formGroup.get('password')?.valueChanges.subscribe(() => {
      this.formGroup.get('passwordConfirm')?.updateValueAndValidity();
    });

    this.formGroup.get('passwordConfirm')?.setValidators(this.passwordMatchValidator.bind(this));
  }

  onKeyDown(event: { keyCode: number }) {
    if (event.keyCode === 13) this.onSubmit();
  }

  passwordMatchValidator(): ValidatorFn {
    return (): ValidationErrors | null => {
      const pw1 = this.formGroup.get('password')?.value;
      const pw2 = this.formGroup.get('passwordConfirm')?.value;
      return pw2 && pw1 === pw2 ? null : { mismatch: true };
    };
  }

  isInvalid(fieldName: string): boolean {
    const control = this.formGroup.controls[fieldName];
    if (fieldName === 'passwordConfirm') this.passwordMatchValidator();
    return control.invalid && (control.dirty || control.touched);
  }

  isValid(fieldName: string): boolean {
    const control = this.formGroup.controls[fieldName];
    return control.valid && (control.dirty || control.touched);
  }

  isPassWordMatching() {
    const pwControl = this.formGroup.controls['password'];
    const confirmControl = this.formGroup.controls['passwordConfirm'];

    if (confirmControl.touched && pwControl.value !== confirmControl.value) confirmControl.setErrors({ mismatch: true });
    else confirmControl.setErrors(null);
  }

  onSubmit(): void {
    if (this.formGroup.invalid) return;
    if (this.submitted) return;

    if (this.formGroup.controls['password'].value !== this.formGroup.controls['passwordConfirm'].value) {
      this.toastr.error('The "Password" and "Confirm Password" fields were not matching', 'Error – Password mismatch!');
      this.formGroup.controls['passwordConfirm'].setErrors({ mismatch: true });
      return;
    }

    this.authService
      .register({
        email: this.formGroup.controls['email'].value,
        username: this.formGroup.controls['username'].value,
        password: this.formGroup.controls['password'].value,
      })
      .pipe(first())
      .subscribe({
        next: user => {
          this.submitted = true;
          this.formGroup.reset();
          this.toastr.success('You\'re successfully logged in.', `Welcome ${user.username ? ',' + user.username : '!'}`);
          this.authService.sendVerificationEmail({ id: user.id }).subscribe({
            next: () => this.toastr.success('Verification email sent', 'Success'),
            error: err => {
              this.toastr.error('Error during sending verification email', 'Email not sent');
              console.error('Error during sending verification email:', err);
            },
          });
        },
        error: err => {
          this.toastr.error(`Error during registration: ${JSON.stringify(err.error?.error || err)}`, 'Error!');
          console.error('Error during registration:', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.pwSubscription?.unsubscribe();
    this.pwConfSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }
}
