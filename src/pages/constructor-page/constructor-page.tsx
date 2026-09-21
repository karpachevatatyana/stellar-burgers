import { FC } from 'react';
import { ConstructorPageUI } from '@ui-pages';
import { useAppSelector } from '../../services/hooks';
import { selectIngredientsLoading } from '../../services/selectors/ingredients-selectors';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useAppSelector(selectIngredientsLoading);
  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
