import { RootState } from '../store';

export const selectConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;

export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;
