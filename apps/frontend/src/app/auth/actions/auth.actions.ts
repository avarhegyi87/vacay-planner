import { createAction, props } from '@ngrx/store';
import { User } from '@vacay-planner/models';

enum AuthActionTypes {
  Login = '[Auth] Login',
  Logout = '[Auth] Logout',
}

export const login = createAction(AuthActionTypes.Login, props<{user: User}>());

export const logout = createAction(AuthActionTypes.Logout);
