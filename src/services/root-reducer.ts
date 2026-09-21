import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredients-slice';
import { constructorReducer } from './slices/constructor-slice';
import { orderReducer } from './slices/order-slice';
import { userReducer } from './slices/user-slice';
import { feedReducer } from './slices/feed-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer
});
