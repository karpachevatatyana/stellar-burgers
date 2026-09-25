import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { registerUser } from '../../services/slices/user-slice';
import { selectUserError } from '../../services/selectors/user-selectors';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const errorText = useAppSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name: userName, email, password })).then(
      (result) => {
        if (registerUser.fulfilled.match(result)) {
          navigate('/', { replace: true });
        }
      }
    );
  };

  return (
    <RegisterUI
      errorText={errorText ?? undefined}
      email={email}
      setEmail={setEmail}
      userName={userName}
      setUserName={setUserName}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
