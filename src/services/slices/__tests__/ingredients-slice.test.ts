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
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  it('должен обработать fetchIngredients.pending — включить загрузку и сбросить ошибку', () => {
    // Начинаем с состояния, где была ошибка — проверяем, что pending её сбрасывает
    const previousState = {
      ingredients: [],
      isLoading: false,
      error: 'Ошибка'
    };

    const state = ingredientsReducer(
      previousState,
      fetchIngredients.pending('test-request-id', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обработать fetchIngredients.fulfilled — сохранить данные и сбросить загрузку', () => {
    // Начинаем с состояния, где идёт загрузка — проверяем, что fulfilled её сбрасывает
    const previousState = {
      ingredients: [],
      isLoading: true,
      error: null
    };

    const state = ingredientsReducer(
      previousState,
      fetchIngredients.fulfilled(mockIngredients, 'test-request-id', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен обработать fetchIngredients.rejected — сохранить ошибку и сбросить загрузку', () => {
    // Начинаем с состояния, где идёт загрузка — проверяем, что rejected её сбрасывает
    const previousState = {
      ingredients: [],
      isLoading: true,
      error: null
    };

    const state = ingredientsReducer(
      previousState,
      fetchIngredients.rejected(
        new Error('Ошибка сети'),
        'test-request-id',
        undefined
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сети');
  });
});
