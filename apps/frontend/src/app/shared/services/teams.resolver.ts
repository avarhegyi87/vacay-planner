import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { TeamService } from '../../modules/teams/services/team.service';
import { AuthService } from '../../auth/services/auth.service';

export const teamsResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> => {
  const authService = inject(AuthService);
  const teamsService = inject(TeamService);
  switch (state.url) {
    case '/':
    case '':
      return teamsService.myTeams();
    default:
      return EMPTY;
  }
};
