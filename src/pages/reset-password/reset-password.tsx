import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { resetPassword } from '../../services/slices/user-slice';
import { selectUserError } from '../../services/selectors/user-selectors';

export const ResetPassword: FC = () => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const errorText = useAppSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(resetPassword({ password, token })).then((result) => {
      if (resetPassword.fulfilled.match(result)) {
        navigate('/login', { replace: true });
      }
    });
  };

  return (
    <ResetPasswordUI
      errorText={errorText ?? undefined}
      password={password}
      setPassword={setPassword}
      token={token}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
