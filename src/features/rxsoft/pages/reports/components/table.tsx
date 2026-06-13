import { Card, Table, Text, Stack } from '@mantine/core';

export function ReportsTable({
  title,
  description,
  columns,
  rows,
}: {
  title: string;
  description: string;
  columns: string[];
  rows: React.ReactNode;
}) {
  return (
    <Card withBorder p="md">
      <Stack gap={4} mb="md">
        <Text fw={600}>{title}</Text>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      </Stack>

      <Table
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        horizontalSpacing="md"
        verticalSpacing="sm"
      >
        <Table.Thead>
          <Table.Tr>
            {columns.map((column) => (
              <Table.Th key={column}>
                <Text size="sm" c="dimmed" fw={500}>
                  {column}
                </Text>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Card>
  );
}
