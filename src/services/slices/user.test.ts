import reducer, {
  registerUser,
  loginUser,
  checkUserAuth,
  updateUser,
  logoutUser
} from './user';
import { TUser } from '../../utils/types';

describe('user slice', () => {
  const user: TUser = { email: 'test@example.com', name: 'Tester' };

  it('should return initial state', () => {
    const state = reducer(undefined, { type: 'unknown' } as any);
    expect(state).toEqual({
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null
    });
  });

  it('should handle register lifecycle', () => {
    let state = reducer(undefined, { type: registerUser.pending.type });
    expect(state.isLoading).toBe(true);
    state = reducer(state, {
      type: registerUser.fulfilled.type,
      payload: user
    });
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
    state = reducer(state, {
      type: registerUser.rejected.type,
      error: { message: 'Reg failed' }
    });
    expect(state.error).toBe('Reg failed');
  });

  it('should handle login lifecycle', () => {
    let state = reducer(undefined, { type: loginUser.pending.type });
    expect(state.isLoading).toBe(true);
    state = reducer(state, { type: loginUser.fulfilled.type, payload: user });
    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
    state = reducer(state, {
      type: loginUser.rejected.type,
      error: { message: 'Login failed' }
    });
    expect(state.error).toBe('Login failed');
  });

  it('should handle checkUserAuth fulfilled/rejected', () => {
    let state = reducer(undefined, {
      type: checkUserAuth.fulfilled.type,
      payload: user
    });
    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);

    state = reducer(undefined, { type: checkUserAuth.rejected.type });
    expect(state.isAuthChecked).toBe(true);
  });

  it('should update user and logout', () => {
    let state = reducer(undefined, { type: updateUser.pending.type });
    expect(state.isLoading).toBe(true);
    state = reducer(state, { type: updateUser.fulfilled.type, payload: user });
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(user);

    state = reducer(state, { type: logoutUser.fulfilled.type });
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });
});
