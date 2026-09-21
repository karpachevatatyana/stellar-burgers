import { RootState } from '../store';

export const selectFeedOrders = (state: RootState) => state.feed.orders;

export const selectFeedTotal = (state: RootState) => state.feed.total;

export const selectFeedTotalToday = (state: RootState) => state.feed.totalToday;

export const selectUserOrders = (state: RootState) => state.feed.userOrders;

export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
