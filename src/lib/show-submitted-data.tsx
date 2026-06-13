import { notifications } from '@mantine/notifications';

export function showSubmittedData(
  data: any,
  title: string = 'You submitted the following values:'
) {
  notifications.show({
    title,
    message: (
      <pre className="mt-2 w-full overflow-x-auto rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>
    ),
  });
}
