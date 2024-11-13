import { useAuth0 } from '@auth0/auth0-react';
import { Loader } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';
import { AUDIENCE } from '../../auth/provider';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../../hooks/appStates';
import { userSlice } from '../../Store/user/user-slice';

const CallBack = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispach = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getAccessTokenSilently()
      .then((claims) => {
        const data: any = jwtDecode(claims);
        const role = data[`${AUDIENCE}/roles`][0];
        dispach(userSlice.actions.setRole(role));
        if (role == 'caixa') {
          navigate('/pedidos/cadastrar');
        } else {
          navigate('/');
        }
      })
      .catch((err) => {
        showNotification({
          message: err.message,
        });
      });
  }, []);

  return (
    <div className="flex h-[100vh] items-center justify-center">
      <Loader variant="dots" />
    </div>
  );
};

export default CallBack;
