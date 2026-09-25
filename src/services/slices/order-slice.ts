import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

// TNewOrder не экспортируется из burger-api, объявляем локально
type TNewOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  price: number;
};

type TNewOrderResponse = {
  order: TNewOrder;
  name: string;
};

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderByNumber: TOrder | null;
  isLoadingOrder: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderByNumber: null,
  isLoadingOrder: false,
  error: null
};

export const createOrder = createAsyncThunk<TNewOrderResponse, string[]>(
  'order/create',
  async (ingredientIds) => {
    const res = await orderBurgerApi(ingredientIds);
    return res as unknown as TNewOrderResponse;
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchByNumber',
  async (number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    },
    clearOrderByNumber: (state) => {
      state.orderByNumber = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order as unknown as TOrder;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Ошибка оформления заказа';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoadingOrder = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoadingOrder = false;
        state.orderByNumber = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoadingOrder = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrderModal, clearOrderByNumber } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
