import { createAction, props } from '@ngrx/store';
import { UserAttributes } from '@vacay-planner/models';

enum AuthActionTypes {
  Login = '[Auth] Login',
  Logout = '[Auth] Logout',
}

export const login = createAction(AuthActionTypes.Login, props<{user: UserAttributes}>());

export const logout = createAction(AuthActionTypes.Logout);
