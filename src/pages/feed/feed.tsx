import { FC, useEffect } from 'react';
import { FeedUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { selectFeedOrders } from '../../services/selectors/feed-selectors';
import { fetchFeeds } from '../../services/slices/feed-slice';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectFeedOrders);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
