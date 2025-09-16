import reducer, { fetchFeeds, fetchUserOrders } from './feed';
import { TOrder } from '../../utils/types';

describe('feed slice', () => {
  const order: TOrder = {
    _id: 'o1',
    status: 'done',
    name: 'Order 1',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
    number: 1,
    ingredients: ['i1']
  };

  it('should return initial state', () => {
    const state = reducer(undefined, { type: 'unknown' } as any);
    expect(state).toEqual({
      orders: [],
      userOrders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    });
  });

  it('should handle fetchFeeds pending/fulfilled/rejected', () => {
    let state = reducer(undefined, { type: fetchFeeds.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();

    state = reducer(state, {
      type: fetchFeeds.fulfilled.type,
      payload: { orders: [order], total: 10, totalToday: 2 }
    });
    expect(state.isLoading).toBe(false);
    expect(state.orders).toHaveLength(1);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(2);

    state = reducer(state, {
      type: fetchFeeds.rejected.type,
      error: { message: 'Err' }
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Err');
  });

  it('should handle fetchUserOrders pending/fulfilled/rejected', () => {
    let state = reducer(undefined, { type: fetchUserOrders.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();

    state = reducer(state, {
      type: fetchUserOrders.fulfilled.type,
      payload: [order]
    });
    expect(state.isLoading).toBe(false);
    expect(state.userOrders).toHaveLength(1);

    state = reducer(state, {
      type: fetchUserOrders.rejected.type,
      error: { message: 'Err' }
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Err');
  });
});
