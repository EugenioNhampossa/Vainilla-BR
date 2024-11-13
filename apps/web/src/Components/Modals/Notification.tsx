import { Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconExclamationCircle, IconCheck } from '@tabler/icons';

interface NotifyProps {
  type: 'error' | 'success' | 'updated';
  title: string;
  message?: string;
  data?: any;
}

export const notify = ({ type, title, message, data }: NotifyProps) => {
  let color = 'blue';
  if (type == 'error') color = 'red';
  if (type == 'success') color = 'green';

  showNotification({
    title: <Text fw="bold">{title}</Text>,
    message: (
      <Text color="dimmed">
        {message ? message : data.response.data.message || data.message || data}
      </Text>
    ),
    color: color,
    autoClose: type != 'error',
    icon: type != 'error' ? <IconCheck /> : <IconExclamationCircle />,
  });
};
