import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { forgotPassword } from '../../services/slices/user-slice';
import { selectUserError } from '../../services/selectors/user-selectors';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const errorText = useAppSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgotPassword({ email })).then((result) => {
      if (forgotPassword.fulfilled.match(result)) {
        navigate('/reset-password', { replace: true });
      }
    });
  };

  return (
    <ForgotPasswordUI
      errorText={errorText ?? undefined}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
