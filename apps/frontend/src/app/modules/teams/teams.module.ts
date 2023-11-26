import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamsRoutingModule } from './teams-routing.module';
import { CreateTeamComponent } from './components/create-team/create-team.component';
import { ViewTeamComponent } from './components/view-team/view-team.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeamAdminPanelComponent } from './components/team-admin-panel/team-admin-panel.component';

@NgModule({
  declarations: [CreateTeamComponent, ViewTeamComponent, TeamAdminPanelComponent],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class TeamsModule {}
