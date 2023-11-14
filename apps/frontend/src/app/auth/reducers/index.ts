import { createReducer, on } from '@ngrx/store';
import { UserAttributes } from '@vacay-planner/models';
import { AuthActions } from '../actions/auth-action-types';

export interface AuthState {
  user: UserAttributes | undefined;
}

export const initialAuthState: AuthState = {
  user: undefined,
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state, action) => {
    return { user: action.user };
  }),
  on(AuthActions.logout, (state, action) => {
    return { user: undefined };
  })
);
