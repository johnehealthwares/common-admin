// components/GenericViewComponent.tsx

import { Box, Card, Center, Divider, Grid, Loader, Stack, Table, Text, Title } from '@mantine/core';
import { View } from '@/features/rxsoft/types';

type Props<T> = {
  view: View<T>;
  data?: T | null;
};

export function GenericViewComponent<T>({ view, data }: Props<T>) {
  const isLoading = !data || (typeof data === 'object' && Object.keys(data as object).length === 0);

  return (
    <Stack gap="lg">
      {/* PAGE TITLE */}
      {view.title && <Title order={2}>{view.title}</Title>}

      {/* FIELD GROUPS */}
      {view.fieldGroups?.map((group, groupIndex) => (
        <Card key={groupIndex} withBorder radius="md" p="lg">
          {/* SECTION TITLE ALWAYS VISIBLE */}
          {group.title && (
            <>
              <Title order={4} mb="md">
                {group.title}
              </Title>

              <Divider mb="lg" />
            </>
          )}

          {/* SHOW LOADER UNTIL DATA EXISTS */}
          {isLoading ? (
            <Center py="xl">
              <Loader size="md" />
            </Center>
          ) : (
            <Grid>
              {group.fields.map((field) => {
                let value: any;

                if ((field.key as string).includes('.')) {
                  const node = (field.key as string).split('.')[0];
                  const code = (field.key as string).split('.')[1];
                  value = (data as any)[node]?.find(
                    (cc: any) => cc.attribute?.code === code
                  )?.value;
                } else {
                  value = (data as any)?.[field.key];
                }

                return (
                  <Grid.Col key={String(field.key)} span={field.col || 3}>
                    <Stack gap={4}>
                      <Text size="sm" c="dimmed">
                        {field.label}
                      </Text>

                      <Box>{field.render ? field.render(value, data) : String(value ?? '-')}</Box>
                    </Stack>
                  </Grid.Col>
                );
              })}
            </Grid>
          )}
        </Card>
      ))}

      {/* TABLE SECTIONS */}
      {view.lists?.map((list, listIndex) => {
        const rows = isLoading ? [] : ((data as any)[list.key] as any[]) || [];

        return (
          <Card key={listIndex} withBorder radius="md" p="lg">
            {/* TABLE TITLE ALWAYS VISIBLE */}
            <Title order={4} mb="md">
              {list.title}
            </Title>

            {/* SHOW LOADER UNTIL DATA EXISTS */}
            {isLoading ? (
              <Center py="xl">
                <Loader size="md" />
              </Center>
            ) : (
              <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    {list.columns.map((column) => (
                      <Table.Th key={String(column.key)}>{column.label}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                  {rows.map((row, rowIndex) => (
                    <Table.Tr key={rowIndex}>
                      {list.columns.map((column) => {
                        const value = row[column.key];

                        return (
                          <Table.Td key={String(column.key)}>
                            {column.render ? column.render(value, row) : String(value ?? '-')}
                          </Table.Td>
                        );
                      })}
                    </Table.Tr>
                  ))}
                </Table.Tbody>

                {list.footer && (
                  <Table.Tfoot>
                    <Table.Tr>{list.footer(rows)}</Table.Tr>
                  </Table.Tfoot>
                )}
              </Table>
            )}
          </Card>
        );
      })}
    </Stack>
  );
}
