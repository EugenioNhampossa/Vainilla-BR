import {
  Text,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconExclamationCircle } from '@tabler/icons';
import { useParams } from 'react-router-dom';
import { useModals } from '@mantine/modals';
import * as Yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { useState } from 'react';

const schema = Yup.object().shape({
  oldPassword: Yup.string().required('Insira a senha actual'),
  newPassword: Yup.string()
    .required('Insira a nova senha')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
  newPassConf: Yup.string().oneOf(
    [Yup.ref('newPassword'), null],
    'As senhas devem ser as mesmas',
  ),
});

const onError = (data: any) => {
  showNotification({
    title: <Text fw="bold">Falha na busca do usuário</Text>,
    message: (
      <Text color="dimmed">{data.response.data.message || data.message}</Text>
    ),
    color: 'red',
    autoClose: false,
    icon: <IconExclamationCircle />,
  });
};

const UsuarioInfo = () => {

  const form = useForm({
    validate: yupResolver(schema),
    transformValues: (values) => {
      return {
        oldPassword: values.oldPassword.trim(),
        newPassword: values.newPassword.trim(),
        newPassConf: values.newPassConf.trim(),
      };
    },
  });

  return (
    <>
     
    </>
  );
};

export default UsuarioInfo;
