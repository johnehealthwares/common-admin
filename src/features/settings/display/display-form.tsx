import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Checkbox, Group, Stack, Text } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { showSubmittedData } from '@/lib/show-submitted-data';

const items = [
  {
    id: 'recents',
    label: 'Recents',
  },
  {
    id: 'home',
    label: 'Home',
  },
  {
    id: 'applications',
    label: 'Applications',
  },
  {
    id: 'desktop',
    label: 'Desktop',
  },
  {
    id: 'downloads',
    label: 'Downloads',
  },
  {
    id: 'documents',
    label: 'Documents',
  },
] as const;

const displayFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
});

type DisplayFormValues = z.infer<typeof displayFormSchema>;

const defaultValues: Partial<DisplayFormValues> = {
  items: ['recents', 'home'],
};

export function DisplayForm() {
  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Box component="form" onSubmit={handleSubmit((data) => showSubmittedData(data))}>
      <Stack gap="xl">
        <Box>
          <Text fw={500} size="md">
            Sidebar
          </Text>

          <Text size="sm" c="dimmed" mb="md">
            Select the items you want to display in the sidebar.
          </Text>

          <Controller
            control={control}
            name="items"
            render={({ field }) => (
              <Stack gap="sm">
                {items.map((item) => (
                  <Checkbox
                    key={item.id}
                    label={item.label}
                    checked={field.value?.includes(item.id)}
                    onChange={(event) => {
                      const checked = event.currentTarget.checked;

                      if (checked) {
                        field.onChange([...(field.value || []), item.id]);
                      } else {
                        field.onChange(field.value?.filter((value) => value !== item.id));
                      }
                    }}
                  />
                ))}
              </Stack>
            )}
          />

          {errors.items && (
            <Text c="red" size="sm" mt="sm">
              {errors.items.message}
            </Text>
          )}
        </Box>

        <Group>
          <Button type="submit">Update display</Button>
        </Group>
      </Stack>
    </Box>
  );
}
