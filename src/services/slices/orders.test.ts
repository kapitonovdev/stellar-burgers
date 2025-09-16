import reducer, {
  createOrder,
  getOrderByNumber,
  clearOrder,
  setOrderModalData,
  clearOrderModalData
} from './orders';
import { TOrder } from '../../utils/types';

describe('orders slice', () => {
  const order: TOrder = {
    _id: 'o1',
    status: 'done',
    name: 'Order 1',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
    number: 42,
    ingredients: ['i1']
  };

  it('should return initial state', () => {
    const state = reducer(undefined, { type: 'unknown' } as any);
    expect(state).toEqual({
      order: null,
      orderRequest: false,
      orderModalData: null,
      isLoading: false,
      error: null
    });
  });

  it('should handle createOrder lifecycle', () => {
    let state = reducer(undefined, { type: createOrder.pending.type });
    expect(state.orderRequest).toBe(true);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();

    state = reducer(state, {
      type: createOrder.fulfilled.type,
      payload: order
    });
    expect(state.orderRequest).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.order?.number).toBe(42);

    state = reducer(state, {
      type: createOrder.rejected.type,
      error: { message: 'Err' }
    });
    expect(state.error).toBe('Err');
  });

  it('should set/clear order modal data and get order by number', () => {
    let state = reducer(undefined, setOrderModalData(order));
    expect(state.orderModalData?.number).toBe(42);

    state = reducer(state, clearOrderModalData());
    expect(state.orderModalData).toBeNull();

    state = reducer(state, {
      type: getOrderByNumber.fulfilled.type,
      payload: order
    });
    expect(state.orderModalData?.number).toBe(42);

    state = reducer(state, clearOrder());
    expect(state.order).toBeNull();
  });
});
