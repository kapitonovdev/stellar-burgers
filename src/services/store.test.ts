import { rootReducer } from './store';

describe('rootReducer', () => {
  it('returns initial state when called with undefined and unknown action', () => {
    const state = rootReducer(undefined as any, { type: 'UNKNOWN_ACTION' } as any);
    expect(state).toEqual({
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      },
      ingredients: { ingredients: [], isLoading: false, error: null },
      burgerConstructor: { bun: null, ingredients: [] },
      orders: {
        order: null,
        orderRequest: false,
        orderModalData: null,
        isLoading: false,
        error: null
      },
      feed: {
        orders: [],
        userOrders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      }
    });
  });
});


