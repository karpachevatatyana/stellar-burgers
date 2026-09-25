import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { selectUserOrders } from '../../services/selectors/feed-selectors';
import { fetchUserOrders } from '../../services/slices/feed-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectUserOrders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
