import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { TeamService } from '../../modules/teams/services/team.service';
import { AuthService } from '../../auth/services/auth.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const teamsResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
