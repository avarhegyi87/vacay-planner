import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { VerifyPageComponent } from './components/verify-page/verify-page.component';

const routes: Routes = [
  { path: '', component: RegisterPageComponent },
  { path: 'verify', component: VerifyPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRoutingModule {}
