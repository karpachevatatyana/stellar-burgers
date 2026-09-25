import { FC, SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { loginUser } from '../../services/slices/user-slice';
import { selectUserError } from '../../services/selectors/user-selectors';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const errorText = useAppSelector(selectUserError);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then((result) => {
      if (loginUser.fulfilled.match(result)) {
        navigate(from, { replace: true });
      }
    });
  };

  return (
    <LoginUI
      errorText={errorText ?? undefined}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
