import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewTeamComponent } from './components/view-team/view-team.component';
import { CreateTeamComponent } from './components/create-team/create-team.component';

const routes: Routes = [
  {
    path: 'view/:id',
    component: ViewTeamComponent,
  },
  {
    path: 'create',
    component: CreateTeamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule {}
