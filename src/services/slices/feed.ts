import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';

type TFeedState = {
  orders: TOrder[];
  userOrders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  userOrders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds',
  async () => await getFeedsApi()
);

export const fetchUserOrders = createAsyncThunk(
  'feed/fetchUserOrders',
  async () => await getOrdersApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch feeds';
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user orders';
      });
  }
});

export const getFeedOrders = (state: { feed: TFeedState }) => state.feed.orders;
export const getUserOrders = (state: { feed: TFeedState }) =>
  state.feed.userOrders;
export const getFeedStats = (state: { feed: TFeedState }) => ({
  total: state.feed.total,
  totalToday: state.feed.totalToday
});
export const getFeedLoading = (state: { feed: TFeedState }) =>
  state.feed.isLoading;
export const getFeedError = (state: { feed: TFeedState }) => state.feed.error;

export default feedSlice.reducer;
