import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './burgerConstructor';
import { TIngredient } from '../../utils/types';

describe('burgerConstructor slice', () => {
  const bun: TIngredient = {
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
  };

  const main: TIngredient = {
    _id: 'main1',
    name: 'Котлета 1',
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 50,
    image: '/img',
    image_large: '/img',
    image_mobile: '/img'
  };

  it('should return initial state', () => {
    const state = reducer(undefined, { type: 'unknown' } as any);
    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  it('should set bun when adding bun', () => {
    const state = reducer(undefined, addIngredient(bun));
    expect(state.bun?._id).toBe('bun1');
    expect(state.ingredients).toHaveLength(0);
  });

  it('should add ingredient when adding main', () => {
    let state = reducer(undefined, addIngredient(bun));
    state = reducer(state, addIngredient(main));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe('main1');
  });

  it('should remove ingredient by id', () => {
    let state = reducer(undefined, addIngredient(main));
    const id = state.ingredients[0].id;
    state = reducer(state, removeIngredient(id));
    expect(state.ingredients).toHaveLength(0);
  });

  it('should reorder ingredients', () => {
    let state = reducer(undefined, addIngredient(main));
    state = reducer(
      state,
      addIngredient({ ...main, _id: 'main2', name: 'Котлета 2' })
    );
    const firstId = state.ingredients[0].id;
    state = reducer(state, moveIngredient({ dragIndex: 0, hoverIndex: 1 }));
    expect(state.ingredients[1].id).toBe(firstId);
  });

  it('should clear constructor', () => {
    let state = reducer(undefined, addIngredient(bun));
    state = reducer(state, addIngredient(main));
    state = reducer(state, clearConstructor());
    expect(state).toEqual({ bun: null, ingredients: [] });
  });
});
