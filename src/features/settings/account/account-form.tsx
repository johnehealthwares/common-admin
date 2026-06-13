import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, Button, Stack, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { showSubmittedData } from '@/lib/show-submitted-data';

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const;

const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Please enter your name.')
    .min(2, 'Name must be at least 2 characters.')
    .max(30, 'Name must not be longer than 30 characters.'),
  dob: z.date('Please select your date of birth.').nullable(),
  language: z.string('Please select a language.'),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  name: '',
  language: '',
};

export function AccountForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  function onSubmit(data: AccountFormValues) {
    showSubmittedData(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Stack gap="lg">
        {/* NAME */}
        <TextInput
          label="Name"
          placeholder="Your name"
          {...form.register('name')}
          description="This is the name that will be displayed on your profile and in emails."
        />

        {/* DATE OF BIRTH */}
        <DatePickerInput
          label="Date of birth"
          placeholder="Pick date"
          value={form.watch('dob')}
          onChange={(value: any) => form.setValue('dob', value)}
          description="Your date of birth is used to calculate your age."
        />

        {/* LANGUAGE */}
        <Select
          label="Language"
          placeholder="Select language"
          data={languages.map((l) => ({
            value: l.value,
            label: l.label,
          }))}
          value={form.watch('language')}
          onChange={(value: any) => form.setValue('language', value || '')}
          searchable
          description="This is the language that will be used in the dashboard."
        />

        {/* SUBMIT */}
        <Button type="submit">Update account</Button>
      </Stack>
    </form>
  );
}
