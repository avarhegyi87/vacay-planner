import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { VerifyPageComponent } from './components/verify-page/verify-page.component';

@NgModule({
  declarations: [RegisterPageComponent, VerifyPageComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class RegisterModule {}
