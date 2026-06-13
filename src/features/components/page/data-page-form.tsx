import { Button, Group, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { useModuleContext } from '@/context/module-context';
import type { ModelConfig } from '@/features/shared/model-schema';
import { FieldGroup } from '../form/FieldGroup';
import { TabGroups } from '../form/tab-groups';
import { RxPage } from './rx-page';

type DataPageFormProps = {
  config: ModelConfig;
};

export function DataPageForm({ config }: DataPageFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const moduleContext = useModuleContext();
  const apiProvider = config.apiProvider ?? moduleContext.apiProvider;

  const {
    title,
    description,
    endpoint,
    createFields,
    createFieldGroups,
    tabGroups,
    buildCreatePayload,
    defaultState,
    modalTitle,
    renderCreateExtras,
  } = config;

  const fieldGroups = createFieldGroups ?? (createFields ? [{ fields: createFields }] : []);

  const [formState, setFormState] = useState<Record<string, unknown>>(defaultState ?? {});

  const updateField = (name: string, value: unknown) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const payload = buildCreatePayload ? buildCreatePayload(values) : values;
      const response = await apiProvider!.post(endpoint, payload);
      return response.data as Record<string, unknown>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['rxsoft-data-page', endpoint],
      });
      notifications.show({ message: `${title} record created` });
      navigate({ to: '..' });
    },
    onError: (error: any) => {
      notifications.show({
        color: 'red',
        message: `Failed to create ${title.toLowerCase()} record - ${error.data?.message ?? error?.data?.error?.message ?? error?.response?.data?.message ?? error?.response?.data?.error?.message ?? error.message}`,
      });
    },
  });

  return (
    <RxPage title={modalTitle ?? `Create ${title}`} description={description}>
      <Stack gap="lg">
        <Text size="sm" c="dimmed">
          Add a new record to the {title.toLowerCase()} module.
        </Text>

        <Stack gap="xl">
          {tabGroups && (
            <TabGroups tabGroups={tabGroups} formState={formState} updateField={updateField} />
          )}
          {fieldGroups.map((fieldGroup, index) => (
            <FieldGroup
              key={index}
              index={index}
              fieldGroup={fieldGroup}
              formState={formState}
              updateField={updateField}
            />
          ))}
          {renderCreateExtras?.({
            formState,
            updateField,
          })}
        </Stack>

        <Group justify="flex-end">
          <Button variant="outline" onClick={() => navigate({ to: '..' })}>
            Cancel
          </Button>
          <Button
            onClick={() => mutation.mutate(formState)}
            disabled={mutation.isPending}
            leftSection={mutation.isPending ? <Loader size={16} /> : null}
          >
            Create
          </Button>
        </Group>
      </Stack>
    </RxPage>
  );
}
