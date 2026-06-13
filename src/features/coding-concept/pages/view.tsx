import {
  Badge,
  Card,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { AlignLeft, Clipboard, Code, File, Form, Info, TypeIcon } from 'lucide-react';

type Field = {
  name: string;
  label: string;
  type?: string;
  col?: number;
};

const conceptFields: Field[] = [
  {
    name: 'concept',
    label: 'Concept',
    type: 'select',
    col: 6,
  },
  {
    name: 'code',
    label: 'Code',
    col: 6,
  },
  {
    name: 'shortName',
    label: 'Short name',
    col: 6,
  },
  {
    name: 'longName',
    label: 'Long name',
    col: 6,
  },
  {
    name: 'shortDescription',
    label: 'Short description',
    type: 'textarea',
    col: 6,
  },
  {
    name: 'fullDescription',
    label: 'Full description',
    type: 'textarea',
    col: 12,
  },
];

const concept = {
  concept: 'LOINC',
  code: 'LOINC-12345',
  shortName: 'CBC',
  longName: 'Complete Blood Count',
  shortDescription: 'Brief label used in compact views',
  fullDescription:
    'A complete blood count is a blood test used to evaluate overall health and detect a wide range of disorders.',
};

const getFieldIcon = (field: Field) => {
  if (field.name === 'code') {
    return <Code size={18} />;
  }

  if (field.type === 'textarea') {
    return <AlignLeft size={18} />;
  }

  if (field.type === 'select') {
    return <Form size={18} />;
  }

  return <TypeIcon size={18} />;
};

export default function ConceptDetailsPage() {
  const basicFields = conceptFields.filter((field) => field.type !== 'textarea');

  const descriptionFields = conceptFields.filter((field) => field.type === 'textarea');

  return (
    <Stack p="lg" gap="lg">
      {/* Header */}
      <Card withBorder radius="lg" p="lg">
        <Group align="flex-start">
          <ThemeIcon size={54} radius="md" variant="light">
            <Clipboard size={28} />
          </ThemeIcon>

          <div>
            <Group gap="sm">
              <Title order={2}>{concept.longName}</Title>

              <Badge size="lg" variant="light">
                {concept.concept}
              </Badge>
            </Group>

            <Text mt={6} c="dimmed">
              {concept.code}
            </Text>
          </div>
        </Group>
      </Card>

      {/* Basic Information */}
      <Card withBorder radius="lg" p="lg">
        <Stack gap="md">
          <Group gap="sm">
            <ThemeIcon variant="light">
              <Info size={18} />
            </ThemeIcon>

            <Title order={4}>Basic Information</Title>
          </Group>

          <Divider />

          <Grid>
            {basicFields.map((field) => (
              <Grid.Col key={field.name} span={field.col || 12}>
                <Paper withBorder radius="md" p="md">
                  <Group align="flex-start" wrap="nowrap">
                    <ThemeIcon variant="light">{getFieldIcon(field)}</ThemeIcon>

                    <div style={{ flex: 1 }}>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                        {field.label}
                      </Text>

                      <Text fw={500} mt={4}>
                        {concept[field.name as keyof typeof concept]}
                      </Text>
                    </div>
                  </Group>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Card>

      {/* Descriptions */}
      <Card withBorder radius="lg" p="lg">
        <Stack gap="md">
          <Group gap="sm">
            <ThemeIcon variant="light">
              <File size={18} />
            </ThemeIcon>

            <Title order={4}>Descriptions</Title>
          </Group>

          <Divider />

          <Grid>
            {descriptionFields.map((field) => (
              <Grid.Col key={field.name} span={field.col || 12}>
                <Paper withBorder radius="md" p="md">
                  <Stack gap={8}>
                    <Group gap="sm">
                      <ThemeIcon variant="light">{getFieldIcon(field)}</ThemeIcon>

                      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                        {field.label}
                      </Text>
                    </Group>

                    <Text style={{ lineHeight: 1.7 }}>
                      {concept[field.name as keyof typeof concept]}
                    </Text>
                  </Stack>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}
