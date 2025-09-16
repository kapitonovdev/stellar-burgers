import reducer, { fetchIngredients } from './ingredients';
import { TIngredient } from '../../utils/types';

describe('ingredients slice', () => {
  const items: TIngredient[] = [
    {
      _id: 'bun1',
      name: 'Булка 1',
      type: 'bun',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 100,
      image: '/img',
      image_large: '/img',
      image_mobile: '/img'
    }
  ];

  it('should return initial state', () => {
    const state = reducer(undefined, { type: 'unknown' } as any);
    expect(state).toEqual({ ingredients: [], isLoading: false, error: null });
  });

  it('should handle fetchIngredients.pending', () => {
    const state = reducer(undefined, { type: fetchIngredients.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const state = reducer(undefined, {
      type: fetchIngredients.fulfilled.type,
      payload: items
    });
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(items);
  });

  it('should handle fetchIngredients.rejected', () => {
    const state = reducer(undefined, {
      type: fetchIngredients.rejected.type,
      error: { message: 'Failed' }
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Failed');
  });
});
