import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from "ngx-bootstrap/collapse";

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    CollapseModule,
  ],
  exports: [NavbarComponent],
})
export class SharedModule {}
