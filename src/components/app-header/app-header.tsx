import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '../../services/hooks';
import { selectUser } from '../../services/selectors/user-selectors';

export const AppHeader: FC = () => {
  const user = useAppSelector(selectUser);
  return <AppHeaderUI userName={user?.name} />;
};
