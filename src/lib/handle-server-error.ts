import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';

export function handleServerError(error: unknown) {
  // eslint-disable-next-line no-console
  console.log(error, (error as any).response);

  let errMsg = 'Something went wrong!';

  if (error && typeof error === 'object' && 'status' in error && Number(error.status) === 204) {
    errMsg = 'Content not found.';
  }

  if (error instanceof AxiosError) {
    errMsg = error.response?.data?.error?.message;
  }

  notifications.show({ title: 'Server Error', message: errMsg, color: 'red' });
}
