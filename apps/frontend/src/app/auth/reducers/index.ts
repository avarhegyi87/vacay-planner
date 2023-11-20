import { createReducer, on } from '@ngrx/store';
import { User } from '@vacay-planner/models';
import { AuthActions } from '../actions/auth-action-types';

export interface AuthState {
  user: User | undefined;
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
