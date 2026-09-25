import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructor-slice';
import { TIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-1',
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
};

const main: TIngredient = {
  _id: 'main-1',
  name: 'Котлета',
  type: 'main',
  proteins: 20,
  fat: 15,
  carbohydrates: 5,
  calories: 200,
  price: 100,
  image: 'img',
  image_large: 'img',
  image_mobile: 'img'
};

const sauce: TIngredient = {
  _id: 'sauce-1',
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
};

describe('constructorSlice reducer', () => {
  it('должен вернуть начальное состояние при неизвестном экшене', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('должен добавить булку через addIngredient', () => {
    const action = addIngredient(bun);
    const state = constructorReducer(undefined, action);

    expect(state.bun).toMatchObject({ ...bun });
    expect(state.bun?.id).toBeDefined();
    expect(state.ingredients).toEqual([]);
  });

  it('должен заменить булку, если добавить новую', () => {
    const newBun = { ...bun, _id: 'bun-2', name: 'Новая булка' };
    let state = constructorReducer(undefined, addIngredient(bun));
    state = constructorReducer(state, addIngredient(newBun));

    expect(state.bun?._id).toBe('bun-2');
  });

  it('должен добавить начинку через addIngredient', () => {
    const action = addIngredient(main);
    const state = constructorReducer(undefined, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject({ ...main });
    expect(state.ingredients[0].id).toBeDefined();
    expect(state.bun).toBeNull();
  });

  it('должен добавить несколько начинок', () => {
    let state = constructorReducer(undefined, addIngredient(main));
    state = constructorReducer(state, addIngredient(sauce));

    expect(state.ingredients).toHaveLength(2);
  });

  it('должен удалить ингредиент через removeIngredient', () => {
    let state = constructorReducer(undefined, addIngredient(main));
    const id = state.ingredients[0].id;

    state = constructorReducer(state, removeIngredient(id));

    expect(state.ingredients).toHaveLength(0);
  });

  it('не должен удалить ингредиент с несуществующим id', () => {
    let state = constructorReducer(undefined, addIngredient(main));
    state = constructorReducer(state, removeIngredient('unknown-id'));

    expect(state.ingredients).toHaveLength(1);
  });

  it('должен переместить ингредиент через moveIngredient', () => {
    let state = constructorReducer(undefined, addIngredient(main));
    state = constructorReducer(state, addIngredient(sauce));

    const [firstId, secondId] = state.ingredients.map((i) => i.id);
    state = constructorReducer(state, moveIngredient({ from: 0, to: 1 }));

    expect(state.ingredients[0].id).toBe(secondId);
    expect(state.ingredients[1].id).toBe(firstId);
  });

  it('должен очистить конструктор через clearConstructor', () => {
    let state = constructorReducer(undefined, addIngredient(bun));
    state = constructorReducer(state, addIngredient(main));
    state = constructorReducer(state, addIngredient(sauce));

    state = constructorReducer(state, clearConstructor());

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
