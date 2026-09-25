import { ingredientsReducer, fetchIngredients } from '../ingredients-slice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 50,
    image: 'img',
    image_large: 'img',
    image_mobile: 'img'
  },
  {
    _id: '2',
    name: 'Соус',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 10,
    price: 30,
    image: 'img',
    image_large: 'img',
    image_mobile: 'img'
  }
];

describe('ingredientsSlice reducer', () => {
  it('должен вернуть начальное состояние при неизвестном экшене', () => {
    const initialState = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(initialState).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  it('должен обработать fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(undefined, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обработать fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен обработать fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка сети' }
    };
    const state = ingredientsReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сети');
  });
});
