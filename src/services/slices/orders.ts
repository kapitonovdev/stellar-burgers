import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';

type TOrderState = {
  order: TOrder | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  order: null,
  orderRequest: false,
  orderModalData: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'orders/create',
  async (ingredients: string[]) => {
    const result = await orderBurgerApi(ingredients);
    return result.order;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getByNumber',
  async (number: number) => {
    const result = await getOrderByNumberApi(number);
    return result.orders[0];
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    },
    setOrderModalData: (state, action) => {
      state.orderModalData = action.payload;
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create order';
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModalData = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch order';
      });
  }
});

export const { clearOrder, setOrderModalData, clearOrderModalData } =
  ordersSlice.actions;

export const getOrder = (state: { orders: TOrderState }) => state.orders.order;
export const getOrderRequest = (state: { orders: TOrderState }) =>
  state.orders.orderRequest;
export const getOrderModalData = (state: { orders: TOrderState }) =>
  state.orders.orderModalData;
export const getOrdersLoading = (state: { orders: TOrderState }) =>
  state.orders.isLoading;
export const getOrdersError = (state: { orders: TOrderState }) =>
  state.orders.error;

export default ordersSlice.reducer;
